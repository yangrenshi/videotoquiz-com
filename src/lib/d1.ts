import fs from 'node:fs';
import path from 'node:path';

// 统一的 User 结构
export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
  created_at: string;
}

// 统一的 Transaction 结构
export interface DbTransaction {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  reason: string;
  metadata?: string;
  created_at: string;
}

// 通用的 D1 / SQLite 统一客户端接口
export interface UnifiedDatabase {
  getUser(id: string): Promise<DbUser | null>;
  getUserByEmail(email: string): Promise<DbUser | null>;
  createUser(user: { id: string; email: string; name: string; avatar: string; initialCredits?: number }): Promise<DbUser>;
  deductCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>): Promise<{ success: boolean; newBalance: number; error?: string }>;
  addCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>): Promise<{ success: boolean; newBalance: number }>;
  getTransactions(userId: string, limit?: number): Promise<DbTransaction[]>;
}

// 本地基于 node:sqlite 或文件存储的实现
let localDbInstance: any = null;

function getLocalDatabase(): UnifiedDatabase {
  // 确保数据目录存在
  const dataDir = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'd1_local.sqlite');

  if (!localDbInstance) {
    try {
      // 动态载入 node:sqlite
      const { DatabaseSync } = require('node:sqlite');
      const db = new DatabaseSync(dbPath);

      // 初始化表结构
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          avatar TEXT,
          credits INTEGER NOT NULL DEFAULT 20,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS credit_transactions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount INTEGER NOT NULL,
          balance_after INTEGER NOT NULL,
          reason TEXT NOT NULL,
          metadata TEXT,
          created_at TEXT NOT NULL
        );
      `);

      localDbInstance = db;
    } catch (err) {
      console.warn('[D1] node:sqlite initialization fallback:', err);
    }
  }

  // 返回统一包装方法
  return {
    async getUser(id: string): Promise<DbUser | null> {
      if (!localDbInstance) return null;
      const stmt = localDbInstance.prepare('SELECT * FROM users WHERE id = ?');
      const row = stmt.get(id);
      return row ? (row as DbUser) : null;
    },

    async getUserByEmail(email: string): Promise<DbUser | null> {
      if (!localDbInstance) return null;
      const stmt = localDbInstance.prepare('SELECT * FROM users WHERE email = ?');
      const row = stmt.get(email);
      return row ? (row as DbUser) : null;
    },

    async createUser({ id, email, name, avatar, initialCredits = 20 }): Promise<DbUser> {
      if (!localDbInstance) throw new Error('Database not initialized');
      const now = new Date().toISOString();

      // 先查已有
      const existing = await this.getUserByEmail(email);
      if (existing) {
        return existing;
      }

      const stmt = localDbInstance.prepare(`
        INSERT INTO users (id, email, name, avatar, credits, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, email, name, avatar, initialCredits, now);

      // 记录初始注册赠送流水
      if (initialCredits > 0) {
        const txStmt = localDbInstance.prepare(`
          INSERT INTO credit_transactions (id, user_id, amount, balance_after, reason, metadata, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        txStmt.run(
          'tx_' + Math.random().toString(36).substring(2, 10),
          id,
          initialCredits,
          initialCredits,
          'WELCOME_BONUS',
          JSON.stringify({ note: 'Initial 20 Free Credits' }),
          now
        );
      }

      return {
        id,
        email,
        name,
        avatar,
        credits: initialCredits,
        created_at: now,
      };
    },

    async deductCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>) {
      if (!localDbInstance) return { success: false, newBalance: 0, error: 'Database unavailable' };
      const user = await this.getUser(userId);
      if (!user) {
        return { success: false, newBalance: 0, error: 'User not found' };
      }

      if (user.credits < count) {
        return { success: false, newBalance: user.credits, error: 'Insufficient credits' };
      }

      const newBalance = user.credits - count;
      const now = new Date().toISOString();

      const updateStmt = localDbInstance.prepare('UPDATE users SET credits = ? WHERE id = ?');
      updateStmt.run(newBalance, userId);

      const txStmt = localDbInstance.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, balance_after, reason, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      txStmt.run(
        'tx_' + Math.random().toString(36).substring(2, 10),
        userId,
        -count,
        newBalance,
        reason,
        metadata ? JSON.stringify(metadata) : '',
        now
      );

      return { success: true, newBalance };
    },

    async addCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>) {
      if (!localDbInstance) return { success: false, newBalance: 0 };
      const user = await this.getUser(userId);
      if (!user) return { success: false, newBalance: 0 };

      const newBalance = user.credits + count;
      const now = new Date().toISOString();

      const updateStmt = localDbInstance.prepare('UPDATE users SET credits = ? WHERE id = ?');
      updateStmt.run(newBalance, userId);

      const txStmt = localDbInstance.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, balance_after, reason, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      txStmt.run(
        'tx_' + Math.random().toString(36).substring(2, 10),
        userId,
        count,
        newBalance,
        reason,
        metadata ? JSON.stringify(metadata) : '',
        now
      );

      return { success: true, newBalance };
    },

    async getTransactions(userId: string, limit = 20): Promise<DbTransaction[]> {
      if (!localDbInstance) return [];
      const stmt = localDbInstance.prepare(
        'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
      );
      return stmt.all(userId, limit) as DbTransaction[];
    },
  };
}

/**
 * 获取统一数据库实例
 * 支持在 Cloudflare 环境与本地开发环境自动切换
 */
export function getDb(): UnifiedDatabase {
  return getLocalDatabase();
}
