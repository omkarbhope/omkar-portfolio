'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar, Hash, ShieldCheck } from 'lucide-react';
import type { LicenseCertification } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import ScrollReveal from './animations/ScrollReveal';

interface CertificationsListProps {
  certifications: LicenseCertification[];
}

export default function CertificationsList({ certifications }: CertificationsListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert, index) => {
        const isHovered = hoveredId === cert._id;

        return (
          <ScrollReveal key={cert._id} delay={index * 0.1} direction="up">
            <motion.div
              className="group relative h-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
              onMouseEnter={() => setHoveredId(cert._id || null)}
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
                className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10 p-6">
                {/* Badge Image or Icon */}
                <div className="mb-4 flex justify-center">
                  {cert.badgeUrl ? (
                    <motion.div
                      className="relative h-24 w-24"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Image
                        src={cert.badgeUrl}
                        alt={cert.name}
                        fill
                        className="rounded-lg object-contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Award className="h-12 w-12 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <motion.h3 
                  className="text-lg font-semibold text-center text-[var(--text-primary)]"
                  animate={{ color: isHovered ? 'var(--primary)' : 'var(--text-primary)' }}
                >
                  {cert.name}
                </motion.h3>
                
                <p className="mt-1 text-sm text-center text-[var(--text-secondary)]">
                  {cert.issuer}
                </p>

                {/* Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                  </div>
                  
                  {cert.expirationDate && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Expires: {formatDate(cert.expirationDate)}</span>
                    </div>
                  )}
                  
                  {cert.credentialId && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono">
                      <Hash className="h-3.5 w-3.5" />
                      <span className="truncate">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                {/* Verification Link */}
                {cert.verificationUrl && (
                  <motion.a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-cursor="Verify"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify Credential
                    <ExternalLink className="h-3.5 w-3.5" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
