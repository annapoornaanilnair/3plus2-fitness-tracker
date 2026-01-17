import React from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { WorkoutDay, EnergyMode } from '../types';
import { getRandomMessage } from '../data/lowEnergyMessages';

interface DayWorkoutModalProps {
  day: WorkoutDay;
  isCompleted: boolean;
  energyMode?: EnergyMode;
  streak: number;
  onStartWorkout: () => void;
  onSkipBonusDay?: () => void;
  onClose: () => void;
}

export const DayWorkoutModal: React.FC<DayWorkoutModalProps> = ({
  day,
  isCompleted,
  energyMode = 'high',
  streak,
  onStartWorkout,
  onSkipBonusDay,
  onClose
}) => {
  const completionEmoji = isCompleted ? '🔥' : day.icon;
  const shouldShowSkipOption = !isCompleted && energyMode === 'low' && day.type === 'bonus';
  
  // Determine day type text
  const getDayTypeText = () => {
    if (day.type === 'rest') {
      return `Rest Day - ${day.focus}`;
    }
    if (day.type === 'bonus') {
      return 'Bonus Workout';
    }
    return 'Mandatory Workout';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-end z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto shadow-2xl border-t border-sage/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/40 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-charcoal/50" />
        </button>

        {/* Header - More Compact */}
        <div className="text-center mb-5 pt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-3 inline-block"
          >
            {completionEmoji}
          </motion.div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-raleway font-semibold text-charcoal">
              {day.day}
            </h2>
            {streak > 0 && !isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full"
              >
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-charcoal">{streak}</span>
              </motion.div>
            )}
          </div>
          <p className="text-sm text-charcoal/60" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {getDayTypeText()}
          </p>
        </div>

        {/* Status Badge - Smaller */}
        <div className="flex justify-center mb-5">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-[#A3C9A8] text-white rounded-full text-sm font-medium"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              ✓ Completed Today
            </motion.div>
          ) : day.type === 'rest' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-white/60 text-charcoal rounded-full text-sm font-medium"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Rest Day
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-dusty-pink/20 text-dusty-pink rounded-full text-sm font-medium"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Ready to workout
            </motion.div>
          )}
        </div>

        {/* Exercises List - Compact */}
        {day.exercises && day.exercises.length > 0 && (
          <div className="mb-6">
            <h3
              className="text-sm font-raleway font-semibold text-charcoal mb-3 uppercase tracking-wider"
              style={{ fontSize: '0.75rem' }}
            >
              Exercises
            </h3>
            <div className="space-y-2">
              {day.exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-sage/10"
                >
                  <p
                    className="text-sm font-semibold text-charcoal mb-1"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {exercise.name}
                  </p>
                  <div className="flex gap-4 text-xs text-charcoal/60">
                    <span>🎯 {exercise.sets}×{exercise.reps}</span>
                    <span>⏱️ {exercise.restSeconds}s</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Skip Bonus Day Message - Low Energy Mode */}
        {shouldShowSkipOption && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#F5DEB3] to-[#FFE4B5] rounded-2xl p-4 mb-4 border border-[#D4A574]"
          >
            <p className="text-sm text-center text-[#8B6F47]" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {getRandomMessage('bonusSkipped')}
            </p>
          </motion.div>
        )}

        {/* Workout Button */}
        {day.type !== 'rest' && (
          <div className="flex gap-3">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onStartWorkout}
              className={`${shouldShowSkipOption ? 'flex-1' : 'w-full'} px-5 py-3 bg-gradient-to-r from-[#A3C9A8] to-[#82A885] text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              💪 Start Workout
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            {shouldShowSkipOption && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => {
                  onSkipBonusDay?.();
                  onClose();
                }}
                className="flex-1 px-5 py-3 bg-white/60 text-charcoal rounded-2xl font-semibold hover:bg-white/80 transition-colors border border-sage/10"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Skip Today
              </motion.button>
            )}
          </div>
        )}

        {/* Back Button for Rest Days */}
        {day.type === 'rest' && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="w-full px-5 py-3 bg-white/60 text-charcoal rounded-2xl font-semibold hover:bg-white/80 transition-colors border border-sage/10"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Close
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
