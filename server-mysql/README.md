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
- POST /api/auth/logout (client should just delete stored token)
- GET /api/account/me (Bearer token)
- PATCH /api/account/profile { name?, avatarUrl? } (Bearer token)
- POST /api/account/avatar (multipart/form-data field `avatar`, Bearer token)

## Avatar Upload
You can set an avatar two ways:
1. Provide an `avatarUrl` (remote image URL) when registering or updating profile.
2. Upload a local image file via `POST /api/account/avatar` with a form field named `avatar`.

Uploaded files are saved to `uploads/` and served at `/uploads/<filename>`. The API returns a relative path like `/uploads/example_1732212345678.jpg`. Prepend your API base (e.g. `http://localhost:4000`) for an absolute URL.

Limits: max file size 2MB. Demo only (no cleaning, no malware scan, no image resizing).

Sample upload (PowerShell / cmd may need escaped quotes):
```bash
curl -X POST http://localhost:4000/api/account/avatar \
  -H "Authorization: Bearer <TOKEN>" \
  -F avatar=@/path/to/local/avatar.jpg
```
