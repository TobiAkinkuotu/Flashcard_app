import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload { sub: number; }

declare global {
  namespace Express { interface Request { userId?: number; } }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
