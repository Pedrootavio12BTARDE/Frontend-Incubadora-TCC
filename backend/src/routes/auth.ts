import { Router } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

router.post('/login', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const passwordIsValid = user.password.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : process.env.NODE_ENV !== 'production' && password === user.password;
    if (!passwordIsValid) return res.status(401).json({ error: 'invalid credentials' });

    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev');
    if (!secret) return res.status(503).json({ error: 'authentication is not configured' });

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'failed to login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : null;

    if (!email || password.length < 8) {
      return res.status(400).json({ error: 'a valid email and password of at least 8 characters are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'email is already registered' });

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 12),
        name: name || null,
        role: 'operator',
      },
    });

    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev');
    if (!secret) return res.status(503).json({ error: 'authentication is not configured' });

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '8h' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'failed to register user' });
  }
});

export default router;
