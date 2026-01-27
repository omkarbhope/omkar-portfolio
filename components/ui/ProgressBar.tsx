'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setProgress(0);
    
    // Animate progress
    const timer1 = setTimeout(() => setProgress(30), 50);
    const timer2 = setTimeout(() => setProgress(60), 150);
    const timer3 = setTimeout(() => setProgress(100), 300);
    const timer4 = setTimeout(() => setIsVisible(false), 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] h-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-[var(--border)] opacity-30" />
          
          {/* Progress bar */}
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--neon-green)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute top-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--neon-green)] blur-sm"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          
          {/* Leading glow dot */}
          <motion.div
            className="absolute top-0 h-2 w-2 -translate-y-1/4 rounded-full bg-white"
            initial={{ left: '0%' }}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              boxShadow: '0 0 10px var(--primary-glow), 0 0 20px var(--primary-glow)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
