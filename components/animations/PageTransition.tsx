'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Export variants for use in child components
export { childVariants };

// Wrapper component for staggered children
export function StaggerContainer({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{
        initial: {},
        enter: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
        exit: {
          transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={childVariants}
    >
      {children}
    </motion.div>
  );
}

// Fade-up animation for sections
export function FadeUp({ 
  children, 
  delay = 0,
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale-in animation for cards
export function ScaleIn({ 
  children, 
  delay = 0,
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Slide-in animation
export function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0,
  className = '' 
}: { 
  children: ReactNode; 
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}) {
  const directionOffset = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
