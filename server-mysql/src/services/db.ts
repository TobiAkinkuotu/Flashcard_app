import mysql from 'mysql2/promise';

export interface DBUser {
  id: number;
  name: string;
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
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'accounts_app',
    connectionLimit: 10,
  });

  // Auto-migrate basic tables
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    subscription_tier ENUM('Free','Premium') NOT NULL DEFAULT 'Free',
    subscription_renews_on DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
};

export const getPool = () => {
  if (!pool) throw new Error('DB not initialized');
  return pool;
};
