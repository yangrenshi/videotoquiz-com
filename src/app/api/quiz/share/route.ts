import { NextRequest, NextResponse } from 'next/server';
import { QuizResultData } from '@/lib/types';

// 服务端轻量内存缓存 (LRU 简易版，保留最近 500 个测验)
const shareCache = new Map<string, { quiz: QuizResultData; createdAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shareId, quiz } = body;

    if (!shareId || !quiz) {
      return NextResponse.json({ success: false, error: 'Missing shareId or quiz data' }, { status: 400 });
    }

    // 写入内存缓存
    shareCache.set(shareId, {
      quiz,
      createdAt: Date.now(),
    });

    // 控制内存容量
    if (shareCache.size > 500) {
      const oldestKey = shareCache.keys().next().value;
      if (oldestKey) shareCache.delete(oldestKey);
    }

    return NextResponse.json({
      success: true,
      shareId,
      message: 'Quiz registered for sharing successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing quiz id' }, { status: 400 });
  }

  const found = shareCache.get(id);
  if (found) {
    return NextResponse.json({
      success: true,
      quiz: found.quiz,
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Quiz not found in server cache, fallback to URL state',
  }, { status: 404 });
}
