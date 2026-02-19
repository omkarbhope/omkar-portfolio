'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toDirectImageUrl } from '@/lib/drive-url';

interface BlogCoverImageProps {
  src: string;
  alt?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export function BlogCoverImage({
  src,
  alt = '',
  fill = false,
  className,
  sizes,
  priority,
  fallbackTitle,
}: BlogCoverImageProps) {
  const [error, setError] = useState(false);
  const resolved = toDirectImageUrl(src);
  const isDrive = resolved.includes('drive.google.com');

  if (!resolved) return null;

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 ${className || ''}`}
        style={fill ? { position: 'absolute', inset: 0 } : undefined}
      >
        {fallbackTitle ? (
          <span className="text-4xl font-semibold text-[var(--text-tertiary)]">
            {fallbackTitle.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="text-4xl text-[var(--text-tertiary)]" aria-hidden>📷</span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isDrive}
      onError={() => setError(true)}
    />
  );
}
