import mysql from 'mysql2/promise';

export interface DBUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar_url: string | null;
  subscription_tier: 'Free' | 'Premium';
  subscription_renews_on: Date | null;
  created_at: Date;
  updated_at: Date;
}

let pool: mysql.Pool;

export const initDB = async () => {
  const cfg = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: +(process.env.DB_PORT || 3300),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'av_mysql@123',
    database: process.env.DB_NAME || 'accounts_app',
    connectionLimit: 10,
  };
  try {
    pool = mysql.createPool(cfg);
    await pool.query('SELECT 1');
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(500) NULL,
      subscription_tier ENUM('Free','Premium') NOT NULL DEFAULT 'Free',
      subscription_renews_on DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    // Ensure username column exists for older MySQL versions without IF NOT EXISTS support
    const [cols] = await pool.query("SHOW COLUMNS FROM users LIKE 'username'");
    const hasUsername = Array.isArray(cols) && (cols as any[]).length > 0;
    if (!hasUsername) {
      try {
        // 1) Add as nullable to avoid failure with existing rows
        await pool.query("ALTER TABLE users ADD COLUMN username VARCHAR(50) NULL AFTER name");
        // 2) Backfill from email prefix
        await pool.query("UPDATE users SET username = SUBSTRING_INDEX(email, '@', 1) WHERE username IS NULL OR username = ''");
        // 3) Make NOT NULL
        await pool.query("ALTER TABLE users MODIFY username VARCHAR(50) NOT NULL");
        // 4) Add unique index (ignore error if duplicates exist)
        try { await pool.query("ALTER TABLE users ADD UNIQUE KEY username_unique (username)"); } catch {}
      } catch (e) {
        console.error('Username column migration failed', (e as any)?.message || e);
        throw e;
      }
    }
  } catch (err: any) {
    console.error('Failed to connect to MySQL', {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      database: cfg.database,
      code: err.code,
      message: err.message,
    });
    throw err;
  }
};

export const getPool = () => {
  if (!pool) throw new Error('DB not initialized');
  return pool;
};
