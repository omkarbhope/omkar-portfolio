'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Award } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface AwardsListProps {
  awards: Award[];
}

const categoryVariants: Record<Award['category'], 'primary' | 'success' | 'default'> = {
  Academic: 'primary',
  Professional: 'success',
  Other: 'default',
};

export default function AwardsList({ awards }: AwardsListProps) {
  return (
    <div className="space-y-6">
      {awards.map((award, index) => (
        <ScrollReveal key={award._id} delay={index * 0.1} direction="up">
          <Card hover className="p-6">
            <div className="flex items-start gap-6">
              {award.imageUrl ? (
                <motion.div
                  className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={award.imageUrl}
                    alt={award.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="flex-shrink-0">
                  <div className="rounded-full bg-[var(--primary)]/10 p-3">
                    <Trophy className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      {award.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {award.issuer}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                      {formatDate(award.date)}
                    </p>
                  </div>
                  <Badge variant={categoryVariants[award.category]}>
                    {award.category}
                  </Badge>
                </div>
                <div 
                  className="mt-3 text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {award.description}
                </div>
                {award.significance && (
                  <div 
                    className="mt-2 text-sm italic text-[var(--text-tertiary)] whitespace-pre-wrap leading-relaxed"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {award.significance}
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
