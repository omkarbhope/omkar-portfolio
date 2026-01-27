'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, Building2, MapPin, Calendar, ChevronRight } from 'lucide-react';
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, margin: '-100px' });

  return (
    <div className="relative" ref={timelineRef}>
      {/* Animated Timeline line */}
      <motion.div
        className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-[var(--primary)] via-[var(--accent)] to-[var(--neon-green)] md:left-1/2"
        initial={{ height: 0 }}
        animate={{ height: isInView ? '100%' : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Glowing pulse effect on the line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[var(--primary)] to-transparent"
          animate={{
            y: [0, 500, 0],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <div className="space-y-16">
        {experiences.map((experience, index) => {
          const isEven = index % 2 === 0;
          const isHovered = hoveredId === experience._id;

          return (
            <ScrollReveal 
              key={experience._id} 
              delay={index * 0.15} 
              direction={isEven ? 'left' : 'right'}
            >
              <div
                className={`relative flex items-start ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onMouseEnter={() => setHoveredId(experience._id || null)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Timeline dot with pulse animation */}
                <motion.div
                  className="absolute left-8 z-10 md:left-1/2 md:-ml-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                >
                  <div className="relative">
                    <motion.div
                      className="h-6 w-6 rounded-full border-4 border-[var(--background)] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        boxShadow: isHovered 
                          ? '0 0 20px var(--primary-glow), 0 0 40px var(--primary-glow)'
                          : '0 0 0 var(--primary-glow)',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Pulse rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[var(--primary)]"
                      animate={{
                        scale: [1, 2, 2],
                        opacity: [0.8, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </motion.div>

                {/* Content Card */}
                <motion.div
                  className={`ml-16 w-full md:ml-0 md:w-5/12 ${
                    isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm"
                    animate={{
                      borderColor: isHovered ? 'var(--primary)' : 'var(--border)',
                      boxShadow: isHovered ? 'var(--shadow-neon)' : 'var(--shadow-sm)',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background gradient on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <motion.h3 
                            className="text-xl font-semibold text-[var(--text-primary)]"
                            animate={{ color: isHovered ? 'var(--primary)' : 'var(--text-primary)' }}
                          >
                            {experience.position}
                          </motion.h3>
                          <div className="mt-2 flex items-center gap-2 text-[var(--primary)]">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{experience.company}</span>
                          </div>
                        </div>
                        {experience.current && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                          >
                            <Badge 
                              variant="success" 
                              className="bg-gradient-to-r from-[var(--neon-green)]/20 to-[var(--neon-green)]/10 text-[var(--neon-green)] border-[var(--neon-green)]/30"
                            >
                              Current
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {experience.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateRange(experience.startDate, experience.endDate)}
                        </div>
                      </div>

                      {/* Technologies */}
                      {experience.technologies.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.slice(0, 6).map((tech, techIndex) => (
                              <motion.span
                                key={`${experience._id}-${tech}-${techIndex}`}
                                className="rounded-md bg-[var(--background-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + techIndex * 0.05 }}
                                whileHover={{ y: -2 }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                            {experience.technologies.length > 6 && (
                              <span className="rounded-md bg-[var(--background-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--text-tertiary)] border border-[var(--border)]">
                                +{experience.technologies.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Projects Link */}
                      {experience.projects.length > 0 && (
                        <motion.div 
                          className="mt-6 pt-4 border-t border-[var(--border)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Link
                            href={`/experience/${experience._id}/projects`}
                            className="group/link flex items-center justify-between text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
                            data-cursor="View Projects"
                          >
                            <span className="flex items-center gap-2">
                              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[var(--primary)] text-xs font-semibold">
                                {experience.projects.length}
                              </span>
                              Project{experience.projects.length > 1 ? 's' : ''}
                            </span>
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="text-xs">View Details</span>
                              <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                            </motion.div>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
