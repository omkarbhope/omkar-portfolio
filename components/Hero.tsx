'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './animations/ScrollReveal';

// Extend Window interface for THREE
declare global {
  interface Window {
    THREE?: any;
  }
}

export default function Hero() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load Vanta.js only if user prefers reduced motion is false
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      vantaRef.current &&
      !vantaEffect
    ) {
      // Load Three.js first, then Vanta.js
      Promise.all([
        import('three').then(m => m.default || m),
        import('vanta/dist/vanta.waves.min')
      ])
        .then(([THREE, VANTA]) => {
          if (vantaRef.current) {
            try {
              // Vanta.js expects THREE to be available
              const effect = VANTA.default({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x0070f3,
                shininess: 35.0,
                waveHeight: 15.0,
                waveSpeed: 0.75,
                zoom: 0.75,
              });
              setVantaEffect(effect);
            } catch (error) {
              console.warn('Failed to initialize Vanta effect:', error);
            }
          }
        })
        .catch((error) => {
          console.warn('Failed to load Vanta.js dependencies:', error);
        });
    }

    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.destroy();
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error);
        }
      }
    };
  }, [vantaEffect]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Optional Vanta.js Background */}
      <div
        ref={vantaRef}
        className="absolute inset-0 opacity-20"
        style={{ zIndex: 0 }}
      />
      {/* Fallback gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
        style={{ zIndex: 0 }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 w-full">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl"
          >
            Omkar Bhope
          </motion.h1>

          <motion.div variants={itemVariants} className="mt-6">
            <p className="text-lg leading-8 text-[var(--text-secondary)]">
              <span className="text-[var(--primary)]">Full Stack Software Engineer</span>
              {' | '}
              <span className="text-[var(--primary)]">AI/ML Enthusiast</span>
              {' | '}
              <span className="text-[var(--primary)]">Infrastructure Automation Expert</span>
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-base leading-7 text-[var(--text-tertiary)]"
          >
            Building scalable systems, AI-powered solutions, and innovative platforms that drive
            business growth.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/resume"
              className="rounded-md bg-[var(--primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] transition-colors"
            >
              View Resume
            </Link>
            <Link
              href="/projects"
              className="text-sm font-semibold leading-6 text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
            >
              View Projects <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-6 w-6 text-[var(--text-tertiary)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
