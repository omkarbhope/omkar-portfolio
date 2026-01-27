'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Spline import - uncomment when you have a scene URL
// import Spline from '@splinetool/react-spline';

export type AvatarState = 'idle' | 'waiting' | 'talking';

interface Avatar3DProps {
  state: AvatarState;
  className?: string;
}

// Animated CSS-based AI Avatar (works without external dependencies)
function AnimatedAvatar({ state }: { state: AvatarState }) {
  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40">
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-30 blur-xl"
        animate={{
          scale: state === 'talking' ? [1, 1.2, 1] : state === 'waiting' ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: state === 'talking' ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: state === 'talking' ? 0.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main avatar body */}
      <motion.div
        className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 overflow-hidden shadow-2xl"
        animate={{
          y: state === 'idle' ? [0, -5, 0] : state === 'talking' ? [0, -3, 0, -2, 0] : 0,
          rotate: state === 'waiting' ? [0, -5, 5, 0] : 0,
          scale: state === 'talking' ? [1, 1.03, 0.98, 1.02, 1] : 1,
          borderColor: state === 'talking' ? ['rgb(55, 65, 81)', 'var(--accent)', 'rgb(55, 65, 81)'] : 'rgb(55, 65, 81)',
        }}
        transition={{
          duration: state === 'idle' ? 3 : state === 'waiting' ? 2 : 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner gradient */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />

        {/* Face container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-6 mb-2">
            {/* Left eye */}
            <motion.div
              className="relative"
              animate={{
                scaleY: state === 'talking' ? [1, 0.3, 1, 0.5, 1] : 1,
              }}
              transition={{ 
                duration: 0.8, 
                repeat: state === 'talking' ? Infinity : 0,
                repeatDelay: 0.5,
              }}
            >
              <motion.div 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-[0_0_15px_var(--primary)]"
                animate={{
                  backgroundColor: state === 'talking' 
                    ? ['var(--primary)', 'var(--accent)', 'var(--primary)']
                    : 'var(--primary)',
                }}
                transition={{ duration: 0.5, repeat: state === 'talking' ? Infinity : 0 }}
                style={{ backgroundColor: 'var(--primary)' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-white/30"
                animate={{ opacity: state === 'talking' ? [0.5, 0.8, 0.5] : [0.3, 0.6, 0.3] }}
                transition={{ duration: state === 'talking' ? 0.3 : 2, repeat: Infinity }}
              />
              {/* Pupil */}
              <motion.div
                className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white"
                animate={{
                  x: state === 'waiting' ? [0, 2, 0] : state === 'talking' ? [0, 1, -1, 0] : 0,
                  y: state === 'waiting' ? [0, 1, 0] : 0,
                }}
                transition={{ duration: state === 'talking' ? 0.3 : 1.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Right eye */}
            <motion.div
              className="relative"
              animate={{
                scaleY: state === 'talking' ? [1, 0.3, 1, 0.5, 1] : 1,
              }}
              transition={{ 
                duration: 0.8, 
                repeat: state === 'talking' ? Infinity : 0, 
                delay: 0.1,
                repeatDelay: 0.5,
              }}
            >
              <motion.div 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-[0_0_15px_var(--primary)]"
                animate={{
                  backgroundColor: state === 'talking' 
                    ? ['var(--primary)', 'var(--accent)', 'var(--primary)']
                    : 'var(--primary)',
                }}
                transition={{ duration: 0.5, repeat: state === 'talking' ? Infinity : 0, delay: 0.1 }}
                style={{ backgroundColor: 'var(--primary)' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-white/30"
                animate={{ opacity: state === 'talking' ? [0.5, 0.8, 0.5] : [0.3, 0.6, 0.3] }}
                transition={{ duration: state === 'talking' ? 0.3 : 2, repeat: Infinity, delay: 0.5 }}
              />
              {/* Pupil */}
              <motion.div
                className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white"
                animate={{
                  x: state === 'waiting' ? [0, 2, 0] : state === 'talking' ? [0, -1, 1, 0] : 0,
                  y: state === 'waiting' ? [0, 1, 0] : 0,
                }}
                transition={{ duration: state === 'talking' ? 0.3 : 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Mouth */}
          <div className="relative mt-2">
            {state === 'idle' ? (
              // Smiling mouth
              <div className="w-10 h-5 sm:w-12 sm:h-6 border-b-4 border-[var(--primary)] rounded-b-full shadow-[0_0_10px_var(--primary)]" />
            ) : state === 'waiting' ? (
              // Neutral/thinking mouth
              <motion.div
                className="w-8 h-2 sm:w-10 sm:h-2 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]"
                animate={{ width: ['2.5rem', '2rem', '2.5rem'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ) : (
              // Talking mouth - animated open/close
              <motion.div
                className="bg-[var(--accent)] rounded-full shadow-[0_0_15px_var(--accent)]"
                animate={{ 
                  height: ['0.5rem', '1.25rem', '0.25rem', '1rem', '0.5rem'],
                  width: ['2.5rem', '2rem', '2.75rem', '1.75rem', '2.5rem'],
                }}
                transition={{ 
                  duration: 0.4, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                }}
                style={{ minHeight: '0.25rem', minWidth: '1.5rem' }}
              />
            )}
          </div>
        </div>

        {/* Antenna */}
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          animate={{
            rotate: state === 'talking' ? [-10, 10, -10] : state === 'waiting' ? [-5, 5, -5] : 0,
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="w-1 h-4 bg-gray-600 rounded-full" />
          <motion.div
            className="w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] -mt-1 -ml-1"
            animate={{
              opacity: state === 'talking' ? [1, 0.5, 1] : [0.7, 1, 0.7],
              scale: state === 'talking' ? [1, 1.2, 1] : [1, 1.1, 1],
            }}
            transition={{ duration: state === 'talking' ? 0.3 : 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Side decorations */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1">
          <motion.div
            className="w-2 h-8 bg-gray-700 rounded-full"
            animate={{ scaleY: state === 'talking' ? [1, 0.8, 1] : 1 }}
            transition={{ duration: 0.3, repeat: state === 'talking' ? Infinity : 0 }}
          />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
          <motion.div
            className="w-2 h-8 bg-gray-700 rounded-full"
            animate={{ scaleY: state === 'talking' ? [1, 0.8, 1] : 1 }}
            transition={{ duration: 0.3, repeat: state === 'talking' ? Infinity : 0, delay: 0.15 }}
          />
        </div>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: state === 'idle' ? 'rgba(0, 255, 136, 0.2)' : state === 'waiting' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(168, 85, 247, 0.2)',
          borderColor: state === 'idle' ? 'var(--neon-green)' : state === 'waiting' ? 'var(--primary)' : 'var(--accent)',
          color: state === 'idle' ? 'var(--neon-green)' : state === 'waiting' ? 'var(--primary)' : 'var(--accent)',
        }}
      >
        {state === 'idle' ? 'Ready' : state === 'waiting' ? 'Listening...' : 'Speaking...'}
      </motion.div>
    </div>
  );
}

export default function Avatar3D({ state, className = '' }: Avatar3DProps) {
  const [useSpline, setUseSpline] = useState(false);
  
  // Uncomment below and add your Spline scene URL to use 3D Spline avatar
  // const SPLINE_SCENE_URL = 'https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode';

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      animate={{
        x: state === 'waiting' ? -20 : 0,
        scale: state === 'talking' ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <AnimatePresence mode="wait">
        {useSpline ? (
          // Spline 3D Avatar (enable when you have a scene URL)
          <motion.div
            key="spline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-40 h-40"
          >
            {/* <Spline scene={SPLINE_SCENE_URL} /> */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Spline 3D
            </div>
          </motion.div>
        ) : (
          // CSS Animated Avatar (default)
          <motion.div
            key="css"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <AnimatedAvatar state={state} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
