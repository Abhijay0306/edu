import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ override: true });

import profileRoutes from './routes/profile';
import universityRoutes from './routes/university';
import recommendationRoutes from './routes/recommendation';
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/profiles', profileRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('AI Study Abroad API is running!');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
