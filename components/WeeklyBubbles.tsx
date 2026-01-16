import React from 'react';
import { motion } from 'motion/react';
import { getWeeklyPlan } from '../data/workoutPlan';
import { UserProfile } from '../types';

interface WeeklyBubblesProps {
  completedDays: Set<string>;
  currentDay: string;
  profile: UserProfile;
}

export const WeeklyBubbles: React.FC<WeeklyBubblesProps> = ({ completedDays, currentDay, profile }) => {
  const weeklyPlan = getWeeklyPlan(profile);

  return (
    <div className="flex justify-center gap-3 mb-8">
      {weeklyPlan.map((day, index) => {
        const isToday = day.day === currentDay;
        const isCompleted = completedDays.has(day.day);
        const dayInitial = day.day.charAt(0);

        return (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={isToday ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm
                ${isCompleted
                  ? 'bg-[#A3C9A8] text-white'
                  : isToday
                    ? 'bg-[#C5E0C9] text-[#4A4A4A] ring-2 ring-[#A3C9A8]'
                    : 'bg-white text-[#8A8A8A] border-2 border-[#E8E4DE]'
                }
              `}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              {isCompleted ? '✓' : dayInitial}
            </motion.div>
            <span className="text-xs mt-1 text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {dayInitial}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
