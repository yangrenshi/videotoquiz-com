import { cookies } from 'next/headers';
import { getDb, DbUser } from './d1';

const SESSION_COOKIE_NAME = 'vtq_session_id';

/**
 * 解析 Google ID Token (JWT) 的 Payload
 */
export function parseGoogleJwt(token: string): {
  sub: string;
  email: string;
  name: string;
  picture: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf-8');
    const data = JSON.parse(payloadStr);
    return {
      sub: data.sub || '',
      email: data.email || '',
      name: data.name || data.given_name || 'Scholar Learner',
      picture: data.picture || '',
    };
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

/**
 * 获取当前登录用户
 */
export async function getCurrentUser(): Promise<DbUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!userId) return null;

  const db = getDb();
  return await db.getUser(userId);
}

export { SESSION_COOKIE_NAME };
