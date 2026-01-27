'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react';

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  // Only use isDark after mounting to avoid hydration mismatch
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <motion.nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'glass-card border-[var(--glass-border)]' 
          : 'border-transparent bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with animated gradient */}
          <Link
            href="/"
            className="group relative text-xl font-bold text-[var(--text-primary)] transition-all hover:scale-105"
            data-cursor="Home"
          >
            <motion.span
              className="relative z-10 gradient-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              Omkar Bhope
            </motion.span>
            <motion.div
              className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 to-[var(--neon-green)]/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100"
              layoutId="logo-glow"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (pathname === '/' && item.href === '/' && activeSection === 'hero');
              const isHovered = hoveredItem === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium transition-colors"
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  data-cursor={item.label}
                >
                  <motion.span
                    className={`relative z-10 ${
                      isActive 
                        ? 'text-[var(--primary)]' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    animate={{
                      color: isActive ? 'var(--primary)' : isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Animated underline with morphing effect */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] nav-active-indicator"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover glow effect */}
                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-md bg-[var(--primary)]/5"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
            
            {/* Theme Toggle with animation */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="relative ml-2 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)] transition-colors overflow-hidden"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                data-cursor={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                <AnimatePresence mode="wait">
                  {resolvedTheme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ y: 20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -20, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ y: 20, opacity: 0, rotate: 90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -20, opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <motion.button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Toggle theme"
                whileTap={{ scale: 0.9 }}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>
            )}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <motion.div 
                className="space-y-1 px-2 pb-4 pt-2"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.05 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.02, staggerDirection: -1 }
                  }
                }}
              >
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -20 }
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-3 text-base font-medium rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {isActive && <Sparkles className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
