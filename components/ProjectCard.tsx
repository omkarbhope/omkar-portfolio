'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import type { Project } from '@/types';
import Badge from './ui/Badge';
import ScrollReveal from './animations/ScrollReveal';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  // Extract metrics from achievements (e.g., "$70M+", "35% reduction")
  const extractMetrics = (achievements: string[]) => {
    const metrics: string[] = [];
    achievements.forEach((achievement) => {
      const matches = achievement.match(/(\$[\d.]+[BMK]?\+?|\d+%|\d+[xX])/g);
      if (matches) {
        metrics.push(...matches);
      }
    });
    return metrics;
  };

  const metrics = extractMetrics(project.achievements);

  return (
    <ScrollReveal delay={index * 0.1} direction="up">
      <motion.div
        className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all hover:shadow-md"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Link href={`/projects/${project._id}`}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <motion.h3
                className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors"
                whileHover={{ x: 2 }}
              >
                {project.title}
              </motion.h3>
              {project.featured && (
                <Badge variant="primary" className="ml-2">
                  Featured
                </Badge>
              )}
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] line-clamp-3">
              {project.description}
            </p>

            {/* Metrics Display */}
            {metrics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {metrics.slice(0, 2).map((metric, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-md bg-[var(--primary)]/10 px-2 py-1 text-xs font-semibold text-[var(--primary)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1, type: 'spring' }}
                  >
                    {(() => {
                      const numericValue = parseFloat(metric.replace(/[^0-9.]/g, ''));
                      if (!isNaN(numericValue) && (metric.includes('$') || metric.includes('%'))) {
                        return (
                          <CountUp
                            end={numericValue}
                            duration={1.5}
                            decimals={metric.includes('.') ? 1 : 0}
                            suffix={metric.includes('$') ? (metric.includes('M') ? 'M+' : metric.includes('K') ? 'K+' : '+') : '%'}
                            prefix={metric.includes('$') ? '$' : ''}
                          />
                        );
                      }
                      return metric;
                    })()}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tech Stack */}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, 4).map((tech, idx) => (
                <motion.span
                  key={tech}
                  className="rounded-md bg-[var(--background-secondary)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.length > 4 && (
                <span className="rounded-md bg-[var(--background-secondary)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]">
                  +{project.techStack.length - 4} more
                </span>
              )}
            </div>

            {/* Key Achievement */}
            {project.achievements.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  Key Achievement:
                </p>
                <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                  {project.achievements[0]}
                </p>
              </div>
            )}

            {/* Links */}
            <div className="mt-4 flex gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                >
                  Live Demo →
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                >
                  GitHub →
                </a>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </ScrollReveal>
  );
}
