'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Skill } from '@/types';

interface AnimatedBackgroundProps {
  skills?: Skill[];
}

const MAX_VISIBLE_BUBBLES = 20;
const ROTATION_INTERVAL = 8000; // Rotate every 8 seconds

// Category colors for bubbles
const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  Languages: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', text: 'rgb(59, 130, 246)' },
  'Web Dev': { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.25)', text: 'rgb(34, 197, 94)' },
  Databases: { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)', text: 'rgb(168, 85, 247)' },
  'AI/ML': { bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.25)', text: 'rgb(236, 72, 153)' },
  Infrastructure: { bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.25)', text: 'rgb(249, 115, 22)' },
  DevOps: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)', text: 'rgb(239, 68, 68)' },
};

// Fixed positions distributed across the screen (avoiding center area)
const bubblePositions = [
  // Top area
  { x: 5, y: 8 }, { x: 20, y: 5 }, { x: 35, y: 10 }, { x: 65, y: 8 }, { x: 80, y: 5 }, { x: 92, y: 10 },
  // Upper sides
  { x: 3, y: 22 }, { x: 15, y: 18 }, { x: 85, y: 20 }, { x: 95, y: 25 },
  // Middle sides (avoiding center)
  { x: 2, y: 40 }, { x: 8, y: 55 }, { x: 92, y: 45 }, { x: 96, y: 58 },
  // Lower sides
  { x: 5, y: 72 }, { x: 12, y: 80 }, { x: 88, y: 75 }, { x: 94, y: 82 },
  // Bottom area
  { x: 8, y: 90 }, { x: 25, y: 88 }, { x: 45, y: 92 }, { x: 60, y: 90 }, { x: 78, y: 88 }, { x: 90, y: 92 },
];

interface PositionedSkill extends Skill {
  x: number;
  y: number;
  size: 'sm' | 'md' | 'lg';
}

// Skill bubble component
function SkillBubble({ 
  skill, 
  x, 
  y, 
  size,
  index,
}: { 
  skill: Skill; 
  x: number; 
  y: number; 
  size: 'sm' | 'md' | 'lg';
  index: number;
}) {
  const colors = categoryColors[skill.category] || categoryColors.Languages;
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  // Stagger delay based on index (0.025s between each bubble)
  const staggerDelay = index * 0.025;

  return (
    <motion.div
      className={`absolute flex items-center gap-1.5 rounded-full backdrop-blur-sm pointer-events-none select-none ${sizeClasses[size]}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 0.85,
        scale: 1,
        y: [0, -8, 0, 8, 0],
        x: [0, 5, -3, 4, 0],
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        opacity: { duration: 0.5, delay: staggerDelay },
        scale: { duration: 0.5, delay: staggerDelay },
        y: { duration: 15 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: staggerDelay },
        x: { duration: 18 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: staggerDelay },
      }}
    >
      {skill.icon && skill.icon.trim() !== '' && (
        <Image 
          src={skill.icon} 
          alt={skill.name}
          width={iconSizes[size]}
          height={iconSizes[size]}
          className="object-contain"
          onError={(e) => {
            // Hide the image if it fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <span className="font-medium whitespace-nowrap">{skill.name}</span>
    </motion.div>
  );
}

// Gradient orbs in background
function GradientOrbs() {
  return (
    <>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          left: '10%',
          top: '5%',
        }}
        animate={{
          x: [0, 60, 0, -40, 0],
          y: [0, 40, -30, 20, 0],
          scale: [1, 1.15, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          right: '5%',
          bottom: '10%',
        }}
        animate={{
          x: [0, -50, 0, 30, 0],
          y: [0, -30, 40, -20, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, var(--neon-green) 0%, transparent 70%)',
          left: '50%',
          top: '60%',
        }}
        animate={{
          x: [0, 40, -30, 20, 0],
          y: [0, 50, 0, -50, 0],
          scale: [1, 1.2, 0.85, 1.1, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
    </>
  );
}

// Subtle grid pattern
function GridPattern() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(var(--text-tertiary) 1px, transparent 1px),
          linear-gradient(90deg, var(--text-tertiary) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
  );
}

export default function AnimatedBackground({ skills = [] }: AnimatedBackgroundProps) {
  const [rotationIndex, setRotationIndex] = useState(0);

  // Prepare all skills with varied sizes - distributed pattern for visual variety
  const allSkills = useMemo(() => {
    // Pattern: ensures good mix of sizes (roughly 30% large, 40% medium, 30% small)
    const sizePattern: ('sm' | 'md' | 'lg')[] = ['lg', 'sm', 'md', 'md', 'sm', 'lg', 'md', 'sm', 'md', 'lg'];
    return skills.map((skill, index) => {
      const patternSize = sizePattern[index % sizePattern.length];
      // Boost high proficiency skills to at least medium
      const size: 'sm' | 'md' | 'lg' = skill.proficiency >= 4 
        ? (patternSize === 'sm' ? 'md' : patternSize)
        : patternSize;
      return { ...skill, size };
    });
  }, [skills]);

  // Rotate through skills
  useEffect(() => {
    if (allSkills.length <= MAX_VISIBLE_BUBBLES) return;

    const interval = setInterval(() => {
      setRotationIndex((prev) => (prev + 1) % Math.ceil(allSkills.length / MAX_VISIBLE_BUBBLES));
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [allSkills.length]);

  // Get current visible skills - use deterministic positions to avoid hydration mismatch
  const visibleSkills = useMemo((): PositionedSkill[] => {
    if (allSkills.length === 0) return [];

    const startIndex = rotationIndex * MAX_VISIBLE_BUBBLES;
    const selectedSkills = allSkills.length <= MAX_VISIBLE_BUBBLES 
      ? allSkills 
      : [
          ...allSkills.slice(startIndex, startIndex + MAX_VISIBLE_BUBBLES),
          // If we don't have enough, wrap around
          ...allSkills.slice(0, Math.max(0, (startIndex + MAX_VISIBLE_BUBBLES) - allSkills.length)),
        ].slice(0, MAX_VISIBLE_BUBBLES);

    // Assign positions to skills - use deterministic offsets based on index
    return selectedSkills.map((skill, index) => {
      const pos = bubblePositions[index % bubblePositions.length];
      // Deterministic offset based on skill name length and index
      const offsetX = ((skill.name.length % 5) - 2) * 0.5;
      const offsetY = ((index % 4) - 2) * 0.5;
      return {
        ...skill,
        x: pos.x + offsetX,
        y: pos.y + offsetY,
      };
    });
  }, [allSkills, rotationIndex]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient orbs */}
      <GradientOrbs />
      
      {/* Subtle grid */}
      <GridPattern />
      
      {/* Floating skill bubbles with rotation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={rotationIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {visibleSkills.map((skill, index) => (
            <SkillBubble
              key={`${skill._id || skill.name}-${index}`}
              skill={skill}
              x={skill.x}
              y={skill.y}
              size={skill.size}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
