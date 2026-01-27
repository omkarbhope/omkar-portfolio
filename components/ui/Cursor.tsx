'use client';

import { useEffect, useState, useRef } from 'react';

interface CursorProps {
  enabled?: boolean;
}

export default function Cursor({ enabled = true }: CursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Check if device supports hover (not touch-only)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Direct DOM manipulation for instant response
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (bracketsRef.current) {
        bracketsRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track hover states for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      
      if (interactiveElement) {
        setIsHovering(true);
        const cursorData = interactiveElement.getAttribute('data-cursor');
        if (cursorData) {
          setCursorText(cursorData);
        }
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleElementHover);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Add cursor-none class to body
    document.body.classList.add('cursor-none');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleElementHover);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-none');
    };
  }, [enabled, isVisible]);

  if (!enabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      >
        <div
          className="rounded-full bg-white transition-all duration-100"
          style={{
            width: isHovering ? 8 : 6,
            height: isHovering ? 8 : 6,
            transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      >
        <div
          className="rounded-full border-2 transition-all duration-150"
          style={{
            width: isHovering ? 48 : 28,
            height: isHovering ? 48 : 28,
            borderColor: isHovering ? 'var(--primary)' : 'rgba(0, 217, 255, 0.4)',
            transform: `translate(-50%, -50%) scale(${isClicking ? 0.9 : 1})`,
          }}
        />
        
        {/* Cursor text label */}
        {cursorText && (
          <span
            className="absolute whitespace-nowrap text-xs font-medium text-[var(--primary)] transition-opacity duration-150"
            style={{
              left: '50%',
              top: '100%',
              transform: 'translate(-50%, 8px)',
            }}
          >
            {cursorText}
          </span>
        )}
      </div>

      {/* Tech-themed decorative brackets - only on hover */}
      {isHovering && (
        <div
          ref={bracketsRef}
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            opacity: isVisible ? 0.5 : 0,
            transition: 'opacity 0.15s',
          }}
        >
          <div
            style={{
              transform: 'rotate(45deg)',
            }}
          >
            {[0, 90, 180, 270].map((rotation) => (
              <div
                key={rotation}
                className="absolute w-2 h-2 border-t-2 border-l-2 border-[var(--primary)]"
                style={{
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) translate(18px, 18px)`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
