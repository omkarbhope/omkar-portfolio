'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Terminal, Cpu, Database, Cloud, Sparkles } from 'lucide-react';
import ParticleBackground from './animations/ParticleBackground';

// Tech icons for floating animation
const techIcons = [
  { Icon: Terminal, delay: 0, x: -200, y: -100 },
  { Icon: Cpu, delay: 0.5, x: 200, y: -150 },
  { Icon: Database, delay: 1, x: -250, y: 100 },
  { Icon: Cloud, delay: 1.5, x: 250, y: 50 },
  { Icon: Sparkles, delay: 2, x: -150, y: 150 },
];

// Typing effect component
function TypeWriter({ 
  texts, 
  speed = 100, 
  deleteSpeed = 50,
  pauseTime = 2000 
}: { 
  texts: string[]; 
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className="gradient-text">
      {currentText}
      <span className="animate-pulse text-[var(--primary)]">|</span>
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titles = [
    'Full Stack Software Engineer',
    'AI/ML Enthusiast',
    'Infrastructure Automation Expert',
    'Cloud Architecture Specialist',
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section 
      id="hero" 
      ref={containerRef}
      className="relative overflow-hidden min-h-[90vh] flex items-center"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground 
          particleCount={100}
          connectionDistance={120}
          mouseInteraction={true}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] z-[1]"
      />

      {/* Tech pattern background */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, var(--accent) 0%, transparent 50%)`,
        }} />
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {techIcons.map(({ Icon, delay, x, y: iconY }, index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.2, 
              scale: 1,
              x: [x, x + 20, x],
              y: [iconY, iconY - 20, iconY],
            }}
            transition={{
              opacity: { delay, duration: 0.5 },
              scale: { delay, duration: 0.5 },
              x: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: 'easeInOut' },
              y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Icon className="h-8 w-8 text-[var(--primary)]" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 w-full"
        style={{ y, opacity }}
      >
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting */}
          <motion.div 
            variants={itemVariants}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--primary)]">
              <Sparkles className="h-4 w-4" />
              Welcome to my portfolio
            </span>
          </motion.div>

          {/* Name with neon glow */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight sm:text-7xl"
          >
            <span className="text-[var(--text-primary)]">Hi, I&apos;m </span>
            <span className="relative">
              <span className="gradient-text">Omkar Bhope</span>
              <motion.span
                className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 to-[var(--neon-green)]/20 blur-xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </span>
          </motion.h1>

          {/* Typing effect title */}
          <motion.div 
            variants={itemVariants} 
            className="mt-6"
          >
            <p className="text-xl leading-8 text-[var(--text-secondary)] sm:text-2xl">
              <TypeWriter 
                texts={titles}
                speed={80}
                deleteSpeed={40}
                pauseTime={2500}
              />
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base leading-7 text-[var(--text-tertiary)] sm:text-lg max-w-2xl mx-auto"
          >
            Building scalable systems, AI-powered solutions, and innovative platforms 
            that drive <span className="text-[var(--neon-green)] font-semibold">$70M+</span> in 
            business growth with cutting-edge technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/resume"
              className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              data-cursor="View Resume"
            >
              <span className="relative z-10">View Resume</span>
              <motion.span
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
              />
              <motion.span
                className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--neon-green)] opacity-0 blur transition-opacity group-hover:opacity-50"
              />
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
              data-cursor="View Projects"
            >
              View Projects
              <motion.span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { label: 'Years Experience', value: '5+' },
              { label: 'Projects Delivered', value: '20+' },
              { label: 'Technologies', value: '30+' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="text-3xl font-bold gradient-text"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.2, type: 'spring' }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-[var(--text-tertiary)] mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-xs text-[var(--text-tertiary)]">Scroll to explore</span>
            <div className="relative">
              <ChevronDown className="h-6 w-6 text-[var(--primary)]" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(0, 217, 255, 0.4)',
                    '0 0 0 10px rgba(0, 217, 255, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
