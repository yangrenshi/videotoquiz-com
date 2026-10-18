import { NextRequest, NextResponse } from 'next/server';
import { QuizResultData } from '@/lib/types';
import { saveSharedQuiz, getSharedQuiz } from '@/lib/quiz-share-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shareId, quiz } = body;

    if (!shareId || !quiz) {
      return NextResponse.json({ success: false, error: 'Missing shareId or quiz data' }, { status: 400 });
    }

    // 写入服务端持久缓存
    saveSharedQuiz(shareId, quiz);

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

  const foundQuiz = getSharedQuiz(id);
  if (foundQuiz) {
    return NextResponse.json({
      success: true,
      quiz: foundQuiz,
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Quiz not found in server cache, fallback to URL state',
  }, { status: 404 });
}
