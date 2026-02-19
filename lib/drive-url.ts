/**
 * Extract Google Drive file ID from various URL forms.
 * Returns null if the URL is not a recognized Drive URL.
 */
export function getDriveFileId(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  const fileMatch = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const openMatch = u.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];
  const ucMatch = u.match(/drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return ucMatch[1];
  return null;
}

/**
 * Whether the URL is a Google Drive URL (any known form).
 */
export function isDriveUrl(url: string | undefined | null): boolean {
  return getDriveFileId(url) !== null;
}

/**
 * Convert Google Drive sharing URLs to the canonical form used for server-side fetch.
 * (Direct browser use of this URL often returns 403; use proxy or preview URL for display.)
 */
export function toDirectImageUrl(url: string | undefined | null): string {
  const id = getDriveFileId(url);
  if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  if (!url || typeof url !== 'string') return '';
  return url.trim();
}

/**
 * Preview URL for use in iframes (Google supports this for embedding).
 * Returns empty string if not a Drive URL.
 */
export function toDrivePreviewUrl(url: string | undefined | null): string {
  const id = getDriveFileId(url);
  if (!id) return '';
  return `https://drive.google.com/file/d/${id}/preview`;
}

/**
 * Extract YouTube video ID from watch, youtu.be, or embed URLs.
 * Returns null if not a recognized YouTube URL.
 */
export function getYoutubeVideoId(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  const watchMatch = u.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = u.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = u.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

/**
 * Whether the URL is a YouTube video URL.
 */
export function isYoutubeUrl(url: string | undefined | null): boolean {
  return getYoutubeVideoId(url) !== null;
}

/**
 * If url is our proxy-media path (e.g. /api/proxy-media?url=...), return the decoded target URL.
 * Otherwise return the original url. Use to detect Drive/YouTube when block stores proxied URL.
 */
export function resolveProxiedUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const u = url.trim();
  try {
    if (u.startsWith('/api/proxy-media') || u.includes('/api/proxy-media?')) {
      const parsed = new URL(u, 'https://_');
      const target = parsed.searchParams.get('url');
      if (target) return decodeURIComponent(target);
    }
    return u;
  } catch {
    return u;
  }
}

/**
 * YouTube embed URL for iframes (e.g. https://www.youtube.com/embed/VIDEO_ID).
 */
export function toYoutubeEmbedUrl(url: string | undefined | null): string {
  const id = getYoutubeVideoId(url);
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}`;
}

/**
 * For use as img/video/audio src: returns a same-origin proxy URL for Drive URLs
 * so the browser does not hit Drive directly (avoids 403).
 * origin: site origin (e.g. window.location.origin). Use '' for relative path.
 */
export function toProxiedMediaUrl(url: string | undefined | null, origin: string): string {
  if (!url || typeof url !== 'string') return '';
  const id = getDriveFileId(url);
  if (!id) return url.trim();
  const driveUrl = toDirectImageUrl(url);
  const base = origin ? origin.replace(/\/$/, '') : '';
  const path = '/api/proxy-media?url=' + encodeURIComponent(driveUrl);
  return base ? base + path : path;
}
