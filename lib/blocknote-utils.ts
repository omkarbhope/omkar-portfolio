import type { BlogBlock } from '@/types';

/**
 * Extract plain text from BlockNote block tree for embeddings.
 * Walks content (inline text/links) and children recursively.
 */
function getTextFromInlineContent(content: unknown): string {
  if (!Array.isArray(content)) return '';
  const parts: string[] = [];
  for (const item of content) {
    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      if (obj.type === 'text' && typeof obj.text === 'string') {
        parts.push(obj.text);
      }
      if (obj.type === 'link' && Array.isArray(obj.content)) {
        parts.push(getTextFromInlineContent(obj.content));
      }
    }
  }
  return parts.join('');
}

export function blocksToPlainText(blocks: BlogBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.content != null) {
      parts.push(getTextFromInlineContent(block.content));
    }
    if (Array.isArray(block.children) && block.children.length > 0) {
      parts.push(blocksToPlainText(block.children as BlogBlock[]));
    }
  }
  return parts.filter(Boolean).join('\n');
}
