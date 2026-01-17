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
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(74, 74, 74, 0.15)' }}
      className={`p-8 rounded-squircle-lg shadow-soft-lg transition-all duration-300 border-2 ${
        shouldGrayOut 
          ? 'bg-gray-100/60 opacity-40 border-gray-200' 
          : isRest
          ? 'bg-gradient-to-br from-dusty-pink to-dusty-pink/70 border-dusty-pink/40 shadow-soft-xl'
          : 'bg-white/95 backdrop-blur-md border-white/80 shadow-soft-xl'
      }`}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="text-7xl mb-4 animate-float drop-shadow-lg">{workout.icon}</div>

        {/* Title */}
        <h2 
          className={`text-4xl mb-3 font-quicksand font-bold ${
            isRest ? 'text-white drop-shadow-sm' : 'text-charcoal'
          }`}
        >
          {workout.day}
        </h2>

        {/* Focus */}
        <p 
          className={`text-xl mb-6 font-nunito font-medium ${
            isRest ? 'text-white/90 drop-shadow-sm' : 'text-charcoal/80'
          }`}
        >
          {workout.focus}
        </p>

        {/* Action */}
        {isRest ? (
          <div className={`text-lg font-nunito ${isRest ? 'text-white/80' : 'text-charcoal/60'}`}>
            Take it easy today 💭
          </div>
        ) : shouldGrayOut ? (
          <div className="text-charcoal/50 font-nunito">
            Optional on low energy days
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 12px 30px rgba(163, 201, 168, 0.3)' }}
            whileTap={{ scale: 0.92 }}
            onClick={onStart}
            className={`w-full py-4 px-8 rounded-full text-lg font-bold shadow-soft-lg transition-all duration-300 font-quicksand ${
              isBonus 
                ? 'bg-gradient-to-r from-dusty-pink to-dusty-pink-dark hover:shadow-soft-xl text-white'
                : 'bg-gradient-to-r from-sage to-sage-dark hover:shadow-soft-xl text-white'
            }`}
          >
            Start Workout
          </motion.button>
        )}

        {/* Exercise Count */}
        {!isRest && (
          <p className={`mt-4 text-sm font-nunito font-medium ${
            isRest ? 'text-white/70' : 'text-charcoal/60'
          }`}>
            {workout.exercises.length} exercises
          </p>
        )}
      </div>
    </motion.div>
  );
};
