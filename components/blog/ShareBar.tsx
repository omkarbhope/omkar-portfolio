'use client';

import { useState } from 'react';

interface ShareBarProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareBar({ title, url, className = '' }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-[var(--text-tertiary)]">Share</span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm"
        aria-label="Share on Twitter"
      >
        Twitter
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm"
        aria-label="Copy link"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
