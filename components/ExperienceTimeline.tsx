'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';
import ScrollReveal from './animations/ScrollReveal';
import Badge from './ui/Badge';
import Card from './ui/Card';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <motion.div
        className="absolute left-8 top-0 h-full w-0.5 bg-[var(--border)] md:left-1/2"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: 'top' }}
      />

      <div className="space-y-12">
        {experiences.map((experience, index) => {
          const isExpanded = expandedItems.has(experience._id || '');
          const isEven = index % 2 === 0;

          return (
            <ScrollReveal key={experience._id} delay={index * 0.1} direction="up">
              <div
                className={`relative flex items-start ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-8 z-10 h-4 w-4 rounded-full border-4 border-[var(--background)] bg-[var(--primary)] md:left-1/2 md:-ml-2"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Content */}
                <div
                  className={`ml-16 w-full md:ml-0 md:w-5/12 ${
                    isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                >
                  <Card hover className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                          {experience.position}
                        </h3>
                        <p className="mt-1 text-lg font-medium text-[var(--primary)]">
                          {experience.company}
                        </p>
                        <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                          {experience.location}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <p className="text-sm text-[var(--text-tertiary)]">
                            {formatDateRange(experience.startDate, experience.endDate)}
                          </p>
                          {experience.current && (
                            <Badge variant="success">Current</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {experience.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={`${experience._id}-${tech}-${techIndex}`}
                            className="rounded-md bg-[var(--background-secondary)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + techIndex * 0.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {experience.projects.length > 0 && (
                      <div className="mt-6">
                        <Link
                          href={`/experience/${experience._id}/projects`}
                          className="flex w-full items-center justify-between text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors group"
                        >
                          <span>
                            View {experience.projects.length} Project{experience.projects.length > 1 ? 's' : ''}
                          </span>
                          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
