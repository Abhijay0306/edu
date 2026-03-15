import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'study_abroad_secret';

// Middleware: require SUPER_ADMIN
function requireSuperAdmin(req: Request, res: Response, next: Function) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as { role: string };
    if (decoded.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden: SUPER_ADMIN only' });
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/admin/universities
router.get('/universities', requireSuperAdmin, async (req: Request, res: Response) => {
  const unis = await prisma.university.findMany({
    include: { country: true, programs: { include: { requirements: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(unis);
});

// POST /api/admin/universities
router.post('/universities', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { name, countryId, description, website, ranking } = req.body;
    const uni = await prisma.university.create({ data: { name, countryId, description, website, ranking } });
    res.json(uni);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create university' });
  }
});

// PUT /api/admin/universities/:id
router.put('/universities/:id', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, website, ranking } = req.body;
    const uni = await prisma.university.update({
      where: { id: req.params.id },
      data: { name, description, website, ranking },
    });
    res.json(uni);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update university' });
  }
});

// DELETE /api/admin/universities/:id
router.delete('/universities/:id', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.university.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete university' });
  }
});

// GET /api/admin/users
router.get('/users', requireSuperAdmin, async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, profile: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!['STUDENT', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// GET /api/admin/stats
router.get('/stats', requireSuperAdmin, async (req: Request, res: Response) => {
  const [userCount, uniCount, programCount, recCount] = await Promise.all([
    prisma.user.count(),
    prisma.university.count(),
    prisma.program.count(),
    prisma.recommendation.count(),
  ]);
  res.json({ users: userCount, universities: uniCount, programs: programCount, recommendations: recCount });
});

// GET/POST/PUT/DELETE /api/admin/programs
router.post('/programs', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { title, universityId, level, field, tuitionFee, currency, durationYears, language, requirements } = req.body;
    const program = await prisma.program.create({
      data: {
        title, universityId, level, field, tuitionFee, currency, durationYears, language,
        requirements: requirements ? { create: requirements } : undefined,
      },
      include: { requirements: true },
    });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create program' });
  }
});

router.put('/programs/:id', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { title, level, field, tuitionFee, currency, durationYears, language } = req.body;
    const program = await prisma.program.update({
      where: { id: req.params.id },
      data: { title, level, field, tuitionFee, currency, durationYears, language },
    });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program' });
  }
});

router.delete('/programs/:id', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

export default router;
