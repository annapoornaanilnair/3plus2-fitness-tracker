import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Home, User, ChevronLeft, Settings, Shield, Calendar, Sun, Moon } from 'lucide-react';
import { UserProfile, WorkoutLog } from '../types';
import { AdminPanel } from './AdminPanel';
import { WorkoutHistory } from './WorkoutHistory';
import { FloatingEmojiBackground } from './FloatingEmojiBackground';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfilePageProps {
  profile: UserProfile;
  workoutLogs: WorkoutLog[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigateToHome: () => void;
  onNavigateToCustomization: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  workoutLogs,
  onUpdateProfile,
  onNavigateToHome,
  onNavigateToCustomization
}) => {
  const { isAdmin, signOut } = useAuth();
  const { mode, setMode } = useTheme();
  const [currentWeight, setCurrentWeight] = useState(profile.currentWeight.toString());
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight.toString());
  const [notificationTime, setNotificationTime] = useState(profile.notificationTime || '07:00');
  // const [creativeNotes, setCreativeNotes] = useState(profile.creativeNotes || '');
  // Creative notes feature removed
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showWeeklyHistory, setShowWeeklyHistory] = useState(false);
  const [isWeightExpanded, setIsWeightExpanded] = useState(false);

  const motivationalQuotes = [
    "Every step forward is a victory! 💪",
    "You're stronger than you think! 🌟",
    "Progress, not perfection! ✨",
    "Your only limit is you! 🚀",
    "Small steps lead to big changes! 🎯",
    "Believe in your journey! 🌈",
    "You've got this! Keep pushing! 💫",
    "Consistency is your superpower! ⭐",
    "Celebrate how far you've come! 🎉",
    "Today's effort is tomorrow's strength! 💪"
  ];

  const [motivationalQuote] = useState(() =>
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Equipment removed - murder board feature
  // const equipmentOptions = ['Dumbbells', 'Barbell', 'Bench', 'Resistance Bands', 'Yoga Mat', 'Pull-up Bar'];

  // const toggleEquipment = (item: string) => {
  //   const newEquipment = profile.equipment.includes(item)
  //     ? profile.equipment.filter(e => e !== item)
  //     : [...profile.equipment, item];
  //   onUpdateProfile({ equipment: newEquipment });
  // };

  const saveWeight = () => {
    const weight = parseFloat(currentWeight);
    if (!isNaN(weight) && weight > 0) {
      onUpdateProfile({ currentWeight: weight });
    }
  };

  const saveGoalWeight = () => {
    const weight = parseFloat(goalWeight);
    if (!isNaN(weight) && weight > 0) {
      onUpdateProfile({ goalWeight: weight });
    }
  };

  const saveNotificationTime = async () => {
    onUpdateProfile({ notificationTime });

    // Request notification permission if not already granted
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
          alert('✅ Notifications enabled! You\'ll get daily reminders at ' + notificationTime);
          scheduleNotification();
        } else {
          alert('⚠️ Notification permission denied. Please enable in your browser settings.');
        }
      } else if (Notification.permission === 'granted') {
        alert('✅ Reminder time updated to ' + notificationTime);
        scheduleNotification();
      } else {
        alert('⚠️ Notifications blocked. Please enable in browser settings.');
      }
    } else {
      alert('⚠️ This browser doesn\'t support notifications');
    }
  };

  const scheduleNotification = () => {
    // Clear existing notification timer
    const existingTimer = localStorage.getItem('notification_timer_id');
    if (existingTimer) {
      clearTimeout(parseInt(existingTimer));
    }

    // Schedule daily notification
    const [hours, minutes] = notificationTime.split(':');
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    const timerId = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Time to Workout! 💪', {
          body: 'Your daily fitness routine is waiting for you!',
          icon: '/logo.png',
          badge: '/logo.png',
          tag: 'workout-reminder',
          requireInteraction: false
        });
      }
      // Reschedule for next day
      scheduleNotification();
    }, timeUntilNotification);

    localStorage.setItem('notification_timer_id', timerId.toString());
    console.log(`✅ Reminder set for ${notificationTime} (${Math.round(timeUntilNotification / 1000 / 60)} minutes from now)`);
  };

  // Creative notes removed
  // const saveCreativeNotes = () => {
  //   onUpdateProfile({ creativeNotes });
  // };

  const progressPercentage =
    ((profile.startWeight - profile.currentWeight) / (profile.startWeight - profile.goalWeight)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] pb-24 lg:pb-8 relative overflow-hidden">
      {/* Floating emoji background */}
      <FloatingEmojiBackground />

      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-sage/10 shadow-soft sticky top-0 z-20 relative">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onNavigateToHome}
            className="lg:hidden p-2 hover:bg-sage/10 rounded-full transition-all duration-300"
          >
            <ChevronLeft size={24} className="text-charcoal/60" />
          </button>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-quicksand font-bold text-charcoal"
          >
            My Profile
          </motion.h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 relative z-10">
        {/* Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-squircle-lg p-6 shadow-soft-md cursor-pointer hover:shadow-soft-lg transition-all duration-300 border border-sage/10"
          onClick={() => setIsWeightExpanded(!isWeightExpanded)}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-charcoal font-quicksand font-bold">
              Weight Goal 🎯
            </h2>
            <motion.div
              animate={{ rotate: isWeightExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-charcoal/50"
            >
              ▼
            </motion.div>
          </div>

          {/* Motivational Quote */}
          <div className="mb-4 p-3 bg-gradient-to-r from-sage/10 to-dusty-pink/10 rounded-squircle-sm">
            <p className="text-sm text-center text-charcoal/70 italic font-nunito">
              {motivationalQuote}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-charcoal/60 mb-2 font-nunito">
              <span>Start: {profile.startWeight}kg</span>
              <span>Goal: {profile.goalWeight}kg</span>
            </div>
            <div className="h-4 bg-[#F5F1EB] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#A3C9A8] to-[#82A885]"
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl text-[#A3C9A8] font-raleway font-bold">
                {profile.currentWeight}kg
              </span>
              <span className="text-sm text-[#8A8A8A] ml-2 font-lato">
                current
              </span>
            </div>
          </div>

          {/* Expandable Section */}
          {isWeightExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Update Today's Weight */}
              <div className="mb-4">
                <label className="block text-sm text-[#8A8A8A] mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Update Today's Weight
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    onBlur={saveWeight}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F1EB] text-[#4A4A4A] text-center"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                    step="0.1"
                    placeholder="Current weight (kg)"
                  />
                  <button
                    onClick={saveWeight}
                    className="px-6 py-3 bg-[#A3C9A8] text-white rounded-2xl hover:bg-[#8FB896] transition-colors"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Edit Goal Weight */}
              <div>
                <label className="block text-sm text-[#8A8A8A] mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Edit Goal Weight
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    onBlur={saveGoalWeight}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F1EB] text-[#4A4A4A] text-center"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                    step="0.1"
                    placeholder="Goal weight (kg)"
                  />
                  <button
                    onClick={saveGoalWeight}
                    className="px-6 py-3 bg-[#EDC4B3] text-white rounded-2xl hover:bg-[#E0B5A4] transition-colors"
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Workout Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-6 shadow-md"
        >
          <h2 className="text-xl mb-4 text-[#4A4A4A] font-raleway font-semibold">
            Customize Workouts 🎯
          </h2>
          <p className="text-sm text-[#8A8A8A] mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Replace default exercises with your own favorites
          </p>
          <button
            onClick={onNavigateToCustomization}
            className="w-full px-6 py-3 bg-[#A3C9A8] text-white rounded-2xl flex items-center justify-center gap-2"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
          >
            <Settings className="h-5 w-5" />
            Customize Exercises
          </button>
        </motion.div >

        {/* Weekly History */}
        < motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.175 }}
          className="bg-white rounded-3xl p-6 shadow-md"
        >
          <h2 className="text-xl mb-4 text-[#4A4A4A] font-raleway font-semibold">
            Workout History 📊
          </h2>
          <p className="text-sm text-[#8A8A8A] mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
            View your weekly progress and past workouts
          </p>
          <button
            onClick={() => setShowWeeklyHistory(true)}
            className="w-full px-6 py-3 bg-[#EDC4B3] text-white rounded-2xl flex items-center justify-center gap-2"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
          >
            <Calendar className="h-5 w-5" />
            View History
          </button>
        </motion.div >

        {/* Admin Panel Button - Only visible to admins */}
        {
          isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 shadow-md"
            >
              <h2 className="text-xl mb-4 text-white font-raleway font-semibold">
                Admin Panel 👑
              </h2>
              <p className="text-sm text-purple-100 mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Manage user invitations and access
              </p>
              <button
                onClick={() => setShowAdminPanel(true)}
                className="w-full px-6 py-3 bg-white text-purple-600 rounded-2xl flex items-center justify-center gap-2"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                <Shield className="h-5 w-5" />
                Open Admin Panel
              </button>
            </motion.div>
          )
        }

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-md"
        >
          <h2 className="text-xl mb-2 text-[#4A4A4A] font-raleway font-semibold">
            Daily Reminder ⏰
          </h2>
          <p className="text-sm text-[#8A8A8A] mb-4 font-lato">
            Get notified at your preferred time
          </p>
          <div className="flex gap-4 mb-3">
            <input
              type="time"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F1EB] text-[#4A4A4A]"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            />
            <button
              onClick={saveNotificationTime}
              className="px-6 py-3 bg-[#A3C9A8] text-white rounded-2xl hover:bg-[#8FB896] transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              Save
            </button>
          </div>
          {Notification.permission !== 'granted' && (
            <p className="text-xs text-orange-500 font-lato">
              Click Save to enable notifications
            </p>
          )}
        </motion.div>

        {/* Appearance Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33 }}
          className="bg-white rounded-3xl p-6 shadow-md"
        >
          <h2 className="text-xl mb-4 text-[#4A4A4A] font-raleway font-semibold">
            App Mode 🎨
          </h2>

          <label className="block text-sm text-[#8A8A8A] mb-3 font-lato">
            Choose your visual style
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('light')}
              className={`px-4 py-4 rounded-xl transition-all ${mode === 'light'
                ? 'bg-[#A3C9A8] text-white ring-2 ring-[#A3C9A8] ring-offset-2'
                : 'bg-[#F5F1EB] text-[#8A8A8A] hover:bg-[#EDC4B3]/30'
                }`}
            >
              <Sun className="h-6 w-6 mx-auto mb-2" />
              <span className="block text-sm font-lato font-semibold">Light</span>
              <span className="block text-xs font-lato opacity-70">Classic & clean</span>
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`px-4 py-4 rounded-xl transition-all ${mode === 'dark'
                ? 'bg-gray-800 text-white ring-2 ring-gray-800 ring-offset-2'
                : 'bg-[#F5F1EB] text-[#8A8A8A] hover:bg-gray-200'
                }`}
            >
              <Moon className="h-6 w-6 mx-auto mb-2" />
              <span className="block text-sm font-lato font-semibold">Dark</span>
              <span className="block text-xs font-lato opacity-70">Night mode</span>
            </button>
            <button
              onClick={() => setMode('time')}
              className={`px-4 py-4 rounded-xl transition-all ${mode === 'time'
                ? 'bg-[#A3C9A8] text-white ring-2 ring-[#A3C9A8] ring-offset-2'
                : 'bg-[#F5F1EB] text-[#8A8A8A] hover:bg-blue-100'
                }`}
            >
              <span className="text-2xl mb-1">🌅</span>
              <span className="block text-sm font-lato font-semibold">Time Based</span>
              <span className="block text-xs font-lato opacity-70">Changes all day</span>
            </button>
            <button
              onClick={() => setMode('energy')}
              className={`px-4 py-4 rounded-xl transition-all ${mode === 'energy'
                ? 'bg-[#A3C9A8] text-white ring-2 ring-[#A3C9A8] ring-offset-2'
                : 'bg-[#F5F1EB] text-[#8A8A8A] hover:bg-green-100'
                }`}
            >
              <span className="text-2xl mb-1">⚡</span>
              <span className="block text-sm font-lato font-semibold">Energy</span>
              <span className="block text-xs font-lato opacity-70">Matches your vibe</span>
            </button>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-6 shadow-md border-2 border-red-100"
        >
          <button
            onClick={() => {
              signOut();
            }}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </motion.div>
      </div >

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white/40 via-white/50 to-white/40 backdrop-blur-2xl rounded-t-3xl shadow-soft-lg lg:hidden z-50" style={{
        borderTop: '2px solid transparent',
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.5), rgba(255,255,255,0.4)), linear-gradient(to right, rgba(163,201,168,0.3), rgba(237,196,179,0.3), rgba(163,201,168,0.3))',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box'
      }}>
        <div className="flex items-center justify-center gap-2 px-3 py-1">
          <button
            onClick={onNavigateToHome}
            className="flex-1 py-3 px-6 flex flex-col items-center gap-2 text-charcoal/50 hover:text-sage hover:bg-sage/15 rounded-full transition-all duration-300 active:scale-90"
          >
            <Home size={24} />
            <span className="text-xs font-nunito font-medium">Home</span>
          </button>
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-charcoal/10 to-transparent"></div>
          <button className="flex-1 py-3 px-6 flex flex-col items-center gap-2 text-sage hover:bg-sage/15 rounded-full transition-all duration-300 active:scale-90">
            <User size={24} className="font-bold" />
            <span className="text-xs font-nunito font-medium">Me</span>
          </button>
        </div>
      </div>

      {/* Admin Panel Modal */}
      {
        showAdminPanel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                <h2
                  className="text-2xl text-[#4A4A4A]"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  Admin Panel
                </h2>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="text-[#8A8A8A] hover:text-[#4A4A4A]"
                >
                  ✕
                </button>
              </div>
              <AdminPanel />
            </div>
          </div>
        )
      }

      {/* Weekly History Modal */}
      {
        showWeeklyHistory && (
          <WorkoutHistory
            workoutLogs={workoutLogs}
            profile={profile}
            onClose={() => setShowWeeklyHistory(false)}
          />
        )
      }
    </div >
  );
};

