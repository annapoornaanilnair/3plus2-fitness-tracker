import React from 'react';
import { motion } from 'motion/react';
import { EnergyToggle } from './EnergyToggle';
import { WeeklyBubbles } from './WeeklyBubbles';
import { EnergyMode, UserProfile } from '../types';
import { getDayOfWeek, getTodaysWorkout, getWeeklyPlan } from '../data/workoutPlan';
import { Home, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  energyMode: EnergyMode;
  onToggleEnergy: () => void;
  completedDays: Set<string>;
  onStartWorkoutForDay: (dayName: string) => void;
  onNavigateToProfile: () => void;
  streak: number;
  workoutCompletedToday: boolean;
  profile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({
  energyMode,
  onToggleEnergy,
  completedDays,
  onStartWorkoutForDay,
  onNavigateToProfile,
  streak,
  workoutCompletedToday,
  profile
}) => {
  const { getBackgroundGradient } = useTheme();
  const currentDay = getDayOfWeek();
  const todaysWorkout = getTodaysWorkout();

  // Calculate weekly progress
  const mandatoryDaysCompleted = Array.from(completedDays).filter(() => {
    const workout = getTodaysWorkout(new Date()); // This would need proper date handling
    return workout?.type === 'mandatory';
  }).length;

  // Get energy value for background
  const energyValue = energyMode === 'low' ? 3 : 7;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(energyValue)} pb-20 lg:pb-8`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img src="/logo.png" alt="3+2 Fitness" className="w-12 h-12 object-contain" />
          </motion.div>
          <EnergyToggle mode={energyMode} onToggle={onToggleEnergy} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Greeting with Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-raleway font-semibold text-[#4A4A4A]">
              What's up for today?
            </h2>
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#F5F1EB]"
              >
                <span className="text-xl">🔥</span>
                <span className="text-lg font-raleway font-bold text-[#4A4A4A]">{streak}</span>
                <span className="text-sm font-lato text-[#8A8A8A]">
                  {streak === 1 ? 'day' : 'days'}
                </span>
              </motion.div>
            )}
          </div>
          <p className="text-[#8A8A8A] font-lato">
            {energyMode === 'low'
              ? "Taking it easy today? That's totally okay! 🌙"
              : "Let's make today count! 🌸"}
          </p>
        </motion.div>

        {/* Weekly Progress */}
        <WeeklyBubbles completedDays={completedDays} currentDay={currentDay} profile={profile} />

        {/* Today's Workout Status */}
        {workoutCompletedToday && todaysWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 rounded-3xl shadow-md bg-gradient-to-r from-[#A3C9A8] to-[#82A885] text-white"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="text-xl font-raleway font-bold">Today's workout complete!</h3>
                <p className="text-white/80 text-sm font-lato">Great job! Pick another day to keep training 💪</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Workouts Selector */}
        <div className="mb-8 space-y-3">
          <h3 className="text-lg font-raleway font-semibold text-[#4A4A4A] mb-4">
            {workoutCompletedToday ? 'Choose Another Workout' : 'Select a Workout'}
          </h3>
          {getWeeklyPlan(profile).map((workout, index) => {
            const isCompleted = completedDays.has(workout.day);
            const isToday = workout.day === currentDay;
            const isRest = workout.type === 'rest';

            return (
              <motion.button
                key={workout.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isRest && onStartWorkoutForDay(workout.day)}
                disabled={isRest}
                className={`w-full p-4 rounded-2xl shadow-sm flex items-center justify-between transition-all
                  ${isRest
                    ? 'bg-gray-100 cursor-not-allowed opacity-60'
                    : isCompleted
                      ? 'bg-gradient-to-r from-[#A3C9A8] to-[#C5E0C9] text-white hover:shadow-md active:scale-[0.98]'
                      : isToday
                        ? 'bg-white border-2 border-[#A3C9A8] hover:bg-[#F5F3EE] active:scale-[0.98]'
                        : 'bg-white hover:bg-[#F5F3EE] active:scale-[0.98]'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{workout.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-raleway font-semibold ${isCompleted || isRest ? 'text-white' : 'text-[#4A4A4A]'
                        }`}>
                        {workout.day}
                      </h4>
                      {isToday && !isRest && (
                        <span className="px-2 py-0.5 bg-[#A3C9A8] text-white text-xs rounded-full font-lato">
                          Today
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-white text-lg">✓</span>
                      )}
                    </div>
                    <p className={`text-sm font-lato ${isCompleted || isRest ? 'text-white/80' : 'text-[#8A8A8A]'
                      }`}>
                      {workout.focus} {!isRest && `• ${workout.exercises.length} exercises`}
                    </p>
                  </div>
                </div>
                {!isRest && (
                  <div className={`font-lato text-sm ${isCompleted ? 'text-white' : 'text-[#A3C9A8]'
                    }`}>
                    {isCompleted ? 'Do Again →' : 'Start →'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-md"
        >
          <h3
            className="text-lg mb-4 text-[#4A4A4A]"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
          >
            This Week's Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-[#F5F1EB] rounded-2xl">
              <div
                className="text-3xl mb-1 text-[#A3C9A8]"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
              >
                {completedDays.size}
              </div>
              <div className="text-sm text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Days Completed
              </div>
            </div>
            <div className="text-center p-4 bg-[#F5F1EB] rounded-2xl">
              <div
                className="text-3xl mb-1 text-[#A3C9A8]"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
              >
                {Math.min(mandatoryDaysCompleted, 3)}/3
              </div>
              <div className="text-sm text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Mandatory Days
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DE] lg:hidden">
        <div className="flex">
          <button className="flex-1 py-4 flex flex-col items-center gap-1 text-[#A3C9A8]">
            <Home size={24} />
            <span className="text-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>Home</span>
          </button>
          <button
            onClick={onNavigateToProfile}
            className="flex-1 py-4 flex flex-col items-center gap-1 text-[#8A8A8A]"
          >
            <User size={24} />
            <span className="text-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>Me</span>
          </button>
        </div>
      </div>
    </div>
  );
};
