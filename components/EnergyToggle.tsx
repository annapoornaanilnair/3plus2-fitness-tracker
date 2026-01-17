import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EnergyMode } from '../types';

interface EnergyToggleProps {
  mode: EnergyMode;
  onToggle: () => void;
}

export const EnergyToggle: React.FC<EnergyToggleProps> = ({ mode, onToggle }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleToggle = () => {
    onToggle();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 relative">
      {/* Cute notification toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -top-16 right-0 bg-gradient-to-r from-white/80 via-white/85 to-white/80 backdrop-blur-md border border-sage/20 rounded-full px-4 py-2 shadow-soft-lg whitespace-nowrap"
          >
            <span className="text-sm font-nunito font-medium text-charcoal">
              {mode === 'high' ? '🌸 High Energy' : '🌙 Low Energy'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleToggle}
        className={`relative w-20 h-10 rounded-full transition-all duration-300 shadow-md ${mode === 'high'
            ? 'bg-gradient-to-r from-[#A3C9A8] to-[#8BB58F]'
            : 'bg-gradient-to-r from-[#EDC4B3] to-[#D4A59A]'
          }`}
        style={{
          boxShadow: mode === 'high'
            ? '0 4px 12px rgba(163, 201, 168, 0.4)'
            : '0 4px 12px rgba(237, 196, 179, 0.4)'
        }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: mode === 'high'
              ? 'radial-gradient(circle, rgba(163, 201, 168, 0.6) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(237, 196, 179, 0.6) 0%, transparent 70%)'
          }}
        />

        {/* Toggle knob */}
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
            mass: 0.8
          }}
          className="absolute top-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
          style={{
            left: mode === 'high' ? '4px' : 'calc(100% - 36px)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                duration: 0.3,
                type: 'spring',
                stiffness: 400,
                damping: 20
              }}
              className="text-lg"
            >
              {mode === 'high' ? '🌸' : '🌙'}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Particle effects on toggle */}
        <AnimatePresence>
          {mode === 'high' && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(163, 201, 168, 0.4) 0%, transparent 60%)'
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
