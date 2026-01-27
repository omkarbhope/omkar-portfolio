'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--primary)]"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      style={{ transformOrigin: 'left' }}
      transition={{ duration: 0.3 }}
    />
  );
}
