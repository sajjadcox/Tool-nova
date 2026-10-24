/**
 * Shared utility functions for YouTube tools
 */

export interface ParsedYouTubeUrl {
  videoId: string | null;
  channelId: string | null;
  handle: string | null;
  timestamp: number | null;
  isShort: boolean;
  isValid: boolean;
}

export function parseYouTubeUrl(url: string): ParsedYouTubeUrl {
  const result: ParsedYouTubeUrl = {
    videoId: null,
    channelId: null,
    handle: null,
    timestamp: null,
    isShort: false,
    isValid: false
  };

  const cleanUrl = (url || '').trim();
  if (!cleanUrl) return result;

  // Check if user just pasted an 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    result.videoId = cleanUrl;
    result.isValid = true;
    return result;
  }

  // Extract timestamp if present (t=1m30s, t=90, start=90)
  const timeMatch = cleanUrl.match(/[?&](?:t|start)=([0-9hms]+)/i);
  if (timeMatch) {
    const val = timeMatch[1];
    let totalSeconds = 0;
    const hMatch = val.match(/(\d+)h/i);
    const mMatch = val.match(/(\d+)m/i);
    const sMatch = val.match(/(\d+)s?/i);
    if (hMatch) totalSeconds += parseInt(hMatch[1], 10) * 3600;
    if (mMatch) totalSeconds += parseInt(mMatch[1], 10) * 60;
    if (sMatch && !hMatch && !mMatch) totalSeconds += parseInt(sMatch[1], 10);
    result.timestamp = totalSeconds > 0 ? totalSeconds : parseInt(val, 10) || null;
  }

  // Extract Shorts
  const shortsMatch = cleanUrl.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) {
    result.videoId = shortsMatch[1];
    result.isShort = true;
    result.isValid = true;
    return result;
  }

  // Extract standard video ID
  const videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const videoMatch = cleanUrl.match(videoRegex);
  if (videoMatch) {
    result.videoId = videoMatch[1];
    result.isValid = true;
  }

  // Extract Channel ID (UC...)
  const channelMatch = cleanUrl.match(/(?:youtube\.com\/(?:channel|c)\/)(UC[a-zA-Z0-9_-]{22})/i);
  if (channelMatch) {
    result.channelId = channelMatch[1];
    result.isValid = true;
  }

  // Extract Handle (@...)
  const handleMatch = cleanUrl.match(/(?:youtube\.com\/)?@([a-zA-Z0-9_.-]+)/i);
  if (handleMatch) {
    result.handle = '@' + handleMatch[1];
    result.isValid = true;
  }

  return result;
}

export interface OEmbedVideoData {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  html?: string;
  type?: string;
}

/**
 * Fetch video metadata via public oEmbed endpoint (CORS-friendly, no API key needed)
 */
export async function fetchYouTubeOEmbed(videoUrlOrId: string): Promise<OEmbedVideoData | null> {
  try {
    let targetUrl = videoUrlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(targetUrl)) {
      targetUrl = `https://www.youtube.com/watch?v=${targetUrl}`;
    }

    // Try YouTube oEmbed directly
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      return await res.json();
    }

    // Fallback: noembed.com wrapper
    const fallbackUrl = `https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`;
    const fallbackRes = await fetch(fallbackUrl);
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (data && data.title) {
        return {
          title: data.title,
          author_name: data.author_name || 'YouTube Creator',
          author_url: data.author_url || '',
          thumbnail_url: data.thumbnail_url || '',
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch oEmbed metadata:', err);
  }
  return null;
}
