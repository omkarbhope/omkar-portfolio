'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import CountUp from 'react-countup';
import { ExternalLink, Github, Sparkles } from 'lucide-react';
import type { Project } from '@/types';
import Badge from './ui/Badge';
import ScrollReveal from './animations/ScrollReveal';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

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
        className="group relative h-full"
        style={{
          perspective: '1000px',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        data-cursor="View Project"
      >
        <motion.div
          className="relative h-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-shadow duration-300"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ 
            boxShadow: 'var(--shadow-neon)',
            borderColor: 'var(--primary)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent), var(--neon-green), var(--primary))',
              backgroundSize: '300% 300%',
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              WebkitMaskComposite: 'xor',
            }}
            animate={{
              backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute -inset-2 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 to-[var(--neon-green)]/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ zIndex: -1 }}
          />

          <Link href={`/projects/${project._id}`}>
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <motion.h3
                  className="text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {project.title}
                </motion.h3>
                {project.featured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <Badge 
                      variant="primary" 
                      className="ml-2 flex items-center gap-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white border-0"
                    >
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </div>

              {/* Description */}
              <p 
                className="mt-3 text-sm leading-6 text-[var(--text-secondary)] line-clamp-3"
                style={{ transform: 'translateZ(15px)' }}
              >
                {project.description}
              </p>

              {/* Metrics Display */}
              {metrics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {metrics.slice(0, 2).map((metric, idx) => (
                    <motion.div
                      key={idx}
                      className="relative rounded-lg bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 px-3 py-1.5 text-sm font-bold"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.05 }}
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      <span className="gradient-text">
                        {(() => {
                          const numericValue = parseFloat(metric.replace(/[^0-9.]/g, ''));
                          if (!isNaN(numericValue) && (metric.includes('$') || metric.includes('%'))) {
                            return (
                              <CountUp
                                end={numericValue}
                                duration={2}
                                decimals={metric.includes('.') ? 1 : 0}
                                suffix={metric.includes('$') ? (metric.includes('M') ? 'M+' : metric.includes('K') ? 'K+' : '+') : '%'}
                                prefix={metric.includes('$') ? '$' : ''}
                              />
                            );
                          }
                          return metric;
                        })()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tech Stack */}
              <div className="mt-4 flex flex-wrap gap-2" style={{ transform: 'translateZ(10px)' }}>
                {project.techStack.slice(0, 4).map((tech, idx) => (
                  <motion.span
                    key={tech}
                    className="rounded-md bg-[var(--background-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    {tech}
                  </motion.span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="rounded-md bg-[var(--background-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--text-tertiary)] border border-[var(--border)]">
                    +{project.techStack.length - 4} more
                  </span>
                )}
              </div>

              {/* Key Achievement */}
              {project.achievements.length > 0 && (
                <div className="mt-4" style={{ transform: 'translateZ(10px)' }}>
                  <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Key Achievement
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {project.achievements[0]}
                  </p>
                </div>
              )}

              {/* Links */}
              <div className="mt-5 flex gap-3 pt-3 border-t border-[var(--border)]" style={{ transform: 'translateZ(20px)' }}>
                {project.demoUrl && (
                  <motion.a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:text-[var(--accent)] transition-colors"
                    whileHover={{ x: 2 }}
                    data-cursor="Open Demo"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    whileHover={{ x: 2 }}
                    data-cursor="View Code"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </motion.a>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </ScrollReveal>
  );
}
