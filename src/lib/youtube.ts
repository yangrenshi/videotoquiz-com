/**
 * 高可用 YouTube 字幕提取与视频信息解析引擎
 * 采用 3 重多模态策略：Innertube Player API (移动协议防拦截) + HTML 轨道嗅探 + TimedText 直连
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
 * 解析并清洗字幕数据 (支持 json3 与 xml)
 */
async function downloadAndParseSubtitles(baseUrl: string): Promise<string | null> {
  try {
    // 优先使用 json3 格式 (体积更轻、解析更准确)
    const jsonUrl = baseUrl.includes('fmt=') ? baseUrl : `${baseUrl}&fmt=json3`;
    const res = await fetch(jsonUrl, { cache: 'no-store' });
    if (res.ok) {
      try {
        const json = await res.json();
        if (Array.isArray(json.events)) {
          const lines: string[] = [];
          for (const ev of json.events) {
            if (Array.isArray(ev.segs)) {
              const segText = ev.segs.map((s: any) => s.utf8 || '').join('').trim();
              if (segText) lines.push(segText);
            }
          }
          if (lines.length > 5) {
            return lines.join(' ').slice(0, 35000);
          }
        }
      } catch {
        // 回退到原始 xml
      }
    }

    // 回退到标准 XML 解析
    const xmlRes = await fetch(baseUrl, { cache: 'no-store' });
    if (xmlRes.ok) {
      const xml = await xmlRes.text();
      const lines: string[] = [];
      const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
      let m;
      while ((m = textRegex.exec(xml)) !== null) {
        const clean = m[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/<[^>]+>/g, '')
          .trim();
        if (clean) lines.push(clean);
      }
      if (lines.length > 5) {
        return lines.join(' ').slice(0, 35000);
      }
    }
  } catch (err) {
    console.warn('[YouTube] Subtitle download error:', err);
  }
  return null;
}

/**
 * 策略 1: YouTube Innertube API (伪装移动端协议，极高成功率，规避数据中心机房 IP 拦截)
 */
async function getCaptionsViaInnertube(videoId: string): Promise<string | null> {
  const clients = [
    { clientName: 'ANDROID', clientVersion: '19.09.37' },
    { clientName: 'WEB', clientVersion: '2.20240101.00.00' },
    { clientName: 'MWEB', clientVersion: '2.20240101.00.00' },
  ];

  for (const client of clients) {
    try {
      const res = await fetch('https://www.youtube.com/youtubei/v1/player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            client.clientName === 'ANDROID'
              ? 'com.google.android.youtube/19.09.37 (Linux; U; Android 14)'
              : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              ...client,
              hl: 'en',
              gl: 'US',
            },
          },
          videoId,
        }),
        cache: 'no-store',
      });

      if (!res.ok) continue;
      const data = await res.json();
      const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (Array.isArray(tracks) && tracks.length > 0) {
        // 优先匹配英文字幕 (en, en-US 等)，其次第一条字幕
        const track =
          tracks.find((t: any) => t.languageCode?.startsWith('en')) ||
          tracks.find((t: any) => t.vssId?.includes('.en')) ||
          tracks[0];

        if (track?.baseUrl) {
          const subText = await downloadAndParseSubtitles(track.baseUrl);
          if (subText && subText.length > 100) return subText;
        }
      }
    } catch {
      // 尝试下一个 client
    }
  }
  return null;
}

/**
 * 策略 2: 网页 HTML 正则嗅探
 */
async function getCaptionsViaHtml(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const html = await res.text();

    let tracks: any[] | null = null;
    const m1 = html.match(/"captionTracks":\s*(\[[^\]]+\])/);
    if (m1) {
      try {
        tracks = JSON.parse(m1[1]);
      } catch {}
    }

    if (!tracks) {
      const m2 = html.match(/"playerCaptionsTracklistRenderer":\s*\{"captionTracks":\s*(\[[^\]]+\])/);
      if (m2) {
        try {
          tracks = JSON.parse(m2[1]);
        } catch {}
      }
    }

    if (Array.isArray(tracks) && tracks.length > 0) {
      const track =
        tracks.find((t: any) => t.languageCode?.startsWith('en')) ||
        tracks.find((t: any) => t.vssId?.includes('.en')) ||
        tracks[0];

      if (track?.baseUrl) {
        const subText = await downloadAndParseSubtitles(track.baseUrl);
        if (subText && subText.length > 100) return subText;
      }
    }
  } catch (err) {
    console.warn('[YouTube] HTML scrape notice:', err);
  }
  return null;
}

/**
 * 策略 3: TimedText 直连 API
 */
async function getCaptionsViaTimedText(videoId: string): Promise<string | null> {
  const candidates = ['en', 'en-US', 'en-GB', 'a.en'];
  for (const lang of candidates) {
    try {
      const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3`;
      const res = await fetch(url, { cache: 'no-store' });
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
    } catch {}
  }
  return null;
}

/**
 * 统一获取视频字幕 (多级自动回退)
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  // 1. 优先尝试 Innertube API (移动端端点，最稳定)
  const innertubeText = await getCaptionsViaInnertube(videoId);
  if (innertubeText && innertubeText.length > 100) {
    return innertubeText;
  }

  // 2. 尝试 HTML 页面分析
  const htmlText = await getCaptionsViaHtml(videoId);
  if (htmlText && htmlText.length > 100) {
    return htmlText;
  }

  // 3. 尝试 TimedText 直连
  const timedText = await getCaptionsViaTimedText(videoId);
  if (timedText && timedText.length > 100) {
    return timedText;
  }

  return null;
}
