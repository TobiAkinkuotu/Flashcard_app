import { Request, Response } from 'express';
import { findById, updateUser } from '../services/userService';

const sanitize = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatarUrl: u.avatar_url,
  subscription: { tier: u.subscription_tier, renewsOn: u.subscription_renews_on },
  createdAt: u.created_at,
  updatedAt: u.updated_at,
});

export const getMe = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  const user = await findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json({ user: sanitize(user) });
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  const { name, avatarUrl } = req.body;
  const user = await updateUser(req.userId, { name, avatar_url: avatarUrl });
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json({ user: sanitize(user) });
};
