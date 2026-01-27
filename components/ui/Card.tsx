'use client';

import { HTMLAttributes, forwardRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  tilt?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, tilt = false, glow = false, gradient = false, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // 3D tilt effect values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['3deg', '-3deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-3deg', '3deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setIsHovered(false);
    };

    // Prepare style object - only include tilt-related styles when tilt is enabled
    const motionStyle = tilt ? {
      perspective: '1000px',
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d' as const,
    } : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 overflow-hidden',
          hover && 'transition-shadow',
          className
        )}
        style={motionStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={hover ? { 
          y: -4,
          boxShadow: glow ? 'var(--shadow-neon)' : 'var(--shadow-lg)',
          borderColor: 'var(--primary)',
        } : undefined}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient background effect */}
        {gradient && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Animated border on hover */}
        {glow && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent), var(--neon-green), var(--primary))',
              backgroundSize: '300% 300%',
              padding: '1px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              WebkitMaskComposite: 'xor',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
