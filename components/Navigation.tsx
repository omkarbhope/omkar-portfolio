'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/education', label: 'Education' },
  { href: '/skills', label: 'Skills' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/awards', label: 'Awards' },
  { href: '/contact', label: 'Contact' },
  { href: '/chat', label: 'Chat' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      // Scroll spy for homepage sections
      if (pathname === '/') {
        const sections = ['hero', 'overview'];
        const scrollPosition = window.scrollY + 100;
        
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              setActiveSection(sections[i]);
              break;
            }
          }
        }
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b border-[var(--border)]"
      style={{
        backgroundColor: scrolled ? 'var(--background)' : 'var(--background)',
        backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
        opacity: scrolled ? 0.95 : 1,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-[var(--text-primary)] transition-transform hover:scale-105"
          >
            Omkar Bhope
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (pathname === '/' && item.href === '/' && activeSection === 'hero');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="ml-2 p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)] transition-colors"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-[var(--primary)] text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
