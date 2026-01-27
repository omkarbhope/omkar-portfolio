'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { GraduationCap, MapPin, Calendar, Award, BookOpen, Trophy } from 'lucide-react';
import type { Education } from '@/types';
import { formatDateRange } from '@/lib/utils';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface EducationTimelineProps {
  education: Education[];
}

export default function EducationTimeline({ education }: EducationTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <div className="space-y-8" ref={containerRef}>
      {education.map((edu, index) => {
        const isHovered = hoveredId === edu._id;
        
        return (
          <ScrollReveal key={edu._id} delay={index * 0.15} direction="up">
            <motion.div
              className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-6"
              onMouseEnter={() => setHoveredId(edu._id || null)}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                borderColor: isHovered ? 'var(--primary)' : 'var(--border)',
                boxShadow: isHovered ? 'var(--shadow-neon)' : 'var(--shadow-sm)',
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -4 }}
            >
              {/* Background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <motion.div 
                  className="flex-shrink-0"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-3">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <motion.h3 
                    className="text-2xl font-bold text-[var(--text-primary)]"
                    animate={{ color: isHovered ? 'var(--primary)' : 'var(--text-primary)' }}
                  >
                    {edu.degree}
                  </motion.h3>
                  
                  <p className="mt-1 text-lg font-medium gradient-text">
                    {edu.institution}
                  </p>

                  {/* Meta info */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {edu.field}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {edu.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </div>
                  </div>

                  {/* GPA with animated counter */}
                  {edu.gpa && (
                    <motion.div 
                      className="mt-5 inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 px-4 py-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Trophy className="h-5 w-5 text-[var(--primary)]" />
                      <div>
                        <span className="text-sm text-[var(--text-secondary)]">GPA: </span>
                        <span className="text-lg font-bold gradient-text">
                          {isInView ? (
                            <>
                              <CountUp
                                end={edu.gpa}
                                duration={2}
                                decimals={2}
                                delay={0.5}
                              />
                              {edu.gpaScale && (
                                <>
                                  {' / '}
                                  <CountUp
                                    end={edu.gpaScale}
                                    duration={1.5}
                                    decimals={0}
                                    delay={0.5}
                                  />
                                </>
                              )}
                            </>
                          ) : (
                            `${edu.gpa}${edu.gpaScale ? ` / ${edu.gpaScale}` : ''}`
                          )}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Honors & Achievements */}
                  {edu.honors.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-[var(--neon-green)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          Honors & Achievements
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {edu.honors.map((honor, honorIndex) => (
                          <motion.div
                            key={honorIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + honorIndex * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge 
                              variant="success" 
                              className="bg-gradient-to-r from-[var(--neon-green)]/20 to-[var(--neon-green)]/10 text-[var(--neon-green)] border-[var(--neon-green)]/30"
                            >
                              {honor}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Courses */}
                  {edu.courses.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-[var(--accent)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          Relevant Coursework
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.map((course, courseIndex) => (
                          <motion.span
                            key={courseIndex}
                            className="rounded-md bg-[var(--background-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + courseIndex * 0.03 }}
                            whileHover={{ y: -2 }}
                          >
                            {course}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
