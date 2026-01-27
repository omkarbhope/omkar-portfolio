'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden';
    
    const variants = {
      primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:opacity-90 btn-glow',
      secondary: 'bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--border)] hover:border-[var(--primary)]',
      outline: 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10',
      ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)]',
      danger: 'bg-[var(--error)] text-white hover:bg-[var(--error)]/90',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Shine effect on hover */}
        {variant === 'primary' && (
          <motion.div
            className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%', opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
