import { Request, Response } from 'express';
import { findById, updateUser } from '../services/userService';

const sanitize = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatarUrl: u.avatar_url,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
});

const toAbsolute = (req: Request, url: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}${url}`;
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  const user = await findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const payload = sanitize(user);
  payload.avatarUrl = toAbsolute(req, payload.avatarUrl);
  return res.json({ user: payload });
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  const { name, avatarUrl } = req.body;
  const user = await updateUser(req.userId, { name, avatar_url: avatarUrl });
  if (!user) return res.status(404).json({ message: 'Not found' });
  const payload = sanitize(user);
  payload.avatarUrl = toAbsolute(req, payload.avatarUrl);
  return res.json({ user: payload });
};

export const updateAvatar = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  // multer places file metadata on req.file
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // store relative path for serving
  const relativePath = `/uploads/${req.file.filename}`;
  const user = await updateUser(req.userId, { avatar_url: relativePath });
  if (!user) return res.status(404).json({ message: 'Not found' });
  const payload = sanitize(user);
  payload.avatarUrl = toAbsolute(req, payload.avatarUrl);
  return res.json({ user: payload });
};
