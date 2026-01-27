'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent' | 'outline';
  animate?: boolean;
  pulse?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', animate = false, pulse = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]',
      primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white',
      success: 'bg-gradient-to-r from-[var(--neon-green)] to-[var(--success)] text-white',
      warning: 'bg-gradient-to-r from-[var(--warning)] to-orange-500 text-white',
      accent: 'bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white',
      outline: 'bg-transparent border border-[var(--primary)] text-[var(--primary)]',
    };

    const baseClasses = cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all',
      variants[variant],
      pulse && 'animate-pulse',
      className
    );

    if (animate) {
      return (
        <motion.span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={baseClasses}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          {...(props as any)}
        >
          {children}
        </motion.span>
      );
    }

    return (
      <span
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
