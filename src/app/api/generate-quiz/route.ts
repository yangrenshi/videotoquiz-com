import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeVideoId, fetchYouTubeTranscript } from '@/lib/youtube';
import { generateQuizWithDeepSeek } from '@/lib/deepseek';
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/d1';

// 简易内存频次限制 (单进程防恶意刷接口，10分钟最多3次免费试玩)
const ipUsageMap = new Map<string, { count: number; resetAt: number }>();

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipUsageMap.get(ip);
  if (!record || now > record.resetAt) {
    ipUsageMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (record.count >= 3) {
    return false;
  }
  record.count += 1;
  return true;
}

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

    let actualCount = Math.min(Math.max(Number(questionCount) || 5, 1), 30);
    let isPreview = false;

    // 2. 检查用户登录状态；未登录者开启 Free Study Preview (前 2 题免登录试用)
    const user = await getCurrentUser();
    if (!user) {
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'anonymous_user';
      if (!checkIpRateLimit(clientIp)) {
        return NextResponse.json(
          {
            success: false,
            requiresLogin: true,
            error: 'You have reached the free preview limit for this session. Please sign in with Google to get 20 FREE credits!',
          },
          { status: 429 }
        );
      }
      isPreview = true;
      actualCount = 2; // 免登录试玩固定出 2 道核心题
    } else {
      if (user.credits < actualCount) {
        return NextResponse.json(
          {
            success: false,
            insufficientCredits: true,
            currentCredits: user.credits,
            requiredCredits: actualCount,
            error: `Insufficient credits. You have ${user.credits} credits, but this quiz requires ${actualCount} credits.`,
          },
          { status: 403 }
        );
      }
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

    // 5. 若已登录且非预览，扣除积分
    let creditsRemaining = user?.credits ?? 0;
    if (user && !isPreview) {
      const db = getDb();
      const deductRes = await db.deductCredits(
        user.id,
        actualCount,
        'GENERATE_QUIZ',
        { title: videoTitleHint, questionCount: actualCount }
      );

      if (!deductRes.success) {
        return NextResponse.json(
          { success: false, error: deductRes.error || 'Failed to deduct credits.' },
          { status: 400 }
        );
      }
      creditsRemaining = deductRes.newBalance;
    }

    // 6. 调用模型生成定制题目数量的高质量测验
    const quizData = await generateQuizWithDeepSeek(textToAnalyze, videoTitleHint, actualCount);
    if (extractedVideoId) {
      quizData.videoId = extractedVideoId;
    }

    return NextResponse.json({
      success: true,
      data: quizData,
      isPreview,
      creditsRemaining,
      deductedCredits: isPreview ? 0 : actualCount,
    });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal AI generation failure.' },
      { status: 500 }
    );
  }
}
