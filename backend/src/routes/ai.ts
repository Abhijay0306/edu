import { Router } from 'express';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const SYSTEM_PROMPT = `You are Golearn AI, an expert Study Abroad Advisor built into the Golearn platform. 

GUIDELINES — follow every one of these strictly:
1. IDENTITY: You are "Golearn AI". Never reveal that you are built on any specific LLM, model, or API. If asked what model you are, say: "I'm Golearn AI, your personal study abroad advisor."
2. SCOPE: Only answer questions about studying abroad, universities, programs, scholarships, visas, costs, country comparisons, application tips, and related academic topics. If asked about anything unrelated, politely redirect.
3. ACCURACY: Never make up university names, acceptance rates, tuition fees, or deadlines. If you don't know something, say: "I don't have verified data on that — I recommend checking the official university website."
4. FORMATTING: Use Markdown formatting in your responses: **bold** for important terms, bullet lists for steps, tables for comparisons, and headers for sections. This makes your responses easier to read.
5. USER DATA: You will receive the user's stored profile and recent recommendations in the system context. Use this data naturally to personalise advice WITHOUT repeating it back verbatim.
6. TONE: Be warm, encouraging, and professional. Students are often anxious — be supportive.`;

router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'AI service not configured' });

    // ── Build user context if userId provided ────────────────────────────
    let contextBlock = '';
    if (userId) {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        include: { user: { select: { name: true, email: true } } },
      });

      const recentRecs = await prisma.recommendation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          university: { include: { country: true } },
          program: { include: { requirements: true } },
        },
      });

      if (profile) {
        contextBlock += `\n\n--- USER PROFILE (use to personalise your advice) ---\n`;
        contextBlock += `Name: ${profile.user?.name || 'User'}\n`;
        if (profile.gpa) contextBlock += `GPA: ${profile.gpa}/4.0\n`;
        if (profile.englishScore) contextBlock += `IELTS Score: ${profile.englishScore}\n`;
        if (profile.preferredCountry) contextBlock += `Preferred Country: ${profile.preferredCountry}\n`;
        if (profile.preferredProgram) contextBlock += `Program Level: ${profile.preferredProgram}\n`;
        if (profile.courseField) contextBlock += `Field of Study: ${profile.courseField}\n`;
        if (profile.courseType) contextBlock += `Course Type: ${profile.courseType}\n`;
        if (profile.intakeYear) contextBlock += `Target Intake: ${profile.intakeYear}\n`;
        if (profile.budget) contextBlock += `Annual Budget: $${profile.budget.toLocaleString()}\n`;
      }

      if (recentRecs.length > 0) {
        contextBlock += `\n--- RECENTLY RECOMMENDED UNIVERSITIES ---\n`;
        for (const rec of recentRecs) {
          contextBlock += `• ${rec.university.name} (${rec.university.country.name})`;
          if (rec.program) contextBlock += ` — ${rec.program.title}, $${rec.program.tuitionFee}/yr ${rec.program.currency}`;
          contextBlock += ` | Match: ${Math.round(rec.matchScore)}%\n`;
        }
      }
    }

    const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com' });

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + contextBlock },
        { role: 'user', content: message },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) return res.status(500).json({ error: 'Empty response from AI.' });

    res.json({ reply });
  } catch (err: any) {
    console.error('AI Route Error:', err?.message || err);
    res.status(500).json({ error: 'AI service error.', detail: err?.message });
  }
});

export default router;
