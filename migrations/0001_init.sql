-- Cloudflare D1 Migration: 0001_init.sql
-- Users table with default 20 welcome credits
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  credits INTEGER NOT NULL DEFAULT 20,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Credit transactions log table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tx_user_id ON credit_transactions(user_id);
