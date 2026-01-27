'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { GraduationCap } from 'lucide-react';
import type { Education } from '@/types';
import { formatDateRange } from '@/lib/utils';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface EducationTimelineProps {
  education: Education[];
}

export default function EducationTimeline({ education }: EducationTimelineProps) {
  return (
    <div className="space-y-8">
      {education.map((edu, index) => (
        <ScrollReveal key={edu._id} delay={index * 0.1} direction="up">
          <Card hover className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-[var(--primary)]/10 p-3">
                  <GraduationCap className="h-6 w-6 text-[var(--primary)]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                  {edu.degree}
                </h3>
                <p className="mt-1 text-lg font-medium text-[var(--primary)]">
                  {edu.institution}
                </p>
                <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                  {edu.field} • {edu.location}
                </p>
                <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                  {formatDateRange(edu.startDate, edu.endDate)}
                </p>

                {edu.gpa && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      GPA:{' '}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {edu.gpaScale ? (
                          <>
                            <CountUp
                              end={edu.gpa}
                              duration={1.5}
                              decimals={2}
                            />
                            {' / '}
                            <CountUp
                              end={edu.gpaScale}
                              duration={1.5}
                              decimals={0}
                            />
                          </>
                        ) : (
                          <CountUp
                            end={edu.gpa}
                            duration={1.5}
                            decimals={2}
                          />
                        )}
                      </span>
                    </p>
                  </div>
                )}

                {edu.honors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Honors & Achievements:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.honors.map((honor, honorIndex) => (
                        <motion.div
                          key={honorIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + honorIndex * 0.1 }}
                        >
                          <Badge variant="success">{honor}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {edu.courses.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Relevant Coursework:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course, courseIndex) => (
                        <motion.span
                          key={courseIndex}
                          className="rounded-md bg-[var(--background-secondary)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + courseIndex * 0.05 }}
                        >
                          {course}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
}
