import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth: RequestHandler = (req, res, next) => {
  const authorization = req.header('Authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';

  if (!token) {
    return res.status(401).json({ error: 'authentication required' });
  }

  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev');
  if (!secret) {
    return res.status(503).json({ error: 'authentication is not configured' });
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    if (typeof payload.userId !== 'number') return res.status(401).json({ error: 'invalid token payload' });
    res.locals.authUserId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'invalid or expired authentication token' });
  }
};
