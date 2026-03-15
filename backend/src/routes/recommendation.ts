import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/recommendations/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return res.json([]);

    const filter: any = {};
    if (profile.preferredCountry) {
      const country = await prisma.country.findFirst({ where: { name: profile.preferredCountry } });
      if (country) filter.countryId = country.id;
    }

    const programs = await prisma.program.findMany({
      where: {
        ...(profile.preferredProgram ? { level: profile.preferredProgram } : {}),
        ...(profile.courseField ? { field: { contains: profile.courseField, mode: 'insensitive' } } : {}),
      },
      include: {
        university: { include: { country: true } },
        requirements: true,
      },
    });

    // Score each program
    const scored = programs.map(p => {
      let score = 70;
      const req = p.requirements[0];

      if (req) {
        if (profile.gpa && req.minGpa && profile.gpa >= req.minGpa) score += 10;
        if (profile.gpa && req.minGpa && profile.gpa < req.minGpa) score -= 15;
        if (profile.englishScore && req.minEnglish && profile.englishScore >= req.minEnglish) score += 10;
        if (profile.englishScore && req.minEnglish && profile.englishScore < req.minEnglish) score -= 15;
      }

      if (profile.budget && p.tuitionFee <= profile.budget) score += 10;
      if (profile.budget && p.tuitionFee > profile.budget * 1.2) score -= 20;

      if (profile.preferredCountry && p.university.country.name === profile.preferredCountry) score += 5;

      return {
        programId: p.id,
        universityId: p.university.id,
        program: p.title,
        university: p.university.name,
        country: p.university.country.name,
        annualTuition: p.tuitionFee,
        currency: p.currency,
        durationYears: p.durationYears,
        field: p.field,
        requirements: p.requirements[0] || null,
        matchScore: Math.max(0, Math.min(100, score)),
        ranking: p.university.ranking,
      };
    });

    const results = scored
      .filter(r => r.matchScore > 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    // Log recommendations to DB
    if (results.length > 0 && userId) {
      // Delete old recommendations for this user
      await prisma.recommendation.deleteMany({ where: { userId } });
      await prisma.recommendation.createMany({
        data: results.map(r => ({
          userId,
          universityId: r.universityId,
          programId: r.programId,
          matchScore: r.matchScore,
        })),
      });
    }

    res.json(results);
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;
