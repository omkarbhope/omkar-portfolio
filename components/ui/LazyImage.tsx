'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from './Skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
}: LazyImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[var(--background-secondary)] ${className}`}>
        <span className="text-[var(--text-tertiary)] text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <Skeleton className="absolute inset-0" />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={className}
        />
      </motion.div>
    </div>
  );
}
