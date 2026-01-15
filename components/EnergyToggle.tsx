import React from 'react';
import { motion } from 'motion/react';
import { EnergyMode } from '../types';

interface EnergyToggleProps {
  mode: EnergyMode;
  onToggle: () => void;
}

export const EnergyToggle: React.FC<EnergyToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#6A6A6A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {mode === 'high' ? 'High Energy' : 'Low Energy'}
      </span>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`relative w-16 h-8 rounded-full transition-colors ${
          mode === 'high' ? 'bg-[#A3C9A8]' : 'bg-[#EDC4B3]'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
          style={{
            transform: mode === 'high' ? 'translateX(0)' : 'translateX(32px)'
          }}
        >
          <span className="text-xs">
            {mode === 'high' ? '🌸' : '🌙'}
          </span>
        </motion.div>
      </motion.button>
    </div>
  );
};
