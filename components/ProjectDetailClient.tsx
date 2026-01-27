'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import type { Project } from '@/types';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  // Extract numeric metrics
  const extractNumericValue = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const match = value.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal>
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">{project.title}</h1>
            </div>
            {project.featured && (
              <Badge variant="primary">Featured</Badge>
            )}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="mb-8 flex flex-wrap gap-4">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Live Demo
              </Button>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          )}
        </div>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-3">
        <ScrollReveal delay={0.3} className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[var(--text-primary)]">
              About This Project
            </h2>
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {project.description}
              </div>
            </div>

            {project.achievements.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
                  Key Achievements
                </h3>
                <ul className="list-disc space-y-2 pl-6 text-[var(--text-secondary)]">
                  {project.achievements.map((achievement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {Object.keys(project.metrics).length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
                  Metrics & Impact
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(project.metrics).map(([key, value], index) => {
                    const numericValue = extractNumericValue(value);
                    const isNumeric = !isNaN(numericValue) && numericValue > 0;
                    return (
                      <motion.div
                        key={key}
                        className="rounded-lg bg-[var(--background-secondary)] p-4 border border-[var(--border)]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <p className="text-sm font-medium text-[var(--text-tertiary)]">
                          {key}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                          {isNumeric ? (
                            <>
                              {typeof value === 'string' && value.includes('$') && '$'}
                              <CountUp
                                end={numericValue}
                                duration={1.5}
                                decimals={value.toString().includes('.') ? 1 : 0}
                              />
                              {typeof value === 'string' && value.includes('%') && '%'}
                              {typeof value === 'string' && value.includes('M') && 'M'}
                              {typeof value === 'string' && value.includes('K') && 'K'}
                              {typeof value === 'string' && value.includes('+') && '+'}
                            </>
                          ) : (
                            value
                          )}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {project.architectureDiagrams.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
                  Architecture Diagrams
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.architectureDiagrams.map((diagram, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-lg border border-[var(--border)]"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Image
                        src={diagram}
                        alt={`Architecture diagram ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <Card className="p-6 h-fit">
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="rounded-md bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)] border border-[var(--primary)]/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
