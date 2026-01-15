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
import { useAppState } from './hooks/useAppState';
import { getTodaysCustomWorkout } from './utils/workoutHelpers';
import { ExerciseLog, DailyCheckIn } from './types';

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
  const [checkInData, setCheckInData] = useState<DailyCheckIn | undefined>();
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const [completedDayName, setCompletedDayName] = useState('');
  const [completedExerciseCount, setCompletedExerciseCount] = useState(0);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3EE]">
        <div className="text-center">
          <div className="text-4xl mb-4">🏋️</div>
          <p className="text-lg text-gray-600">Loading...</p>
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

  const handleCompleteWorkout = (exercises: ExerciseLog[]) => {
    const newStreak = completeWorkout(checkInData);
    const todaysWorkout = getTodaysCustomWorkout(state.customExercises);

    setCheckInData(undefined);
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
  const todaysWorkout = getTodaysCustomWorkout(state.customExercises);

  return (
    <>
      {currentScreen === 'dashboard' && (
        <Dashboard
          energyMode={state.energyMode}
          onToggleEnergy={toggleEnergyMode}
          completedDays={completedDays}
          onStartWorkout={handleStartWorkout}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          streak={state.profile.streak || 0}
          workoutCompletedToday={hasWorkoutToday()}
        />
      )}

      {currentScreen === 'workout' && todaysWorkout && (
        <WorkoutPlayer
          workout={todaysWorkout}
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
          customExercises={getCustomExercises()}
          onSaveCustomExercise={saveCustomExercise}
          onDeleteCustomExercise={deleteCustomExercise}
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
    </>
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