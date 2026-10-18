/**
 * YouTube URL 提取与字幕轻量提取工具类
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

  // 4. 直连 ID (11位字符)
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

  return null;
}

/**
 * 抓取视频公开字幕 (Transcript)
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // 抓取视频详情页获取 caption 轨道
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageRes = await fetch(watchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 }
    });

    if (!pageRes.ok) return null;
    const html = await pageRes.text();

    // 从 ytInitialPlayerResponse 提取 captionTracks
    const match = html.match(/"captionTracks":\s*(\[[^\]]+\])/);
    if (!match) return null;

    const tracks = JSON.parse(match[1]);
    if (!tracks || !tracks.length) return null;

    // 优先选英文字幕，其次第一条字幕
    const enTrack = tracks.find((t: any) => t.languageCode === 'en') || tracks[0];
    if (!enTrack || !enTrack.baseUrl) return null;

    const subRes = await fetch(enTrack.baseUrl);
    if (!subRes.ok) return null;
    const subXml = await subRes.text();

    // 提取 XML 中的文本并清洗
    const lines: string[] = [];
    const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
    let m;
    while ((m = textRegex.exec(subXml)) !== null) {
      const cleanLine = m[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]+>/g, '')
        .trim();
      if (cleanLine) lines.push(cleanLine);
    }

    return lines.join(' ').slice(0, 30000); // 截取前 30,000 字符 (完全覆盖大部分 30 分钟演讲)
  } catch (err) {
    console.warn('Transcript extraction fallback notice:', err);
    return null;
  }
}
