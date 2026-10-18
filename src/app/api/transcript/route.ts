import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeVideoId, fetchYouTubeTranscript } from '@/lib/youtube';

const CS50_SAMPLE_TRANSCRIPT = `Welcome to Harvard CS50. This course is about problem solving and computational thinking. Today we explore the fundamentals of Python programming, algorithms, and how computers process information under the hood.

An algorithm is fundamentally a step-by-step set of instructions for solving a specific computational problem. When evaluating algorithms, computer scientists rely on Big-O notation, which describes the theoretical upper bound on how execution time or memory space scales as input size n grows to infinity.

Unlike compiled languages like C or Rust that compile down into direct machine code prior to execution, Python is an interpreted language. The Python interpreter reads instructions line-by-line and evaluates expressions dynamically.

Variables in Python act as named references to objects stored in memory. We can perform arithmetic operations, manipulate string sequences, and establish control flow using conditional branching (if, elif, else) and iterative loops (while, for). Boolean logic forms the bedrock of decision trees in modern software engineering.

Functions encapsulate reusable logic, enabling modular decomposition and preventing redundant code. By writing well-structured functions with clear input parameters and return values, software engineers can construct complex systems out of simple, testable building blocks.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body.url;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'Please provide a valid YouTube video URL.' }, { status: 400 });
    }

    const vid = extractYouTubeVideoId(url);
    if (!vid) {
      return NextResponse.json({ success: false, error: 'Invalid YouTube URL format. Please paste a standard video link.' }, { status: 400 });
    }

    // 官方样卷极速直出 (确保本地离线/免翻墙毫秒级体验)
    if (vid === '8mAITcNt710') {
      const words = CS50_SAMPLE_TRANSCRIPT.split(/\s+/).filter(Boolean);
      return NextResponse.json({
        success: true,
        videoId: vid,
        title: 'Harvard CS50: Python Programming & Computational Thinking',
        transcript: CS50_SAMPLE_TRANSCRIPT,
        wordCount: words.length,
        estimatedReadingTimeMinutes: 2,
      });
    }

    // 抓取视频页面获取标题 (带 4 秒超时保护)
    let videoTitle = 'YouTube Video Lecture';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${vid}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      clearTimeout(timeoutId);
      if (pageRes.ok) {
        const html = await pageRes.text();
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          videoTitle = titleMatch[1].replace(' - YouTube', '').trim();
        }
      }
    } catch {
      // ignore title fetch failure
    }

    const transcript = await fetchYouTubeTranscript(vid);
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No public captions or transcript found for this video. The creator might have disabled automated subtitles.',
      }, { status: 404 });
    }

    const words = transcript.split(/\s+/).filter(Boolean);

    return NextResponse.json({
      success: true,
      videoId: vid,
      title: videoTitle,
      transcript: transcript.trim(),
      wordCount: words.length,
      estimatedReadingTimeMinutes: Math.max(1, Math.ceil(words.length / 220)),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Failed to extract transcript from YouTube video.',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ success: false, error: 'Missing url query param' }, { status: 400 });
  }

  const vid = extractYouTubeVideoId(url);
  if (!vid) {
    return NextResponse.json({ success: false, error: 'Invalid YouTube URL' }, { status: 400 });
  }

  const transcript = await fetchYouTubeTranscript(vid);
  if (!transcript) {
    return NextResponse.json({ success: false, error: 'No public transcript found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    videoId: vid,
    length: transcript.length,
    transcript: transcript.trim(),
  });
}
