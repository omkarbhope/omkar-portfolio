/**
 * Convert Google Drive sharing URLs to direct view URLs so images/files can be embedded.
 * Drive sharing links (e.g. https://drive.google.com/file/d/FILE_ID/view) return HTML;
 * this converts to the export format that returns the actual file.
 */
export function toDirectImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const u = url.trim();
  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileMatch = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }
  // https://drive.google.com/open?id=FILE_ID
  const openMatch = u.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }
  // https://drive.google.com/uc?id=FILE_ID (direct link form)
  const ucMatch = u.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return `https://drive.google.com/uc?export=view&id=${ucMatch[1]}`;
  }
  // Already uc?export=view or other format
  return u;
}
