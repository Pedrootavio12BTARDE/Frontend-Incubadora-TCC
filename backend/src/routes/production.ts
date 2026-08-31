import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let prod = await prisma.production.findFirst();
    if (!prod) {
      prod = await prisma.production.create({ data: {} });
    }
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: 'failed to read production' });
  }
});

router.post('/increment', async (req, res) => {
  try {
    const { amount = 1, color } = req.body;
    let prod = await prisma.production.findFirst();
    if (!prod) prod = await prisma.production.create({ data: {} });
    const updated = await prisma.production.update({ where: { id: prod.id }, data: { eggs: prod.eggs + Number(amount), lastColor: color || prod.lastColor } });
    const io = req.app.get('io');
    if (io) io.emit('production:update', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'failed to increment production' });
  }
});

export default router;
