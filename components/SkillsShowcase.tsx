'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, Brain, Server, Settings, Globe, Filter, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import type { Skill } from '@/types';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';

interface SkillsShowcaseProps {
  skills: Skill[];
}

const categoryIcons: Record<Skill['category'], typeof Code> = {
  Languages: Code,
  'Web Dev': Globe,
  Databases: Database,
  'AI/ML': Brain,
  Infrastructure: Server,
  DevOps: Settings,
};

const categoryGradients: Record<Skill['category'], string> = {
  Languages: 'from-blue-500 to-cyan-500',
  'Web Dev': 'from-green-500 to-emerald-500',
  Databases: 'from-purple-500 to-violet-500',
  'AI/ML': 'from-pink-500 to-rose-500',
  Infrastructure: 'from-orange-500 to-amber-500',
  DevOps: 'from-red-500 to-orange-500',
};

// Radial progress component
function RadialProgress({ value, max = 5, size = 40, className = '' }: { value: number; max?: number; size?: number; className?: string }) {
  const percentage = (value / max) * 100;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-[var(--text-primary)]">{value}</span>
      </div>
    </div>
  );
}

export default function SkillsShowcase({ skills }: SkillsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<Skill['category'] | 'All'>('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only use isDarkMode after mounting to avoid hydration mismatch
  const isDarkMode = mounted && resolvedTheme === 'dark';

  const categories: Skill['category'][] = ['Languages', 'Web Dev', 'Databases', 'AI/ML', 'Infrastructure', 'DevOps'];
  
  const filteredSkills = useMemo(() => {
    return selectedCategory === 'All' 
      ? skills 
      : skills.filter(skill => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  const skillsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = skills.filter(skill => skill.category === category);
      return acc;
    }, {} as Record<Skill['category'], Skill[]>);
  }, [skills]);

  return (
    <div>
      {/* Category Filter */}
      <ScrollReveal direction="down">
        <div className="mb-8 flex flex-wrap gap-2">
          <motion.button
            onClick={() => setSelectedCategory('All')}
            className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 overflow-hidden ${
              selectedCategory === 'All'
                ? 'text-white'
                : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] border border-[var(--border)]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedCategory === 'All' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                layoutId="categoryBg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Filter className="h-4 w-4 relative z-10" />
            <span className="relative z-10">All ({skills.length})</span>
          </motion.button>
          
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            const isSelected = selectedCategory === category;
            const count = skillsByCategory[category]?.length || 0;
            
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 overflow-hidden ${
                  isSelected
                    ? 'text-white'
                    : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] border border-[var(--border)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSelected && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${categoryGradients[category]}`}
                    layoutId="categoryBg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{category}</span>
                <span className={`relative z-10 rounded-full px-2 py-0.5 text-xs ${
                  isSelected ? 'bg-white/20' : 'bg-[var(--border)]'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Skills Display */}
      <AnimatePresence mode="wait">
        {selectedCategory === 'All' ? (
          // Grid view for all categories
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {categories.map((category, categoryIndex) => {
              const categorySkills = skillsByCategory[category];
              if (categorySkills.length === 0) return null;
              const Icon = categoryIcons[category];
              const gradient = categoryGradients[category];

              return (
                <ScrollReveal key={category} delay={categoryIndex * 0.1} direction="up">
                  <motion.div
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 overflow-hidden relative"
                    whileHover={{ borderColor: 'var(--primary)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${gradient} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
                    
                    <div className="relative z-10">
                      <div className="mb-6 flex items-center gap-3">
                        <div className={`rounded-lg bg-gradient-to-r ${gradient} p-2`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                          {category}
                        </h2>
                        <span className="text-sm text-[var(--text-tertiary)]">
                          ({categorySkills.length} skills)
                        </span>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categorySkills.map((skill, skillIndex) => (
                          <SkillCard
                            key={skill._id}
                            skill={skill}
                            index={skillIndex}
                            isHovered={hoveredSkill === skill._id}
                            onHover={() => setHoveredSkill(skill._id || null)}
                            onLeave={() => setHoveredSkill(null)}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </motion.div>
        ) : (
          // Filtered view
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 relative overflow-hidden">
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${categoryGradients[selectedCategory]} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
              
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  {(() => {
                    const Icon = categoryIcons[selectedCategory];
                    return (
                      <div className={`rounded-lg bg-gradient-to-r ${categoryGradients[selectedCategory]} p-2`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    );
                  })()}
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {selectedCategory}
                  </h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSkills.map((skill, skillIndex) => (
                    <SkillCard
                      key={skill._id}
                      skill={skill}
                      index={skillIndex}
                      isHovered={hoveredSkill === skill._id}
                      onHover={() => setHoveredSkill(skill._id || null)}
                      onLeave={() => setHoveredSkill(null)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Separate SkillCard component for better organization
function SkillCard({ 
  skill, 
  index, 
  isHovered,
  onHover,
  onLeave,
  isDarkMode 
}: { 
  skill: Skill; 
  index: number; 
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isDarkMode: boolean;
}) {
  return (
    <motion.div
      className="relative rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-4 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        y: -4,
        borderColor: 'var(--primary)',
        boxShadow: isDarkMode ? 'var(--shadow-neon)' : 'var(--shadow-md)',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {skill.icon ? (
              <motion.div 
                className="relative h-8 w-8 flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  fill
                  className={`object-contain ${isDarkMode ? 'invert' : ''}`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <span className="font-medium text-[var(--text-primary)]">
              {skill.name}
            </span>
          </div>
          <RadialProgress value={skill.proficiency} />
        </div>
        
        {/* Animated progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--neon-green)]"
            initial={{ width: 0 }}
            animate={{ width: `${(skill.proficiency / 5) * 100}%` }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        
        {/* Proficiency label */}
        <div className="mt-2 flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>Proficiency</span>
          <span className="font-medium text-[var(--primary)]">
            {skill.proficiency === 5 ? 'Expert' : 
             skill.proficiency >= 4 ? 'Advanced' : 
             skill.proficiency >= 3 ? 'Intermediate' : 'Beginner'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
