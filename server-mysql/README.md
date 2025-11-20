# Accounts Server (MySQL Edition)

## SQL Schema
Run these in MySQL before starting:
```sql
CREATE DATABASE IF NOT EXISTS accounts_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE accounts_app;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  subscription_tier ENUM('Free','Premium') NOT NULL DEFAULT 'Free',
  subscription_renews_on DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```
(Optional) Seed a test user:
```sql
INSERT INTO users (name,email,password,subscription_tier) VALUES ('Test User','test@example.com','$2a$10$VYbYwFJQWRp4tuhFYwXUYOtAix7HwUQLzGdXFkTZmQ1Bjz3s9vSrC','Premium');
-- password hash above is for: password
```

## Install & Run
```powershell
cd server-mysql
npm install
cp .env.example .env
# edit .env with your credentials
npm run dev
```

## Endpoints
- POST /api/auth/register { name,email,password,avatarUrl? }
- POST /api/auth/login { email,password }
- GET /api/account/me (Bearer token)
- PATCH /api/account/profile { name?, avatarUrl? } (Bearer token)
