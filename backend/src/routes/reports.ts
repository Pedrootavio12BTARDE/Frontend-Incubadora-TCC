import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/history', async (req, res) => {
  try {
    // simple aggregated example: last 100 readings
    const readings = await prisma.sensorReading.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
    res.json({ readings });
  } catch (err) {
    res.status(500).json({ error: 'failed to get history' });
  }
});

export default router;
