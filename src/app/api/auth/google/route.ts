import { NextRequest, NextResponse } from 'next/server';
import { parseGoogleJwt, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getDb } from '@/lib/d1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, demoUser } = body;

    let sub = '';
    let email = '';
    let name = '';
    let avatar = '';

    if (credential) {
      const parsed = parseGoogleJwt(credential);
      if (!parsed || !parsed.email) {
        return NextResponse.json({ error: 'Invalid Google credential token' }, { status: 400 });
      }
      sub = parsed.sub;
      email = parsed.email;
      name = parsed.name;
      avatar = parsed.picture;
    } else if (demoUser) {
      // 演示 / 快捷测试账号
      sub = 'google_demo_' + Math.random().toString(36).substring(2, 8);
      email = 'scholar.learner@gmail.com';
      name = 'Scholar Learner (Google)';
      avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
    } else {
      return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
    }

    const db = getDb();
    let user = await db.getUserByEmail(email);

    if (!user) {
      // 新用户注册，赠送 20 初始试用积分
      user = await db.createUser({
        id: sub || 'user_' + Math.random().toString(36).substring(2, 10),
        email,
        name,
        avatar,
        initialCredits: 20,
      });
    }

    // 设置会话 Cookie (30 天有效)
    const response = NextResponse.json({
      success: true,
      user,
      isNewUser: user.credits === 20,
    });

    response.cookies.set(SESSION_COOKIE_NAME, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
