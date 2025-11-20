import bcrypt from 'bcryptjs';
import { DBUser, getPool } from './db';

export const findByEmail = async (email: string): Promise<DBUser | null> => {
  const [rows] = await getPool().query('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as DBUser[];
  return users[0] || null;
};

export const findById = async (id: number): Promise<DBUser | null> => {
  const [rows] = await getPool().query('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as DBUser[];
  return users[0] || null;
};

export const createUser = async (name: string, email: string, password: string, avatarUrl?: string): Promise<DBUser> => {
  const hash = await bcrypt.hash(password, 10);
  const renews = new Date();
  renews.setMonth(renews.getMonth() + 1);
  await getPool().query(
    'INSERT INTO users (name,email,password,avatar_url,subscription_tier,subscription_renews_on) VALUES (?,?,?,?,?,?)',
    [name, email, hash, avatarUrl || null, 'Premium', renews]
  );
  const user = await findByEmail(email);
  if (!user) throw new Error('Failed to create user');
  return user;
};

export const updateUser = async (id: number, data: { name?: string; avatar_url?: string }): Promise<DBUser | null> => {
  const sets: string[] = [];
  const values: any[] = [];
  if (data.name !== undefined) { sets.push('name = ?'); values.push(data.name); }
  if (data.avatar_url !== undefined) { sets.push('avatar_url = ?'); values.push(data.avatar_url); }
  if (!sets.length) return findById(id);
  values.push(id);
  await getPool().query(`UPDATE users SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
  return findById(id);
};
