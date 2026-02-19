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
