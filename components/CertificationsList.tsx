'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { LicenseCertification } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import ScrollReveal from './animations/ScrollReveal';
import Card from './ui/Card';

interface CertificationsListProps {
  certifications: LicenseCertification[];
}

export default function CertificationsList({ certifications }: CertificationsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert, index) => (
        <ScrollReveal key={cert._id} delay={index * 0.1} direction="up">
          <Card hover className="p-6">
            {cert.badgeUrl && (
              <motion.div
                className="mb-4 flex justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={cert.badgeUrl}
                  alt={cert.name}
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </motion.div>
            )}
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {cert.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {cert.issuer}
            </p>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              Issued: {formatDate(cert.issueDate)}
            </p>
            {cert.expirationDate && (
              <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                Expires: {formatDate(cert.expirationDate)}
              </p>
            )}
            {cert.credentialId && (
              <p className="mt-2 text-xs font-mono text-[var(--text-secondary)]">
                ID: {cert.credentialId}
              </p>
            )}
            {cert.verificationUrl && (
              <motion.a
                href={cert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                whileHover={{ x: 2 }}
              >
                Verify Credential
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            )}
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
}
