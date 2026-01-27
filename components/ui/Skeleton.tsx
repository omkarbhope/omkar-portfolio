'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'circular' | 'text' | 'card';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-[var(--background-secondary)]';
  
  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
    card: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 shimmer"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent)',
        }}
      />
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton
            variant="text"
            className={cn(
              'h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <motion.div 
      className={cn(
        'rounded-lg border border-[var(--border)] bg-[var(--background)] p-6 overflow-hidden',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonText lines={3} />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-6 w-18" />
      </div>
    </motion.div>
  );
}

export function SkeletonProfile({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SkeletonTimeline({ items = 3, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 h-full w-0.5 bg-[var(--border)] md:left-1/2" />
      
      <div className="space-y-12">
        {Array.from({ length: items }).map((_, i) => (
          <motion.div
            key={i}
            className={`relative flex items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {/* Timeline dot */}
            <Skeleton variant="circular" className="absolute left-8 z-10 h-4 w-4 md:left-1/2 md:-ml-2" />
            
            {/* Content */}
            <div className={`ml-16 w-full md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonSkillsGrid({ items = 6, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-md border border-[var(--border)] bg-[var(--background-secondary)] p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" className="h-6 w-6" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-24 text-center', className)}>
      <Skeleton className="h-14 w-72 mb-6" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-36" />
      </div>
      <Skeleton className="h-5 w-96 mb-8" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
