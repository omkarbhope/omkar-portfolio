import type { BlogBlock } from '@/types';
import { blocksToPlainText } from './blocknote-utils';

const WORDS_PER_MINUTE = 200;

export type TocEntry = { id: string; text: string; level: number };

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function headingLevel(type: string): number | null {
  if (type === 'heading') return 1;
  if (type === 'heading_2' || type === 'heading2') return 2;
  if (type === 'heading_3' || type === 'heading3') return 3;
  if (type === 'heading_4' || type === 'heading4') return 4;
  if (type === 'heading_5' || type === 'heading5') return 5;
  if (type === 'heading_6' || type === 'heading6') return 6;
  return null;
}

/**
 * Extract TOC entries (h2, h3) from BlockNote blocks for table of contents.
 */
export function getHeadingsFromBlocks(blocks: BlogBlock[]): TocEntry[] {
  const entries: TocEntry[] = [];
  const seen = new Map<string, number>();

  function walk(blks: BlogBlock[]) {
    for (const block of blks) {
      const type = (block.type as string) || '';
      const level = headingLevel(type);
      if (level != null && level >= 2 && level <= 3) {
        const text = getTextFromInlineContent(block.content);
        if (text) {
          let id = slugify(text);
          const count = seen.get(id) ?? 0;
          seen.set(id, count + 1);
          if (count > 0) id = `${id}-${count}`;
          entries.push({ id, text, level });
        }
      }
      if (Array.isArray(block.children) && block.children.length > 0) {
        walk(block.children as BlogBlock[]);
      }
    }
  }

  walk(blocks);
  return entries;
}

/**
 * Estimate reading time in minutes from block content.
 */
export function getReadingTimeMinutes(blocks: BlogBlock[]): number {
  const text = blocksToPlainText(blocks);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
