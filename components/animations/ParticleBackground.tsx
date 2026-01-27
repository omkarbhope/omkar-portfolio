'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseInteraction?: boolean;
  className?: string;
}

export default function ParticleBackground({
  particleCount = 80,
  connectionDistance = 150,
  mouseInteraction = true,
  className = '',
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = {
    primary: '#00D9FF',
    accent: '#A855F7',
    neonGreen: '#00FF88',
  };

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const colorOptions = [colors.primary, colors.accent, colors.neonGreen];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
    return particles;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount]);

  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Mouse interaction
      if (mouseInteraction && mouse.x !== -1000) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx -= (dx / dist) * force * 0.02;
          particle.vy -= (dy / dist) * force * 0.02;
        }
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Keep within bounds
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Ensure minimum velocity
      if (Math.abs(particle.vx) < 0.1) particle.vx = (Math.random() - 0.5) * 0.5;
      if (Math.abs(particle.vy) < 0.1) particle.vy = (Math.random() - 0.5) * 0.5;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Draw connection to mouse
      if (mouseInteraction && mouse.x !== -1000) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance * 1.5) {
          const alpha = (1 - dist / (connectionDistance * 1.5)) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = colors.primary;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    animationRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  }, [connectionDistance, mouseInteraction]);

  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    if (mouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Start animation
    animate(ctx, canvas.width, canvas.height);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mouseInteraction) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, initParticles, animate, mouseInteraction]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ 
        opacity: resolvedTheme === 'dark' ? 0.6 : 0.3,
        pointerEvents: mouseInteraction ? 'auto' : 'none',
      }}
    />
  );
}
