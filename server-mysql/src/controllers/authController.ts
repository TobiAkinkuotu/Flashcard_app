import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findByEmail } from '../services/userService';

const sign = (userId: number) => {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ sub: userId }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, avatarUrl } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const existing = await findByEmail(email);
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const user = await createUser(name, email, password, avatarUrl);
  const token = sign(user.id);
  return res.status(201).json({ token, user: sanitize(user) });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
  const user = await findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = sign(user.id);
  return res.json({ token, user: sanitize(user) });
};

const sanitize = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatarUrl: u.avatar_url,
  subscription: { tier: u.subscription_tier, renewsOn: u.subscription_renews_on },
  createdAt: u.created_at,
  updatedAt: u.updated_at,
});
