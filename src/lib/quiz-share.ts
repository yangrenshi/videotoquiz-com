import { QuizResultData } from './types';

export interface MinifiedQuizPayload {
  t: string;       // videoTitle
  y?: string;      // videoId
  s?: string;      // summary
  k?: string[];    // takeaways
  q: Array<{
    i: number;     // question id
    t: string;     // question text
    o: string[];   // options
    a: number;     // answerIndex
    e: string;     // explanation
  }>;
}

/**
 * 将测验数据转换为紧凑安全的 Base64URL 字符串
 */
export function compressQuizData(quiz: QuizResultData): string {
  try {
    const minified: MinifiedQuizPayload = {
      t: quiz.videoTitle || 'Educational Video Quiz',
      y: quiz.videoId,
      s: quiz.summary?.slice(0, 300),
      k: quiz.takeaways?.slice(0, 5),
      q: quiz.questions.map((q) => ({
        i: q.id,
        t: q.question,
        o: q.options,
        a: q.answerIndex,
        e: q.explanation || '',
      })),
    };

    const jsonStr = JSON.stringify(minified);
    if (typeof window !== 'undefined') {
      return btoa(unescape(encodeURIComponent(jsonStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } else {
      return Buffer.from(jsonStr, 'utf-8').toString('base64url');
    }
  } catch (err) {
    console.error('Failed to compress quiz data:', err);
    return '';
  }
}

/**
 * 从 Base64URL 还原测验数据
 */
export function decompressQuizData(compressed: string): QuizResultData | null {
  try {
    let jsonStr = '';
    if (typeof window !== 'undefined') {
      let b64 = compressed.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      jsonStr = decodeURIComponent(escape(atob(b64)));
    } else {
      jsonStr = Buffer.from(compressed, 'base64url').toString('utf-8');
    }

    const min: MinifiedQuizPayload = JSON.parse(jsonStr);
    return {
      videoId: min.y || '',
      videoTitle: min.t,
      summary: min.s || '',
      takeaways: min.k || [],
      questions: min.q.map((q) => ({
        id: q.i,
        question: q.t,
        options: q.o,
        answerIndex: q.a,
        explanation: q.e,
      })),
      totalQuestions: min.q.length,
    };
  } catch (err) {
    console.error('Failed to decompress quiz data:', err);
    return null;
  }
}

/**
 * 生成全站统一的测验分享链接
 */
export async function createShareableLink(quiz: QuizResultData): Promise<{
  shareId: string;
  shareUrl: string;
}> {
  const isBrowser = typeof window !== 'undefined';
  const origin = isBrowser 
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? window.location.origin 
        : 'https://www.videotoquiz.com')
    : 'https://www.videotoquiz.com';
    
  // 生成短哈希 ID
  const hash = Math.random().toString(36).substring(2, 9);
  const shareId = quiz.videoId ? `v_${quiz.videoId.slice(0, 8)}_${hash}` : `q_${hash}`;

  try {
    if (isBrowser) {
      // 异步向服务端注册持久短链缓存
      await fetch('/api/quiz/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId,
          quiz,
        }),
      });
    }
  } catch (e) {
    console.warn('Background share register skipped:', e);
  }

  // 规范链接格式：https://www.videotoquiz.com/quiz/${shareId}
  const shareUrl = `${origin}/quiz/${shareId}`;
  return {
    shareId,
    shareUrl,
  };
}
