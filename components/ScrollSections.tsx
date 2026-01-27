'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, Briefcase, GraduationCap, Zap, Award, Trophy, 
  ArrowRight, Code, Database, Brain, Server, Globe
} from 'lucide-react';
import ScrollReveal from './animations/ScrollReveal';

const sections = [
  {
    id: 'projects',
    title: 'Projects',
    subtitle: 'Featured Work',
    description: 'AI/ML solutions, full-stack applications, and infrastructure automation projects.',
    href: '/projects',
    icon: Rocket,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'experience',
    title: 'Experience',
    subtitle: 'Professional Journey',
    description: 'From startups to enterprise companies, building scalable systems and leading engineering initiatives.',
    href: '/experience',
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'skills',
    title: 'Skills',
    subtitle: 'Technical Expertise',
    description: 'Full-stack development, AI/ML, cloud infrastructure, and DevOps expertise across modern technology stacks.',
    href: '/skills',
    icon: Zap,
    gradient: 'from-green-500 to-emerald-500',
    techIcons: [Code, Database, Brain, Server, Globe],
  },
  {
    id: 'education',
    title: 'Education',
    subtitle: 'Academic Foundation',
    description: 'Computer Science education from UC San Diego and PICT, with focus on AI/ML and distributed systems.',
    href: '/education',
    icon: GraduationCap,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 'certifications',
    title: 'Certifications',
    subtitle: 'Validated Skills',
    description: 'Industry certifications validating expertise in cloud platforms, AI/ML, and software development.',
    href: '/certifications',
    icon: Award,
    gradient: 'from-rose-500 to-red-500',
  },
  {
    id: 'awards',
    title: 'Awards',
    subtitle: 'Recognition',
    description: 'Academic and professional recognition for outstanding achievements and contributions.',
    href: '/awards',
    icon: Trophy,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

export default function ScrollSections() {
  return (
    <div className="relative bg-[#0A0A0A]">
      {/* Section Header */}
      <div className="py-24 text-center">
        <ScrollReveal>
          <motion.p 
            className="text-[var(--primary)] font-medium mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            EXPLORE
          </motion.p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Discover My <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Scroll through my work, experience, and achievements
          </p>
        </ScrollReveal>
      </div>

      {/* Sections */}
      <div className="space-y-32 pb-32">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isEven = index % 2 === 0;
          
          return (
            <ScrollReveal key={section.id} delay={0.1}>
              <section className="relative px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <motion.div 
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Content Side */}
                    <div className="flex-1 text-center lg:text-left">
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${section.gradient} bg-opacity-10 border border-white/10 mb-6`}>
                          <Icon className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium text-white">{section.subtitle}</span>
                        </div>
                        
                        <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                          {section.title}
                        </h3>
                        
                        <p className="text-lg text-gray-400 mb-8 max-w-xl">
                          {section.description}
                        </p>

                        {/* Tech Icons for Skills */}
                        {section.techIcons && (
                          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                            {section.techIcons.map((TechIcon, i) => (
                              <motion.div
                                key={i}
                                className="p-3 rounded-xl bg-gray-800/50 border border-gray-700"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                whileHover={{ scale: 1.1, borderColor: 'var(--primary)' }}
                              >
                                <TechIcon className="h-6 w-6 text-[var(--primary)]" />
                              </motion.div>
                            ))}
                          </div>
                        )}

                        <Link href={section.href}>
                          <motion.button
                            className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${section.gradient} text-white font-medium transition-all`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Explore {section.title}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </motion.button>
                        </Link>
                      </motion.div>
                    </div>

                    {/* Visual Side */}
                    <motion.div 
                      className="flex-1 w-full max-w-lg"
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="relative">
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-20 blur-3xl rounded-3xl`} />
                        
                        {/* Card */}
                        <motion.div
                          className="relative rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 overflow-hidden"
                          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
                        >
                          {/* Background Pattern */}
                          <div 
                            className="absolute inset-0 opacity-5"
                            style={{
                              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                              backgroundSize: '20px 20px',
                            }}
                          />
                          
                          {/* Icon */}
                          <div className="relative z-10">
                            <motion.div
                              className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${section.gradient} mb-6`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Icon className="h-12 w-12 text-white" />
                            </motion.div>
                            
                            <div className="space-y-4">
                              {[1, 2, 3].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="h-3 bg-gray-800 rounded-full overflow-hidden"
                                  initial={{ width: '0%' }}
                                  whileInView={{ width: `${100 - i * 20}%` }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                                >
                                  <motion.div
                                    className={`h-full bg-gradient-to-r ${section.gradient}`}
                                    initial={{ width: '0%' }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* Floating Elements */}
                            <div className="absolute top-4 right-4 flex gap-2">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.gradient}`}
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </section>
            </ScrollReveal>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="py-32 px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Connect</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Whether you have a project in mind, want to discuss opportunities, or just want to say hello — I&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch
                </motion.button>
              </Link>
              <Link href="/resume">
                <motion.button
                  className="px-8 py-4 rounded-xl border border-gray-700 text-white font-medium text-lg hover:border-[var(--primary)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Resume
                </motion.button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
