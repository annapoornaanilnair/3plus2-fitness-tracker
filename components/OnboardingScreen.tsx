import React from 'react';
import { motion } from 'motion/react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#FDFBF7] via-[#F5F1EB] to-[#E8E4DE]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Animated Illustration */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <img src="/logo.png" alt="3+2 Fitness" className="w-32 h-32 object-contain" />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-3 -right-3 text-3xl"
            >
              ✨
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl mb-4"
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
        >
          3+2
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl mb-2 text-[#4A4A4A]"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Your Cozy Fitness Companion
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base mb-10 text-[#6A6A6A]"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          3 mandatory strength days + 2 bonus days.<br />
          Flexible. Guilt-free. Just for you.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full py-5 px-8 bg-[#A3C9A8] text-white rounded-full text-lg shadow-lg hover:bg-[#82A885] transition-colors"
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
        >
          Let's Get Moving ✨
        </motion.button>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-sm text-[#8A8A8A]"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          No judgments. No pressure. Just progress.
        </motion.p>
      </motion.div>
    </div>
  );
};
