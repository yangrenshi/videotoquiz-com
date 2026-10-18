import { YoutubeTranscript } from 'youtube-transcript';

/**
 * 提取 YouTube 视频 11 位唯一 ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();

  // 1. 标准参数匹配 watch?v=ID
  const vMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];

  // 2. 短链接匹配 youtu.be/ID
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // 3. Shorts 匹配 youtube.com/shorts/ID
  const shortsMatch = clean.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // 4. /embed/ID 或 /v/ID
  const embedMatch = clean.match(/\/(embed|v)\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[2];

  // 5. 11位直连 ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

  return null;
}

/**
 * 高可用多策略抓取视频公开字幕 (Transcript)
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  // 策略 1: 使用 youtube-transcript 官方协议 (优先尝试 Android Innertube 客户端通道)
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    if (Array.isArray(items) && items.length > 0) {
      const text = items.map((i) => i.text).join(' ').trim();
      if (text.length > 100) {
        return text.slice(0, 35000);
      }
    }
  } catch (err: any) {
    console.warn('[YouTubeTranscript] InnerTube failed, trying fallback:', err?.message || err);
  }

  // 策略 2: 尝试直接请求 TimedText (针对常见英文/自动字幕)
  const candidateLangs = ['en', 'en-US', 'a.en'];
  for (const lang of candidateLangs) {
    try {
      const timedUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3`;
      const res = await fetch(timedUrl, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.events)) {
          const lines = json.events
            .flatMap((ev: any) => (ev.segs ? ev.segs.map((s: any) => s.utf8 || '') : []))
            .join(' ')
            .trim();
          if (lines.length > 100) return lines.slice(0, 35000);
        }
      }
    } catch {
      // ignore
    }
  }

  // 策略 3: 直接抓取页面 HTML 正则嗅探
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const m = html.match(/"captionTracks":\s*(\[[^\]]+\])/);
      if (m) {
        const tracks = JSON.parse(m[1]);
        if (Array.isArray(tracks) && tracks.length > 0) {
          const track = tracks.find((t: any) => t.languageCode?.startsWith('en')) || tracks[0];
          if (track?.baseUrl) {
            const subRes = await fetch(track.baseUrl);
            if (subRes.ok) {
              const xml = await subRes.text();
              const lines: string[] = [];
              const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
              let match;
              while ((match = textRegex.exec(xml)) !== null) {
                const clean = match[1]
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/<[^>]+>/g, '')
                  .trim();
                if (clean) lines.push(clean);
              }
              if (lines.length > 10) {
                return lines.join(' ').slice(0, 35000);
              }
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
}
