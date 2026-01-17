import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ProfilePage } from './components/ProfilePage';
import { WorkoutCustomization } from './components/WorkoutCustomization';
import { CheckInModal } from './components/CheckInModal';
import { CelebrationModal } from './components/CelebrationModal';
import { ShareableWorkoutCard } from './components/ShareableWorkoutCard';
import { DayWorkoutModal } from './components/DayWorkoutModal';
import { FloatingEmojiBackground } from './components/FloatingEmojiBackground';
import { useAppState } from './hooks/useAppState';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { getTodaysCustomWorkout, getWorkoutForDay } from './utils/workoutHelpers';
import { ExerciseLog, DailyCheckIn, WorkoutDay } from './types';

type Screen = 'dashboard' | 'workout' | 'profile' | 'customization';

function AppContent() {
  const { user, loading } = useAuth();
  const {
    state,
    isOnboarded,
    completeOnboarding,
    toggleEnergyMode,
    startWorkout,
    completeWorkout,
    cancelWorkout,
    updateProfile,
    getLastWeight,
    getCompletedDaysThisWeek,
    saveCustomExercise,
    deleteCustomExercise,
    getCustomExercises,
    hasWorkoutToday,
    clearAllWorkoutHistory
  } = useAppState();

  // Expose clear function to window for testing
  React.useEffect(() => {
    (window as any).clearWorkoutHistory = () => {
      const confirm = window.confirm('⚠️ This will delete ALL workout history and reset your streak to 0. Are you sure?');
      if (confirm) {
        clearAllWorkoutHistory();
        window.location.reload();
      }
    };
    console.log('💡 Tip: Run clearWorkoutHistory() in console to reset all workout data');
  }, [clearAllWorkoutHistory]);

  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayForWorkout, setSelectedDayForWorkout] = useState<string | null>(null);
  const [checkInData, setCheckInData] = useState<DailyCheckIn | undefined>();
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const [completedDayName, setCompletedDayName] = useState('');
  const [completedExerciseCount, setCompletedExerciseCount] = useState(0);

  // Gesture Navigation: Swipe between screens
  // Dashboard <-> WorkoutHistory (not implemented yet) <-> Profile
  useSwipeGesture({
    onSwipeLeft: () => {
      // Swipe left = go to next screen
      if (currentScreen === 'dashboard' && !state.currentWorkout) {
        setCurrentScreen('profile');
      }
    },
    onSwipeRight: () => {
      // Swipe right = go to previous screen
      if (currentScreen === 'profile') {
        setCurrentScreen('dashboard');
      } else if (currentScreen === 'customization') {
        setCurrentScreen('profile');
      }
    }
  }, {
    minSwipeDistance: 80, // Require longer swipe to prevent accidental navigation
    preventDefaultTouchMove: false // Allow normal scrolling
  });

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] p-4 relative overflow-hidden">
        <FloatingEmojiBackground />
        <div className="text-center relative z-10">
          <div className="text-5xl mb-4 animate-float">🏋️</div>
          <p className="text-lg text-charcoal/60 font-nunito">Loading your journey...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  const handleStartWorkout = () => {
    const todaysWorkout = getTodaysCustomWorkout(state.customExercises);
    if (!todaysWorkout) return;

    // Show check-in modal first
    setShowCheckIn(true);
  };

  const handleDayClick = (dayName: string) => {
    setSelectedDayForWorkout(dayName);
    setShowDayModal(true);
  };

  const handleDayWorkoutStart = () => {
    if (!selectedDayForWorkout) return;

    const selectedWorkout = getWorkoutForDay(selectedDayForWorkout, state.profile);
    if (!selectedWorkout || selectedWorkout.type === 'rest') return;

    setShowDayModal(false);

    // Initialize exercises with customizations
    const initialExercises: ExerciseLog[] = selectedWorkout.exercises.map(ex => ({
      exerciseId: ex.id,
      weight: getLastWeight(ex.id) || 0,
      sets: Array(ex.sets).fill({ completed: false, struggled: false })
    }));

    startWorkout(selectedDayForWorkout, initialExercises);
    setCurrentScreen('workout');
  };

  const handleCheckInComplete = (checkIn: DailyCheckIn) => {
    setCheckInData(checkIn);
    setShowCheckIn(false);

    // Start the workout
    const todaysWorkout = getTodaysCustomWorkout(state.customExercises);
    if (!todaysWorkout) return;

    const initialExercises: ExerciseLog[] = todaysWorkout.exercises.map(ex => ({
      exerciseId: ex.id,
      weight: getLastWeight(ex.id) || 0,
      sets: Array(ex.sets).fill({ completed: false, struggled: false })
    }));

    startWorkout(todaysWorkout.day, initialExercises);
    setCurrentScreen('workout');
  };

  const handleCheckInSkip = () => {
    setShowCheckIn(false);
    setCheckInData(undefined);

    // Start the workout without check-in
    const todaysWorkout = getTodaysCustomWorkout(state.customExercises);
    if (!todaysWorkout) return;

    const initialExercises: ExerciseLog[] = todaysWorkout.exercises.map(ex => ({
      exerciseId: ex.id,
      weight: getLastWeight(ex.id) || 0,
      sets: Array(ex.sets).fill({ completed: false, struggled: false })
    }));

    startWorkout(todaysWorkout.day, initialExercises);
    setCurrentScreen('workout');
  };

  const handleCompleteWorkout = async (exercises: ExerciseLog[]) => {
    const newStreak = await completeWorkout(checkInData);
    const todaysWorkout = getTodaysCustomWorkout(state.customExercises, state.profile);

    setCheckInData(undefined);
    setSelectedDayForWorkout(null);
    setCurrentScreen('dashboard');

    // Store workout info for sharing
    if (todaysWorkout) {
      setCompletedDayName(todaysWorkout.day);
      setCompletedExerciseCount(exercises.length);
    }

    // Show celebration
    if (newStreak) {
      setCelebrationStreak(newStreak);
      setShowCelebration(true);
    }
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
    setCurrentScreen('dashboard');
  };

  const completedDays = getCompletedDaysThisWeek();
  const todaysWorkout = getTodaysCustomWorkout(state.customExercises, state.profile);
  
  // Get the currently selected workout based on state (for day selection feature)
  const getCurrentWorkout = (): WorkoutDay | null => {
    if (!state.currentWorkout) return null;
    
    // If a specific day was selected, get that day's workout
    if (selectedDayForWorkout) {
      return getWorkoutForDay(selectedDayForWorkout, state.profile);
    }
    
    // Otherwise return today's workout
    return todaysWorkout;
  };
  
  const currentWorkout = getCurrentWorkout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] transition-all duration-700 relative overflow-hidden">
      {/* Animated background elements - Floating emojis */}
      <FloatingEmojiBackground />

      {/* Content */}
      <div className="relative z-10">
      {currentScreen === 'dashboard' && (
        <Dashboard
          energyMode={state.energyMode}
          onToggleEnergy={toggleEnergyMode}
          completedDays={completedDays}
          onStartWorkout={handleStartWorkout}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onDayClick={handleDayClick}
          streak={state.profile.streak || 0}
          workoutCompletedToday={hasWorkoutToday()}
          profile={state.profile}
          onUpdateProfile={updateProfile}
        />
      )}

      {currentScreen === 'workout' && currentWorkout && (
        <WorkoutPlayer
          workout={currentWorkout}
          energyMode={state.energyMode}
          onComplete={handleCompleteWorkout}
          onCancel={handleCancelWorkout}
          getLastWeight={getLastWeight}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfilePage
          profile={state.profile}
          workoutLogs={state.workoutLogs}
          onUpdateProfile={updateProfile}
          onNavigateToHome={() => setCurrentScreen('dashboard')}
          onNavigateToCustomization={() => setCurrentScreen('customization')}
        />
      )}

      {currentScreen === 'customization' && (
        <WorkoutCustomization
          profile={state.profile}
          customExercises={getCustomExercises()}
          onSaveCustomExercise={saveCustomExercise}
          onDeleteCustomExercise={deleteCustomExercise}
          onUpdateProfile={updateProfile}
          onBack={() => setCurrentScreen('profile')}
        />
      )}

      {/* Check-In Modal */}
      {showCheckIn && (
        <CheckInModal
          onComplete={handleCheckInComplete}
          onSkip={handleCheckInSkip}
        />
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <CelebrationModal
          streak={celebrationStreak}
          dayName={completedDayName}
          exerciseCount={completedExerciseCount}
          energyMode={state.energyMode}
          onClose={() => setShowCelebration(false)}
          onShare={() => {
            setShowCelebration(false);
            setShowShareCard(true);
          }}
        />
      )}

      {/* Shareable Workout Card */}
      {showShareCard && (
        <ShareableWorkoutCard
          dayName={completedDayName}
          exerciseCount={completedExerciseCount}
          streak={celebrationStreak}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* Day Workout Modal */}
      {showDayModal && selectedDayForWorkout && (
        <DayWorkoutModal
          day={getWorkoutForDay(selectedDayForWorkout, state.profile) || { day: selectedDayForWorkout, focus: '', icon: '📅', type: 'mandatory', exercises: [] }}
          isCompleted={completedDays.has(selectedDayForWorkout)}
          energyMode={state.energyMode}
          streak={state.profile.streak || 0}
          onStartWorkout={handleDayWorkoutStart}
          onSkipBonusDay={() => {
            // Mark the day as completed when skipping bonus day
            completeWorkout();
          }}
          onClose={() => {
            setShowDayModal(false);
            setSelectedDayForWorkout(null);
          }}
        />
      )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}