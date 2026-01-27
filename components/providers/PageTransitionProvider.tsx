'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayLocation, setDisplayLocation] = useState(pathname);
  const [transitionStage, setTransitionStage] = useState('entering');

  useEffect(() => {
    if (pathname !== displayLocation) {
      setTransitionStage('exiting');
    }
  }, [pathname, displayLocation]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setDisplayLocation(pathname);
        setTransitionStage('entering');
      }}
    >
      <motion.div
        key={displayLocation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
