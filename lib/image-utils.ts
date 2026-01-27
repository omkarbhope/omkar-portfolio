/**
 * Converts Google Drive sharing links to direct image URLs
 * Handles both view and file/d formats
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // If it's already a direct image URL, return as is
  if (url.startsWith('http') && (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp') || url.includes('.svg'))) {
    // Check if it's a Google Drive direct link
    if (url.includes('drive.google.com/uc')) {
      return url;
    }
  }
  
  // Extract file ID from Google Drive sharing link
  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Format 2: https://drive.google.com/open?id=FILE_ID
  // Format 3: https://docs.google.com/document/d/FILE_ID/edit
  
  let fileId = '';
  
  // Try to extract from /file/d/FILE_ID/ format
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    fileId = fileIdMatch[1];
  } else {
    // Try to extract from ?id= format
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    } else {
      // Try to extract from /d/FILE_ID/ format (docs)
      const docsMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (docsMatch) {
        fileId = docsMatch[1];
      }
    }
  }
  
  if (!fileId) {
    // If we can't extract a file ID, return the original URL
    return url;
  }
  
  // Convert to direct image URL
  // For images, use: https://drive.google.com/uc?export=view&id=FILE_ID
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Checks if a URL is a Google Drive sharing link
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
