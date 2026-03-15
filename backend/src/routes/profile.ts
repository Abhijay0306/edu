import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/profiles/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.params.userId },
      include: { user: true },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('GET profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/profiles/:userId  — create or update
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const {
      gpa, preferredCountry, preferredProgram, courseField,
      courseType, intakeYear, englishScore, budget,
    } = req.body;
    const userId = req.params.userId;

    // Ensure user row exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@studyabroad.app`, name: 'Guest User' },
    });

    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: { gpa, preferredCountry, preferredProgram, courseField, courseType, intakeYear, englishScore, budget },
      create: { userId, gpa, preferredCountry, preferredProgram, courseField, courseType, intakeYear, englishScore, budget },
    });
    res.json(profile);
  } catch (err) {
    console.error('POST profile error:', err);
    res.status(500).json({ error: 'Internal server error', detail: String(err) });
  }
});

export default router;
