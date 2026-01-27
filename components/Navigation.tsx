'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  Moon, Sun, Menu, X, Home, FileText, Rocket, Briefcase, 
  GraduationCap, Zap, Award, Trophy, Mail, MessageSquare 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home, color: 'from-blue-400 to-blue-600' },
  { href: '/resume', label: 'Resume', icon: FileText, color: 'from-orange-400 to-red-500' },
  { href: '/projects', label: 'Projects', icon: Rocket, color: 'from-purple-400 to-purple-600' },
  { href: '/experience', label: 'Experience', icon: Briefcase, color: 'from-amber-400 to-orange-500' },
  { href: '/education', label: 'Education', icon: GraduationCap, color: 'from-green-400 to-emerald-600' },
  { href: '/skills', label: 'Skills', icon: Zap, color: 'from-yellow-400 to-amber-500' },
  { href: '/certifications', label: 'Certifications', icon: Award, color: 'from-pink-400 to-rose-500' },
  { href: '/awards', label: 'Awards', icon: Trophy, color: 'from-cyan-400 to-teal-500' },
  { href: '/contact', label: 'Contact', icon: Mail, color: 'from-indigo-400 to-blue-500' },
  { href: '/chat', label: 'Chat', icon: MessageSquare, color: 'from-violet-400 to-purple-500' },
];

// macOS-style Dock item with app icon appearance
function DockItem({ 
  item, 
  isActive, 
  hoveredIndex, 
  index, 
  setHoveredIndex,
}: { 
  item: typeof navItems[0];
  isActive: boolean;
  hoveredIndex: number | null;
  index: number;
  setHoveredIndex: (index: number | null) => void;
}) {
  const Icon = item.icon;
  
  // Calculate scale based on distance from hovered item (macOS magnification)
  let scale = 1;
  let translateY = 0;
  if (hoveredIndex !== null) {
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) {
      scale = 1.6;
      translateY = -12;
    } else if (distance === 1) {
      scale = 1.3;
      translateY = -6;
    } else if (distance === 2) {
      scale = 1.1;
      translateY = -2;
    }
  }

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative flex flex-col items-center"
    >
      <motion.div
        className="relative"
        animate={{ 
          scale,
          y: translateY,
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
          mass: 0.8,
        }}
        style={{ originY: 1 }}
      >
        {/* App Icon - macOS style rounded square */}
        <div 
          className={`
            relative w-12 h-12 rounded-[12px] 
            bg-gradient-to-br ${item.color}
            shadow-lg shadow-black/20
            flex items-center justify-center
            overflow-hidden
          `}
        >
          {/* Gloss effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[12px]" />
          
          <Icon className="w-6 h-6 text-white relative z-10 drop-shadow-md" strokeWidth={2.5} />
        </div>

        {/* Tooltip - appears above on hover */}
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-gray-800/95 text-white text-xs font-medium whitespace-nowrap shadow-lg"
            >
              {item.label}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Active indicator dot - below icon */}
      <motion.div
        className="mt-1 w-1 h-1 rounded-full bg-[var(--text-tertiary)]"
        animate={{ 
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar - Minimal */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/5 dark:bg-black/5 backdrop-blur-sm' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative text-xl font-bold">
              <motion.span
                className="relative z-10 gradient-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                Omkar Bhope
              </motion.span>
            </Link>

            {/* Desktop - Theme Toggle */}
            <div className="hidden md:flex items-center gap-4">
              {mounted && (
                <motion.button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-full bg-gray-800 dark:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {resolvedTheme === 'dark' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                      >
                        <Sun className="h-5 w-5 text-yellow-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                      >
                        <Moon className="h-5 w-5 text-white" />
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
                  className="p-2 rounded-md text-[var(--text-secondary)]"
                  whileTap={{ scale: 0.9 }}
                >
                  {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.button>
              )}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[var(--text-secondary)]"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Dock - macOS Style */}
      <motion.div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 hidden md:block"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Dock Container - True macOS glassmorphism */}
        <div className="macos-dock flex items-end gap-3 px-3 pt-2 pb-2 rounded-2xl">
          {navItems.map((item, index) => (
            <DockItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              hoveredIndex={hoveredIndex}
              index={index}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
          
          {/* Divider */}
          <div className="w-px h-10 bg-white/20 mx-1 self-center" />
          
          {/* Theme toggle */}
          {mounted && (
            <div className="relative flex flex-col items-center">
              <motion.button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                onMouseEnter={() => setHoveredIndex(navItems.length)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative w-12 h-12 rounded-[12px] shadow-lg shadow-black/20 flex items-center justify-center overflow-hidden"
                style={{
                  background: resolvedTheme === 'dark' 
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                animate={{ 
                  scale: hoveredIndex === navItems.length ? 1.6 : 1,
                  y: hoveredIndex === navItems.length ? -12 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Gloss effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[12px]" />
                
                <AnimatePresence mode="wait">
                  {resolvedTheme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-6 h-6 text-yellow-400 relative z-10 drop-shadow-md" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-6 h-6 text-white relative z-10 drop-shadow-md" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredIndex === navItems.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-gray-800/95 text-white text-xs font-medium whitespace-nowrap shadow-lg"
                    >
                      {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800/95" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <div className="mt-1 w-1 h-1 rounded-full opacity-0" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Navigation - Full Screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-800/50 p-6 pt-20"
            >
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white`
                            : 'text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
