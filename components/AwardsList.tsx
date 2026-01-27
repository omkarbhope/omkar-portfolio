'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Star, Sparkles } from 'lucide-react';
import type { Award } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import ScrollReveal from './animations/ScrollReveal';
import Badge from './ui/Badge';

interface AwardsListProps {
  awards: Award[];
}

const categoryStyles: Record<Award['category'], { gradient: string; icon: typeof Trophy }> = {
  Academic: { 
    gradient: 'from-blue-500 to-cyan-500', 
    icon: Star,
  },
  Professional: { 
    gradient: 'from-purple-500 to-violet-500', 
    icon: Trophy,
  },
  Other: { 
    gradient: 'from-orange-500 to-amber-500', 
    icon: Sparkles,
  },
};

export default function AwardsList({ awards }: AwardsListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {awards.map((award, index) => {
        const isHovered = hoveredId === award._id;
        const style = categoryStyles[award.category] || categoryStyles.Other;
        const Icon = style.icon;

        return (
          <ScrollReveal key={award._id} delay={index * 0.1} direction="up">
            <motion.div
              className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
              onMouseEnter={() => setHoveredId(award._id || null)}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                borderColor: isHovered ? 'var(--primary)' : 'var(--border)',
                boxShadow: isHovered ? 'var(--shadow-neon)' : 'var(--shadow-sm)',
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Decorative background element */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${style.gradient} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />

              <div className="relative z-10 p-6">
                <div className="flex items-start gap-6">
                  {/* Image or Icon */}
                  {award.imageUrl ? (
                    <motion.div
                      className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Image
                        src={award.imageUrl}
                        alt={award.title}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay glow */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 transition-opacity group-hover:opacity-20`}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className={`rounded-xl bg-gradient-to-r ${style.gradient} p-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <motion.h3 
                          className="text-xl font-semibold text-[var(--text-primary)]"
                          animate={{ color: isHovered ? 'var(--primary)' : 'var(--text-primary)' }}
                        >
                          {award.title}
                        </motion.h3>
                        <p className="mt-1 text-sm font-medium gradient-text">
                          {award.issuer}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(award.date)}
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        <Badge 
                          variant={award.category === 'Academic' ? 'primary' : award.category === 'Professional' ? 'accent' : 'default'}
                          animate
                        >
                          {award.category}
                        </Badge>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {award.description}
                    </p>

                    {/* Significance */}
                    {award.significance && (
                      <motion.div
                        className="mt-3 rounded-lg bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 px-4 py-2 text-sm italic text-[var(--text-tertiary)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="text-[var(--primary)] font-medium">✨</span>{' '}
                        {award.significance}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
