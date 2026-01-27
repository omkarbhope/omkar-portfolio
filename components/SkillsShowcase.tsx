'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, Brain, Server, Settings, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import type { Skill } from '@/types';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';
import Badge from './ui/Badge';

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

const categoryColors: Record<Skill['category'], string> = {
  Languages: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Web Dev': 'bg-green-500/10 text-green-600 border-green-500/20',
  Databases: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'AI/ML': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  Infrastructure: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  DevOps: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function SkillsShowcase({ skills }: SkillsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<Skill['category'] | 'All'>('All');
  const { theme, resolvedTheme } = useTheme();
  
  // Determine if we're in dark mode
  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark';

  const categories: Skill['category'][] = ['Languages', 'Web Dev', 'Databases', 'AI/ML', 'Infrastructure', 'DevOps'];
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const skillsByCategory = categories.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.category === category);
    return acc;
  }, {} as Record<Skill['category'], Skill[]>);

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <motion.button
          onClick={() => setSelectedCategory('All')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] border border-[var(--border)]'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;
          return (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                isSelected
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] border border-[var(--border)]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="h-4 w-4" />
              {category} ({skillsByCategory[category]?.length || 0})
            </motion.button>
          );
        })}
      </div>

      {/* Skills by Category View */}
      <AnimatePresence mode="wait">
        {selectedCategory === 'All' ? (
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {categories.map((category, categoryIndex) => {
              const categorySkills = skillsByCategory[category];
              if (categorySkills.length === 0) return null;
              const Icon = categoryIcons[category];

              return (
                <ScrollReveal key={category} delay={categoryIndex * 0.1} direction="up">
                  <Card className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-[var(--primary)]" />
                      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {category}
                      </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill._id}
                          className="rounded-md border border-[var(--border)] bg-[var(--background-secondary)] p-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: skillIndex * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {skill.icon && (
                                <div className="relative h-6 w-6 flex-shrink-0">
                                  <Image
                                    src={skill.icon}
                                    alt={skill.name}
                                    fill
                                    className={`object-contain ${isDarkMode ? 'invert' : ''}`}
                                    onError={(e) => {
                                      // Hide image if it fails to load
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <span className="font-medium text-[var(--text-primary)]">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-sm text-[var(--text-tertiary)]">
                              {skill.proficiency}/5
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${(skill.proficiency / 5) * 100}%` }}
                              transition={{ delay: 0.3 + skillIndex * 0.05, duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                {(() => {
                  const Icon = categoryIcons[selectedCategory];
                  return <Icon className="h-5 w-5 text-[var(--primary)]" />;
                })()}
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  {selectedCategory}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill._id}
                    className="rounded-md border border-[var(--border)] bg-[var(--background-secondary)] p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: skillIndex * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {skill.icon && (
                          <div className="relative h-6 w-6 flex-shrink-0">
                            <Image
                              src={skill.icon}
                              alt={skill.name}
                              fill
                              className={`object-contain ${isDarkMode ? 'invert' : ''}`}
                              onError={(e) => {
                                // Hide image if it fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <span className="font-medium text-[var(--text-primary)]">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-[var(--text-tertiary)]">
                        {skill.proficiency}/5
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.proficiency / 5) * 100}%` }}
                        transition={{ delay: 0.2 + skillIndex * 0.05, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
