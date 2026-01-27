'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Contact</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Get in touch with me for opportunities, collaborations, or just to say hello
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-12 lg:grid-cols-2">
        <ScrollReveal delay={0.1}>
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Let's Connect
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="mt-8 space-y-4">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-tertiary)]">Email</p>
                    <a
                      href="mailto:omkarbhope0309@gmail.com"
                      className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      omkarbhope0309@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-tertiary)]">Phone</p>
                    <a
                      href="tel:+18582038205"
                      className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      +1 (858) 203-8205
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-tertiary)]">Location</p>
                    <p className="text-[var(--text-primary)]">San Diego, CA</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex gap-4">
              <motion.a
                href="https://linkedin.com/in/omkar-bhope"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </motion.a>
              <motion.a
                href="https://github.com/omkarbhope"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5" />
                GitHub
              </motion.a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Send a Message
            </h2>
            <AnimatePresence>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 rounded-md bg-[var(--success)]/10 border border-[var(--success)]/20 p-4"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[var(--success)]" />
                    <p className="text-sm font-medium text-[var(--success)]">
                      Thank you for your message! I'll get back to you soon.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-md bg-[var(--error)]/10 border border-[var(--error)]/20 p-3"
                    >
                      <p className="text-sm text-[var(--error)]">{error}</p>
                    </motion.div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (error) setError('');
                      }}
                      className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (error) setError('');
                      }}
                      className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (error) setError('');
                      }}
                      className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (error) setError('');
                      }}
                      className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
