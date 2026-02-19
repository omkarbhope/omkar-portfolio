'use client';

import type { TocEntry } from '@/lib/blog-utils';

interface TableOfContentsProps {
  headings: TocEntry[];
  className?: string;
}

export function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={`sticky top-24 space-y-2 text-sm ${className}`}
    >
      <h3 className="font-semibold text-[var(--text-primary)] mb-3">On this page</h3>
      <ul className="space-y-1.5 border-l-2 border-[var(--border)] pl-4">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            style={{ marginLeft: level === 3 ? '0.75rem' : 0 }}
            className="border-l-0"
          >
            <a
              href={`#${id}`}
              className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
