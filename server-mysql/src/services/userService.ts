import bcrypt from 'bcryptjs';
import { DBUser, getPool } from './db';

export const findByEmail = async (email: string): Promise<DBUser | null> => {
  const [rows] = await getPool().query('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as DBUser[];
  return users[0] || null;
};

export const findByUsername = async (username: string): Promise<DBUser | null> => {
  const [rows] = await getPool().query('SELECT * FROM users WHERE username = ?', [username]);
  const users = rows as DBUser[];
  return users[0] || null;
};

export const findByIdentifier = async (identifier: string): Promise<DBUser | null> => {
  if (identifier.includes('@')) return findByEmail(identifier);
  return findByUsername(identifier);
};

export const findById = async (id: number): Promise<DBUser | null> => {
  const [rows] = await getPool().query('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as DBUser[];
  return users[0] || null;
};

export const createUser = async (name: string, email: string, password: string, avatarUrl?: string, username?: string): Promise<DBUser> => {
  const hash = await bcrypt.hash(password, 10);
  const base = (username || email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9_\-]/g, '');
  const unique = await ensureUniqueUsername(base || 'user');
  await getPool().query(
    'INSERT INTO users (name,username,email,password,avatar_url,subscription_tier,subscription_renews_on) VALUES (?,?,?,?,?,?,?)',
    [name, unique, email, hash, avatarUrl || null, 'Free', null]
  );
  const user = await findByEmail(email);
  if (!user) throw new Error('Failed to create user');
  return user;
};

const ensureUniqueUsername = async (base: string): Promise<string> => {
  let candidate = base;
  let suffix = 0;
  // Try up to a reasonable number of attempts
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // check existence
    const existing = await findByUsername(candidate);
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
};

export const updateUser = async (id: number, data: { name?: string; avatar_url?: string; username?: string }): Promise<DBUser | null> => {
  const sets: string[] = [];
  const values: any[] = [];
  if (data.name !== undefined) { sets.push('name = ?'); values.push(data.name); }
  if (data.username !== undefined) { sets.push('username = ?'); values.push(data.username); }
  if (data.avatar_url !== undefined) { sets.push('avatar_url = ?'); values.push(data.avatar_url); }
  if (!sets.length) return findById(id);
  values.push(id);
  await getPool().query(`UPDATE users SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
  return findById(id);
};
