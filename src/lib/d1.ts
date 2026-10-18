import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

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

// 全局内存兜底存储（防止 Serverless 环境中只读文件系统导致崩溃）
const globalStore = globalThis as unknown as {
  __v2q_users?: Map<string, DbUser>;
  __v2q_transactions?: DbTransaction[];
};

if (!globalStore.__v2q_users) {
  globalStore.__v2q_users = new Map<string, DbUser>();
}
if (!globalStore.__v2q_transactions) {
  globalStore.__v2q_transactions = [];
}

let localDbInstance: any = null;
let useMemoryFallback = false;

function initSqliteIfNeeded() {
  if (localDbInstance || useMemoryFallback) return;

  try {
    // 在生产环境或 Vercel Serverless 中使用系统的临时目录，避免根目录只读报错
    const isServerless = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
    const baseDir = isServerless ? os.tmpdir() : process.cwd();
    const dataDir = path.join(baseDir, '.videotoquiz_data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'd1_local.sqlite');

    // 动态载入 node:sqlite
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(dbPath);

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
    console.warn('[Database] SQLite failed, falling back to in-memory store:', err);
    useMemoryFallback = true;
  }
}

function getLocalDatabase(): UnifiedDatabase {
  initSqliteIfNeeded();

  return {
    async getUser(id: string): Promise<DbUser | null> {
      if (localDbInstance) {
        try {
          const stmt = localDbInstance.prepare('SELECT * FROM users WHERE id = ?');
          const row = stmt.get(id);
          if (row) return row as DbUser;
        } catch (e) {
          console.warn('[DB] SQLite read error, falling back to memory:', e);
        }
      }
      return globalStore.__v2q_users?.get(id) || null;
    },

    async getUserByEmail(email: string): Promise<DbUser | null> {
      if (localDbInstance) {
        try {
          const stmt = localDbInstance.prepare('SELECT * FROM users WHERE email = ?');
          const row = stmt.get(email);
          if (row) return row as DbUser;
        } catch (e) {
          console.warn('[DB] SQLite read by email error, falling back to memory:', e);
        }
      }
      for (const u of globalStore.__v2q_users!.values()) {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return u;
        }
      }
      return null;
    },

    async createUser({ id, email, name, avatar, initialCredits = 20 }): Promise<DbUser> {
      const now = new Date().toISOString();

      // 先查已有
      const existing = await this.getUserByEmail(email);
      if (existing) {
        return existing;
      }

      const newUser: DbUser = {
        id,
        email,
        name,
        avatar,
        credits: initialCredits,
        created_at: now,
      };

      if (localDbInstance) {
        try {
          const stmt = localDbInstance.prepare(`
            INSERT INTO users (id, email, name, avatar, credits, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `);
          stmt.run(id, email, name, avatar, initialCredits, now);

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
        } catch (e) {
          console.warn('[DB] SQLite insert error, saving to memory store:', e);
        }
      }

      // 同时写入内存副本
      globalStore.__v2q_users!.set(id, newUser);
      if (initialCredits > 0) {
        globalStore.__v2q_transactions!.unshift({
          id: 'tx_' + Math.random().toString(36).substring(2, 10),
          user_id: id,
          amount: initialCredits,
          balance_after: initialCredits,
          reason: 'WELCOME_BONUS',
          metadata: JSON.stringify({ note: 'Initial 20 Free Credits' }),
          created_at: now,
        });
      }

      return newUser;
    },

    async deductCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>) {
      const user = await this.getUser(userId);
      if (!user) {
        return { success: false, newBalance: 0, error: 'User not found' };
      }

      if (user.credits < count) {
        return { success: false, newBalance: user.credits, error: 'Insufficient credits' };
      }

      const newBalance = user.credits - count;
      const now = new Date().toISOString();

      if (localDbInstance) {
        try {
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
        } catch (e) {
          console.warn('[DB] SQLite deduct error, updating memory store:', e);
        }
      }

      // 更新内存状态
      user.credits = newBalance;
      globalStore.__v2q_users!.set(userId, user);
      globalStore.__v2q_transactions!.unshift({
        id: 'tx_' + Math.random().toString(36).substring(2, 10),
        user_id: userId,
        amount: -count,
        balance_after: newBalance,
        reason,
        metadata: metadata ? JSON.stringify(metadata) : '',
        created_at: now,
      });

      return { success: true, newBalance };
    },

    async addCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>) {
      const user = await this.getUser(userId);
      if (!user) return { success: false, newBalance: 0 };

      const newBalance = user.credits + count;
      const now = new Date().toISOString();

      if (localDbInstance) {
        try {
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
        } catch (e) {
          console.warn('[DB] SQLite add error, updating memory store:', e);
        }
      }

      user.credits = newBalance;
      globalStore.__v2q_users!.set(userId, user);
      globalStore.__v2q_transactions!.unshift({
        id: 'tx_' + Math.random().toString(36).substring(2, 10),
        user_id: userId,
        amount: count,
        balance_after: newBalance,
        reason,
        metadata: metadata ? JSON.stringify(metadata) : '',
        created_at: now,
      });

      return { success: true, newBalance };
    },

    async getTransactions(userId: string, limit = 20): Promise<DbTransaction[]> {
      if (localDbInstance) {
        try {
          const stmt = localDbInstance.prepare(
            'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
          );
          return stmt.all(userId, limit) as DbTransaction[];
        } catch (e) {
          console.warn('[DB] SQLite tx error, falling back to memory:', e);
        }
      }
      return (globalStore.__v2q_transactions || [])
        .filter((t) => t.user_id === userId)
        .slice(0, limit);
    },
  };
}

/**
 * 获取统一数据库实例
 */
export function getDb(): UnifiedDatabase {
  return getLocalDatabase();
}
