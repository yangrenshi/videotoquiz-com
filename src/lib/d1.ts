/**
 * Cloudflare D1 REST API Client for VideoToQuiz AI
 * 运行在 Vercel Serverless / Node.js 服务端，通过 Cloudflare 官方 REST 接口秒级读写 D1 数据库
 */

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_D1_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || '';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

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

// 通用的 D1 统一客户端接口
export interface UnifiedDatabase {
  getUser(id: string): Promise<DbUser | null>;
  getUserByEmail(email: string): Promise<DbUser | null>;
  createUser(user: { id: string; email: string; name: string; avatar: string; initialCredits?: number }): Promise<DbUser>;
  deductCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>): Promise<{ success: boolean; newBalance: number; error?: string }>;
  addCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>): Promise<{ success: boolean; newBalance: number }>;
  getTransactions(userId: string, limit?: number): Promise<DbTransaction[]>;
}

export interface D1QueryResult<T = unknown> {
  success: boolean;
  results: T[];
  meta?: any;
  error?: string;
}

/**
 * 执行 Cloudflare D1 SQL 查询
 */
export async function executeD1<T = unknown>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<D1QueryResult<T>> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_D1_DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
    return {
      success: false,
      results: [],
      error: 'Cloudflare D1 credentials missing.'
    };
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
      },
      body: JSON.stringify({
        sql,
        params
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        results: [],
        error: `Cloudflare D1 API HTTP ${response.status}: ${errText}`
      };
    }

    const json = await response.json();
    if (!json.success || !json.result || json.result.length === 0) {
      return {
        success: false,
        results: [],
        error: json.errors?.[0]?.message || 'Query failed'
      };
    }

    const firstResult = json.result[0];
    return {
      success: firstResult.success ?? true,
      results: (firstResult.results as T[]) || [],
      meta: firstResult.meta
    };
  } catch (err: unknown) {
    return {
      success: false,
      results: [],
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Cloudflare D1 驱动的数据库实例
 */
class CloudflareD1Database implements UnifiedDatabase {
  async getUser(id: string): Promise<DbUser | null> {
    const res = await executeD1<DbUser>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (res.success && res.results.length > 0) {
      return res.results[0];
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<DbUser | null> {
    const res = await executeD1<DbUser>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (res.success && res.results.length > 0) {
      return res.results[0];
    }
    return null;
  }

  async createUser({
    id,
    email,
    name,
    avatar,
    initialCredits = 20,
  }: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    initialCredits?: number;
  }): Promise<DbUser> {
    const existing = await this.getUserByEmail(email);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const insertRes = await executeD1(
      'INSERT INTO users (id, email, name, avatar, credits, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, name || 'Learner', avatar || '', initialCredits, now]
    );

    if (!insertRes.success) {
      console.error('[D1] Failed to create user:', insertRes.error);
    }

    if (initialCredits > 0) {
      await executeD1(
        'INSERT INTO credit_transactions (id, user_id, amount, balance_after, reason, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          'tx_' + Math.random().toString(36).substring(2, 10),
          id,
          initialCredits,
          initialCredits,
          'WELCOME_BONUS',
          JSON.stringify({ note: 'Initial 20 Free Credits' }),
          now
        ]
      );
    }

    return {
      id,
      email,
      name: name || 'Learner',
      avatar: avatar || '',
      credits: initialCredits,
      created_at: now
    };
  }

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

    await executeD1('UPDATE users SET credits = ? WHERE id = ?', [newBalance, userId]);

    await executeD1(
      'INSERT INTO credit_transactions (id, user_id, amount, balance_after, reason, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        'tx_' + Math.random().toString(36).substring(2, 10),
        userId,
        -count,
        newBalance,
        reason,
        metadata ? JSON.stringify(metadata) : '',
        now
      ]
    );

    return { success: true, newBalance };
  }

  async addCredits(userId: string, count: number, reason: string, metadata?: Record<string, any>) {
    const user = await this.getUser(userId);
    if (!user) return { success: false, newBalance: 0 };

    const newBalance = user.credits + count;
    const now = new Date().toISOString();

    await executeD1('UPDATE users SET credits = ? WHERE id = ?', [newBalance, userId]);

    await executeD1(
      'INSERT INTO credit_transactions (id, user_id, amount, balance_after, reason, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        'tx_' + Math.random().toString(36).substring(2, 10),
        userId,
        count,
        newBalance,
        reason,
        metadata ? JSON.stringify(metadata) : '',
        now
      ]
    );

    return { success: true, newBalance };
  }

  async getTransactions(userId: string, limit = 20): Promise<DbTransaction[]> {
    const res = await executeD1<DbTransaction>(
      'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    return res.results || [];
  }
}

const d1Instance = new CloudflareD1Database();

export function getDb(): UnifiedDatabase {
  return d1Instance;
}
