import React from 'react';
import { motion } from 'motion/react';
import { getWeeklyPlan } from '../data/workoutPlan';
import { UserProfile } from '../types';

interface WeeklyBubblesProps {
  completedDays: Set<string>;
  currentDay: string;
  profile: UserProfile;
  onDayClick?: (dayName: string) => void;
}

export const WeeklyBubbles: React.FC<WeeklyBubblesProps> = ({ completedDays, currentDay, profile, onDayClick }) => {
  const weeklyPlan = getWeeklyPlan(profile);

  return (
    <div className="flex justify-center flex-wrap gap-2 mb-8 px-4">
      {weeklyPlan.map((day, index) => {
        const isToday = day.day === currentDay;
        const isCompleted = completedDays.has(day.day);
        const dayInitial = day.day.charAt(0);
        const isWeekend = day.day === 'Saturday' || day.day === 'Sunday';
        const isBonus = day.type === 'bonus';

        // Determine styling based on day type
        let circleClass = '';
        if (isCompleted) {
          circleClass = 'bg-sage text-white shadow-soft-md hover:bg-sage-dark hover:shadow-soft-lg';
        } else if (isToday) {
          if (isBonus) {
            // Orange dashed for bonus days that are today
            circleClass = 'bg-white/40 text-dusty-pink border-2 border-dashed border-dusty-pink shadow-soft-md hover:border-dusty-pink-dark hover:shadow-soft-lg';
          } else if (isWeekend) {
            // Grey dashed for weekend days that are today
            circleClass = 'bg-white/40 text-charcoal/50 border-2 border-dashed border-gray-300 shadow-soft-md hover:border-gray-400 hover:shadow-soft-lg';
          } else {
            // Regular today style for mandatory days
            circleClass = 'bg-sage-light text-charcoal ring-2 ring-sage shadow-soft-md hover:bg-sage hover:shadow-soft-lg';
          }
        } else {
          if (isBonus) {
            // Orange dashed for bonus days
            circleClass = 'bg-white/60 text-dusty-pink border-2 border-dashed border-dusty-pink/60 shadow-soft hover:border-dusty-pink hover:shadow-soft-lg';
          } else if (isWeekend) {
            // Grey dashed for weekend days
            circleClass = 'bg-white/60 text-charcoal/40 border-2 border-dashed border-gray-200 shadow-soft hover:border-gray-400 hover:shadow-soft-lg';
          } else {
            // Regular white background for mandatory rest days
            circleClass = 'bg-white text-charcoal/60 border-2 border-sage/20 shadow-soft hover:border-sage hover:shadow-soft-lg';
          }
        }

        return (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onDayClick?.(day.day)}
          >
            <motion.div
              animate={isToday ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.15 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${circleClass}
              `}
            >
              {isCompleted ? '✓' : dayInitial}
            </motion.div>
            <span className="text-xs mt-1 text-charcoal/50 font-nunito">
              {dayInitial}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
