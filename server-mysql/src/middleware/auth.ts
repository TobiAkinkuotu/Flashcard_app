import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthPayload { sub: number; }

declare global {
  namespace Express { interface Request { userId?: number; } }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const secret: jwt.Secret = process.env.JWT_SECRET || 'dev_secret';
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    const rawSub = decoded.sub;
    const sub = typeof rawSub === 'string' ? parseInt(rawSub, 10) : rawSub;
    if (typeof sub !== 'number' || Number.isNaN(sub)) return res.status(401).json({ message: 'Invalid token' });
    req.userId = sub;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
