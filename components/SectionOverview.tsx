'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Briefcase, GraduationCap, Zap, Award, Trophy } from 'lucide-react';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';

const sections = [
  {
    title: 'Projects',
    description: 'Explore my portfolio of full-stack applications, AI/ML solutions, and infrastructure automation projects.',
    href: '/projects',
    icon: Rocket,
  },
  {
    title: 'Experience',
    description: 'My professional journey across companies, highlighting key projects and achievements.',
    href: '/experience',
    icon: Briefcase,
  },
  {
    title: 'Education',
    description: 'Academic background, coursework, and achievements from UC San Diego and PICT.',
    href: '/education',
    icon: GraduationCap,
  },
  {
    title: 'Skills',
    description: 'Technical skills across languages, frameworks, databases, AI/ML, and infrastructure.',
    href: '/skills',
    icon: Zap,
  },
  {
    title: 'Certifications',
    description: 'Professional certifications and licenses that validate my expertise.',
    href: '/certifications',
    icon: Award,
  },
  {
    title: 'Awards',
    description: 'Recognition and honors received for academic and professional achievements.',
    href: '/awards',
    icon: Trophy,
  },
];

export default function SectionOverview() {
  return (
    <section id="overview" className="py-24 sm:py-32 bg-[var(--background-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Explore My Portfolio
            </h2>
            <p className="mt-2 text-lg leading-8 text-[var(--text-secondary)]">
              Discover my work, experience, and achievements
            </p>
          </div>
        </ScrollReveal>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <ScrollReveal key={section.href} delay={index * 0.1} direction="up">
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Link href={section.href}>
                    <Card hover className="p-8 h-full">
                      <Icon className="h-8 w-8 mb-4 text-[var(--primary)]" />
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                        {section.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
                        {section.description}
                      </p>
                      <div className="mt-6 flex items-center text-sm font-semibold text-[var(--primary)]">
                        Learn more
                        <motion.svg
                          className="ml-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </motion.svg>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
