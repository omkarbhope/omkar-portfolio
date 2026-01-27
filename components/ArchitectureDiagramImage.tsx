'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArchitectureDiagramImageProps {
  src: string;
  alt: string;
  originalUrl?: string;
}

export default function ArchitectureDiagramImage({
  src,
  alt,
  originalUrl,
}: ArchitectureDiagramImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="mb-2 text-sm text-[var(--text-tertiary)]">Image failed to load</p>
          {originalUrl && (
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Open original link
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain"
      sizes="100vw"
      onError={() => setHasError(true)}
    />
  );
}
