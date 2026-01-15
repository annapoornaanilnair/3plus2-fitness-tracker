import React from 'react';
import { motion } from 'motion/react';
import { WorkoutDay, EnergyMode } from '../types';

interface WorkoutCardProps {
  workout: WorkoutDay;
  energyMode: EnergyMode;
  onStart: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, energyMode, onStart }) => {
  const isBonus = workout.type === 'bonus';
  const isRest = workout.type === 'rest';
  const isLowEnergy = energyMode === 'low';
  const shouldGrayOut = isBonus && isLowEnergy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-8 rounded-3xl shadow-lg ${
        shouldGrayOut 
          ? 'bg-[#F5F1EB] opacity-60' 
          : isRest
          ? 'bg-gradient-to-br from-[#EDC4B3] to-[#E8B4A8]'
          : 'bg-white'
      }`}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">{workout.icon}</div>

        {/* Title */}
        <h2 
          className="text-3xl mb-2 text-[#4A4A4A]"
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
        >
          {workout.day}
        </h2>

        {/* Focus */}
        <p 
          className="text-xl mb-6 text-[#6A6A6A]"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          {workout.focus}
        </p>

        {/* Action */}
        {isRest ? (
          <div className="text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Take it easy today 💭
          </div>
        ) : shouldGrayOut ? (
          <div className="text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Optional on low energy days
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className={`w-full py-4 px-8 rounded-full text-lg shadow-md transition-colors ${
              isBonus 
                ? 'bg-[#EDC4B3] hover:bg-[#E8B4A8] text-white'
                : 'bg-[#A3C9A8] hover:bg-[#82A885] text-white'
            }`}
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
          >
            Start Workout
          </motion.button>
        )}

        {/* Exercise Count */}
        {!isRest && (
          <p className="mt-4 text-sm text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {workout.exercises.length} exercises
          </p>
        )}
      </div>
    </motion.div>
  );
};
