'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'omkarbhope0309@gmail.com',
      href: 'mailto:omkarbhope0309@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (858) 203-8205',
      href: 'tel:+18582038205',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Jose, CA',
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/omkar-bhope',
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/omkarbhope',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <ScrollReveal>
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--primary)] mb-4"
          >
            <MessageSquare className="h-4 w-4" />
            Get in Touch
          </motion.div>
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="text-[var(--text-primary)]">Let's </span>
            <span className="gradient-text">Connect</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Info */}
        <ScrollReveal delay={0.1} direction="left">
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ 
                    borderColor: 'var(--primary)',
                    boxShadow: 'var(--shadow-neon)',
                  }}
                >
                  {/* Background glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-3"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <item.icon className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-tertiary)]">{item.label}</p>
                      {item.href ? (
                        <motion.a
                          href={item.href}
                          className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
                          whileHover={{ x: 4 }}
                          data-cursor={item.label}
                        >
                          {item.value}
                        </motion.a>
                      ) : (
                        <p className="text-lg font-medium text-[var(--text-primary)]">{item.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: 'var(--shadow-neon)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    data-cursor={social.label}
                  >
                    <social.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Decorative Element */}
            <motion.div
              className="relative rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background)] to-[var(--accent)]/10 p-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--primary)]/20 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
                <Sparkles className="h-8 w-8 text-[var(--primary)] mb-3" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Available for Opportunities
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Contact Form */}
        <ScrollReveal delay={0.2} direction="right">
          <motion.div
            className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-6"
            whileHover={{ borderColor: 'var(--primary)' }}
            transition={{ duration: 0.3 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--primary)]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-2">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                  Send a Message
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-xl bg-gradient-to-r from-[var(--neon-green)]/10 to-[var(--neon-green)]/5 border border-[var(--neon-green)]/30 p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                      <CheckCircle className="h-16 w-16 text-[var(--neon-green)] mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-[var(--text-secondary)]">
                      Thank you for reaching out. I'll get back to you soon!
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-4"
                      >
                        <p className="text-sm text-[var(--error)]">{error}</p>
                      </motion.div>
                    )}

                    {/* Form Fields */}
                    {[
                      { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                      { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                      { id: 'subject', label: 'Subject', type: 'text', placeholder: 'What is this about?' },
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <label 
                          htmlFor={field.id} 
                          className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                        >
                          {field.label}
                        </label>
                        <motion.div
                          animate={{
                            boxShadow: focusedField === field.id ? 'var(--shadow-neon)' : 'none',
                          }}
                          className="rounded-lg"
                        >
                          <input
                            type={field.type}
                            id={field.id}
                            required
                            placeholder={field.placeholder}
                            value={formData[field.id as keyof typeof formData]}
                            onChange={(e) => {
                              setFormData({ ...formData, [field.id]: e.target.value });
                              if (error) setError('');
                            }}
                            onFocus={() => setFocusedField(field.id)}
                            onBlur={() => setFocusedField(null)}
                            className="block w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                          />
                        </motion.div>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label 
                        htmlFor="message" 
                        className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                      >
                        Message
                      </label>
                      <motion.div
                        animate={{
                          boxShadow: focusedField === 'message' ? 'var(--shadow-neon)' : 'none',
                        }}
                        className="rounded-lg"
                      >
                        <textarea
                          id="message"
                          rows={5}
                          required
                          placeholder="Tell me about your project or idea..."
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (error) setError('');
                          }}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className="block w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        type="submit"
                        loading={submitting}
                        className="w-full"
                        data-cursor="Send"
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
