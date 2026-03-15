import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Search universities
router.get('/search', async (req, res) => {
  try {
    const { country, programLevel } = req.query;
    
    // Simple filter conditions
    const where: any = {};
    if (country) {
      where.country = { name: { contains: String(country), mode: 'insensitive' } };
    }
    
    // If program level provided, filter universities having that program level
    if (programLevel) {
      where.programs = { some: { level: String(programLevel) } };
    }

    const universities = await prisma.university.findMany({
      where,
      include: { country: true, programs: true }
    });
    
    res.json(universities);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cost estimation
router.post('/cost-estimate', async (req, res) => {
  try {
    const { programId } = req.body;
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: { university: { include: { country: true } } }
    });
    
    if (!program) return res.status(404).json({ error: 'Program not found' });

    // Mock calculations for cost components
    const annualTuition = program.tuitionFee;
    const duration = program.durationYears;
    const basicLivingCostPerYear = 15000; // Mock base depending on country
    const visaAndTravel = 3000; // Mock fixed cost

    const totalEstimate = (annualTuition + basicLivingCostPerYear) * duration + visaAndTravel;

    res.json({
      program: program.title,
      university: program.university.name,
      country: program.university.country.name,
      tuitionCost: annualTuition * duration,
      livingCost: basicLivingCostPerYear * duration,
      visaAndTravel: visaAndTravel,
      totalEstimate
    });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
