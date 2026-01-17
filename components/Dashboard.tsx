import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EnergyToggle } from './EnergyToggle';
import { WeeklyBubbles } from './WeeklyBubbles';
import { WorkoutCard } from './WorkoutCard';
import { WeekendActivityModal } from './WeekendActivityModal';
import { FloatingEmojiBackground } from './FloatingEmojiBackground';
import { EnergyMode, UserProfile } from '../types';
import { getDayOfWeek, getTodaysWorkout } from '../data/workoutPlan';
import { Home, User } from 'lucide-react';

interface DashboardProps {
  energyMode: EnergyMode;
  onToggleEnergy: () => void;
  completedDays: Set<string>;
  onStartWorkout: () => void;
  onNavigateToProfile: () => void;
  onDayClick?: (dayName: string) => void;
  streak: number;
  workoutCompletedToday: boolean;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  energyMode,
  onToggleEnergy,
  completedDays,
  onStartWorkout,
  onNavigateToProfile,
  onDayClick,
  streak,
  workoutCompletedToday,
  profile,
  onUpdateProfile
}) => {
  const currentDay = getDayOfWeek();
  const todaysWorkout = getTodaysWorkout();
  const [weekendActivityModal, setWeekendActivityModal] = useState<'Saturday' | 'Sunday' | null>(null);

  // Calculate weekly progress
  const mandatoryDaysCompleted = Array.from(completedDays).filter(() => {
    const workout = getTodaysWorkout(new Date()); // This would need proper date handling
    return workout?.type === 'mandatory';
  }).length;

  // Handle day click - open modal for weekend days
  const handleDayClick = (dayName: string) => {
    if (dayName === 'Saturday' || dayName === 'Sunday') {
      setWeekendActivityModal(dayName);
    } else {
      onDayClick?.(dayName);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] pb-24 lg:pb-8 relative overflow-hidden`}>
      {/* Floating emoji background */}
      <FloatingEmojiBackground />

      {/* Header with soft UI */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-sage/10 shadow-soft sticky top-0 z-20 relative">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img src="/logo.png" alt="3+2 Fitness" className="w-12 h-12 object-contain drop-shadow-sm" />
          </motion.div>
          <EnergyToggle mode={energyMode} onToggle={onToggleEnergy} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
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
        <WeeklyBubbles completedDays={completedDays} currentDay={currentDay} profile={profile} onDayClick={handleDayClick} />

        {/* Today's Workout */}
        {todaysWorkout && (
          <div className="mb-8">
            {workoutCompletedToday ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1] // Bouncy spring
                }}
                className="relative overflow-hidden p-8 rounded-3xl shadow-lg bg-gradient-to-br from-[#A3C9A8] via-[#82A885] to-[#6B9374]"
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative text-center text-white">
                  {/* Animated Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-7xl mb-4"
                  >
                    ✅
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl mb-3 font-raleway font-bold"
                  >
                    Amazing Work!
                  </motion.h2>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg mb-6 font-lato text-white/90"
                  >
                    You crushed today's workout 💪
                  </motion.p>

                  {/* Stats Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                  >
                    <span className="text-2xl">🔥</span>
                    <span className="text-lg font-raleway font-semibold">
                      {streak} {streak === 1 ? 'day' : 'days'} streak
                    </span>
                  </motion.div>

                  {/* Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm font-lato text-white/75"
                  >
                    See you tomorrow for day {streak + 1}!
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <WorkoutCard
                workout={todaysWorkout}
                energyMode={energyMode}
                onStart={onStartWorkout}
              />
            )}
          </div>
        )}

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
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white/40 via-white/50 to-white/40 backdrop-blur-2xl rounded-t-3xl shadow-soft-lg lg:hidden z-50" style={{
        borderTop: '2px solid transparent',
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.5), rgba(255,255,255,0.4)), linear-gradient(to right, rgba(163,201,168,0.3), rgba(237,196,179,0.3), rgba(163,201,168,0.3))',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box'
      }}>
        <div className="flex items-center justify-center gap-2 px-3 py-1">
          <button className="flex-1 py-3 px-6 flex flex-col items-center gap-2 text-sage hover:bg-sage/15 rounded-full transition-all duration-300 active:scale-90">
            <Home size={24} className="font-bold" />
            <span className="text-xs font-nunito font-medium">Home</span>
          </button>
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-charcoal/10 to-transparent"></div>
          <button
            onClick={onNavigateToProfile}
            className="flex-1 py-3 px-6 flex flex-col items-center gap-2 text-charcoal/50 hover:text-sage hover:bg-sage/15 rounded-full transition-all duration-300 active:scale-90"
          >
            <User size={24} />
            <span className="text-xs font-nunito font-medium">Me</span>
          </button>
        </div>
      </div>

      {/* Weekend Activity Modal */}
      {weekendActivityModal && (
        <WeekendActivityModal
          isOpen={!!weekendActivityModal}
          day={weekendActivityModal}
          profile={profile}
          onClose={() => setWeekendActivityModal(null)}
          onSave={onUpdateProfile}
        />
      )}
    </div>
  );
};
