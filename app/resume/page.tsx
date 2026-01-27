'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ResumePage() {
  const [loading, setLoading] = useState(true);

  // Get resume URL and convert Google Drive /view URLs to /preview for embedding
  const rawUrl = process.env.NEXT_PUBLIC_RESUME_URL || '/resume.pdf';
  const resumeUrl = rawUrl.includes('drive.google.com/file/d/') && rawUrl.includes('/view')
    ? rawUrl.replace('/view', '/preview')
    : rawUrl;
  
  // Direct download URL (for download button)
  const downloadUrl = rawUrl.includes('drive.google.com/file/d/')
    ? rawUrl.replace('/view?usp=sharing', '') + '?export=download'
    : rawUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Resume</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Download or view my resume
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Omkar Bhope - Resume
            </h2>
            <div className="flex gap-2">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Button variant="primary" size="sm">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <div className="h-[calc(100vh-200px)] overflow-auto p-6">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full items-center justify-center"
              >
                <div className="text-[var(--text-tertiary)]">Loading resume...</div>
              </motion.div>
            )}
            <iframe
              src={resumeUrl}
              className="h-full w-full rounded-md"
              onLoad={() => setLoading(false)}
              style={{ display: loading ? 'none' : 'block' }}
              title="Resume PDF"
            />
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
