import React from 'react';
import { motion } from 'motion/react';

const glow =
  "filter blur-[1.2px] drop-shadow-[0_0_20px_rgba(255,200,220,0.15)]";

export const FloatingEmojiBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      {/* ===== TOP (SOFT & ELEGANT) ===== */}

      <motion.div
        animate={{
          y: [0, -6, 0],
          x: [0, 3, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-12 left-10 text-4xl opacity-12 ${glow}`}
      >
        🌸
      </motion.div>

      <motion.div
        animate={{
          y: [0, 6, 0],
          x: [0, -3, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className={`absolute top-20 right-12 text-5xl opacity-10 ${glow}`}
      >
        🫧
      </motion.div>

      <motion.div
        animate={{
          y: [0, -5, 0],
          x: [0, 2, 0],
          scale: [1, 1.015, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className={`absolute top-32 left-1/2 text-4xl opacity-8 ${glow}`}
      >
        🤍
      </motion.div>

      {/* ===== CENTER (ETHEREAL) ===== */}

      <motion.div
        animate={{
          y: [0, 4, 0],
          scale: [1, 1.01, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 right-6 text-4xl opacity-6 ${glow}`}
      >
        ✨
      </motion.div>

      <motion.div
        animate={{
          y: [0, -5, 0],
          x: [0, -2, 0],
          scale: [1, 1.015, 1],
        }}
        transition={{ duration: 31, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className={`absolute top-1/3 left-1/4 text-4xl opacity-9 ${glow}`}
      >
        🍒
      </motion.div>

      {/* ===== BOTTOM (SOFT & ELEGANT) ===== */}

      <motion.div
        animate={{
          y: [0, 6, 0],
          x: [0, -3, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-32 left-12 text-5xl opacity-12 ${glow}`}
      >
        🍓
      </motion.div>

      <motion.div
        animate={{
          y: [0, -5, 0],
          x: [0, 2, 0],
          scale: [1, 1.015, 1],
        }}
        transition={{ duration: 29, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className={`absolute bottom-40 right-10 text-4xl opacity-10 ${glow}`}
      >
        🦢
      </motion.div>

      <motion.div
        animate={{
          y: [0, 4, 0],
          x: [0, -2, 0],
          scale: [1, 1.01, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className={`absolute bottom-20 left-1/3 text-4xl opacity-9 ${glow}`}
      >
        🫧
      </motion.div>

      <motion.div
        animate={{
          y: [0, -4, 0],
          x: [0, 2, 0],
          scale: [1, 1.01, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        className={`absolute bottom-1/3 right-1/4 text-3xl opacity-7 ${glow}`}
      >
        🌷
      </motion.div>

    </div>
  );
};
