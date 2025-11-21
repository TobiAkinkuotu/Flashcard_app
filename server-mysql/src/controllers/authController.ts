import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { createUser, findByEmail, findByIdentifier } from '../services/userService';

const sign = (userId: number) => {
  const secret: jwt.Secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ sub: userId } as jwt.JwtPayload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, avatarUrl, username } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const existing = await findByEmail(email);
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const user = await createUser(name, email, password, avatarUrl, username);
  const token = sign(user.id);
  return res.status(201).json({ token, user: sanitize(user) });
};

export const login = async (req: Request, res: Response) => {
  const { identifier, email, password } = req.body;
  const idValue = identifier || email;
  if (!idValue || !password) return res.status(400).json({ message: 'Missing credentials' });
  const user = await findByIdentifier(idValue);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = sign(user.id);
  return res.json({ token, user: sanitize(user) });
};

export const logout = async (_req: Request, res: Response) => {
  // With stateless JWT, logout is client-side (remove token). We just respond OK.
  return res.json({ message: 'Logged out' });
};

const sanitize = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatarUrl: u.avatar_url,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
});
