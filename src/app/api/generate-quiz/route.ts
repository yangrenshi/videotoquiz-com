import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeVideoId, fetchYouTubeTranscript } from '@/lib/youtube';
import { generateQuizWithDeepSeek } from '@/lib/deepseek';
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/d1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, url, transcript, sampleKey, questionCount = 5 } = body;

    // 1. 若请求精选官方样卷，100% 免消耗免积分直接返回
    if (sampleKey && SAMPLE_QUIZZES[sampleKey]) {
      return NextResponse.json({
        success: true,
        data: SAMPLE_QUIZZES[sampleKey],
        isSample: true,
      });
    }

    const requestedCount = Math.min(Math.max(Number(questionCount) || 5, 1), 30);

    // 2. 检查用户登录状态与积分余额 (1 题 = 1 积分)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          requiresLogin: true,
          error: 'Please sign in with Google to use credits for generation. New users get 20 FREE credits!',
        },
        { status: 401 }
      );
    }

    if (user.credits < requestedCount) {
      return NextResponse.json(
        {
          success: false,
          insufficientCredits: true,
          currentCredits: user.credits,
          requiredCredits: requestedCount,
          error: `Insufficient credits. You have ${user.credits} credits, but this quiz requires ${requestedCount} credits.`,
        },
        { status: 403 }
      );
    }

    let textToAnalyze = '';
    let extractedVideoId = '';
    let videoTitleHint = 'Video Lecture Assessment';

    // 3. 模式 A: YouTube URL 解析
    if (mode === 'url' && url) {
      const vid = extractYouTubeVideoId(url);
      if (!vid) {
        return NextResponse.json(
          { success: false, error: 'Invalid YouTube URL. Please provide a valid video link or paste transcript directly.' },
          { status: 400 }
        );
      }
      extractedVideoId = vid;
      videoTitleHint = `YouTube Lecture (${vid})`;

      // 提取字幕
      const sub = await fetchYouTubeTranscript(vid);
      if (sub && sub.trim().length > 100) {
        textToAnalyze = sub;
      } else {
        return NextResponse.json({
          success: false,
          needsTranscriptFallback: true,
          error: 'No public English transcript found for this video. Please switch to "Paste Lecture Transcript" mode to generate quiz instantly.'
        }, { status: 422 });
      }
    } 
    // 4. 模式 B: 讲义文本直贴
    else if (mode === 'transcript' && transcript) {
      textToAnalyze = transcript.trim();
      videoTitleHint = body.title ? body.title.trim() : 'Lecture Notes & Transcript';
      if (textToAnalyze.length < 50) {
        return NextResponse.json(
          { success: false, error: 'Transcript text is too short. Please provide at least 50 characters.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (url or transcript).' },
        { status: 400 }
      );
    }

    // 5. 扣除积分
    const db = getDb();
    const deductRes = await db.deductCredits(
      user.id,
      requestedCount,
      'GENERATE_QUIZ',
      { title: videoTitleHint, questionCount: requestedCount }
    );

    if (!deductRes.success) {
      return NextResponse.json(
        { success: false, error: deductRes.error || 'Failed to deduct credits.' },
        { status: 400 }
      );
    }

    // 6. 调用模型生成定制题目数量的高质量测验
    const quizData = await generateQuizWithDeepSeek(textToAnalyze, videoTitleHint, requestedCount);
    if (extractedVideoId) {
      quizData.videoId = extractedVideoId;
    }

    return NextResponse.json({
      success: true,
      data: quizData,
      creditsRemaining: deductRes.newBalance,
      deductedCredits: requestedCount,
    });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal AI generation failure.' },
      { status: 500 }
    );
  }
}
