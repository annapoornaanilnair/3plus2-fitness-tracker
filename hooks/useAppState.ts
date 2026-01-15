import { useState, useEffect } from 'react';
import { AppState, WorkoutLog, UserProfile, ExerciseLog, CustomExercise } from '../types';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = '3plus2-app-state';

const DEFAULT_PROFILE: UserProfile = {
  startWeight: 65.5,
  currentWeight: 65.5,
  goalWeight: 60,
  equipment: ['Dumbbells', 'Bench', 'Yoga Mat'],
  notificationTime: '07:00',
  creativeNotes: '',
  streak: 0,
  lastWorkoutDate: undefined
};

const DEFAULT_STATE: AppState = {
  energyMode: 'high',
  workoutLogs: [],
  profile: DEFAULT_PROFILE,
  customExercises: []
};

export const useAppState = () => {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load state from Supabase or localStorage on mount
  useEffect(() => {
    const loadState = async () => {
      if (user) {
        // Try to load from Supabase first
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile && profile.app_data) {
            setState(profile.app_data);
            setIsOnboarded(true);
            // Also save to localStorage as backup
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile.app_data));
            return;
          }
        } catch (error) {
          console.error('Failed to load from Supabase:', error);
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setState(parsed);
          setIsOnboarded(true);
        } catch (error) {
          console.error('Failed to parse stored state:', error);
        }
      }
    };

    loadState();

    // Poll for updates every 60 seconds when user is logged in
    if (!user) {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('app_data, updated_at')
          .eq('id', user.id)
          .single();

        if (error) return;

        if (profile?.app_data) {
          const localUpdated = localStorage.getItem('last_updated');

          if (!localUpdated || new Date(profile.updated_at) > new Date(localUpdated)) {
            // Compare if data actually changed before updating state
            const currentState = JSON.stringify(state);
            const cloudState = JSON.stringify(profile.app_data);

            if (currentState !== cloudState) {
              setState(profile.app_data);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(profile.app_data));
              localStorage.setItem('last_updated', profile.updated_at);
              console.log('🔄 App state updated from cloud');
            }
          }
        }
      } catch (error) {
        console.error('Poll error:', error);
      }
    }, 60000); // Poll every 60 seconds (1 minute)

    return () => clearInterval(pollInterval);
  }, [user]);

  // Save state to localStorage immediately, sync to cloud with debouncing
  useEffect(() => {
    if (!isOnboarded) return;

    // Save to localStorage immediately (local-first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // PAUSE cloud sync during active workout
    if (state.currentWorkout) {
      return; // Don't sync while working out
    }

    // Debounce cloud sync to avoid too many updates
    if (!user || isSyncing) return;

    const syncTimer = setTimeout(async () => {
      try {
        setIsSyncing(true);

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            app_data: state,
            updated_at: new Date().toISOString()
          });

        if (!error) {
          const timestamp = new Date().toISOString();
          localStorage.setItem('last_updated', timestamp);
          console.log('✅ Saved to cloud');
        }
      } catch (error) {
        console.error('Sync error:', error);
      } finally {
        setIsSyncing(false);
      }
    }, 2000); // Wait 2 seconds after last change before syncing

    return () => clearTimeout(syncTimer);
  }, [state, user, isOnboarded, isSyncing]);

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  const toggleEnergyMode = () => {
    setState(prev => ({
      ...prev,
      energyMode: prev.energyMode === 'high' ? 'low' : 'high'
    }));
  };

  const startWorkout = (dayName: string, exercises: ExerciseLog[]) => {
    setState(prev => ({
      ...prev,
      currentWorkout: {
        dayName,
        exercises,
        currentExerciseIndex: 0
      }
    }));
  };

  const updateCurrentWorkout = (exercises: ExerciseLog[], currentExerciseIndex: number) => {
    setState(prev => ({
      ...prev,
      currentWorkout: prev.currentWorkout ? {
        ...prev.currentWorkout,
        exercises,
        currentExerciseIndex
      } : undefined
    }));
  };

  const completeWorkout = (checkIn?: { mood: number; energy: number; timestamp: string }) => {
    if (!state.currentWorkout) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Calculate new streak
    let newStreak = 1;
    const lastWorkoutDate = state.profile.lastWorkoutDate;

    if (lastWorkoutDate) {
      const lastDate = new Date(lastWorkoutDate);
      lastDate.setHours(0, 0, 0, 0);
      const lastDateStr = lastDate.toISOString().split('T')[0];

      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak = (state.profile.streak || 0) + 1;
      } else if (daysDiff === 0 && lastDateStr === todayStr) {
        // Same day - keep streak
        newStreak = state.profile.streak || 1;
      } else {
        // Streak broken - start over
        newStreak = 1;
      }
    }

    const workoutLog: WorkoutLog = {
      date: new Date().toISOString(),
      dayName: state.currentWorkout.dayName,
      exercises: state.currentWorkout.exercises,
      completed: true,
      checkIn
    };

    setState(prev => ({
      ...prev,
      workoutLogs: [...prev.workoutLogs, workoutLog],
      currentWorkout: undefined,
      profile: {
        ...prev.profile,
        streak: newStreak,
        lastWorkoutDate: todayStr
      }
    }));

    return newStreak;
  };

  const cancelWorkout = () => {
    setState(prev => ({
      ...prev,
      currentWorkout: undefined
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates
      }
    }));
  };

  const getWorkoutHistory = (dayName?: string) => {
    if (dayName) {
      return state.workoutLogs.filter(log => log.dayName === dayName);
    }
    return state.workoutLogs;
  };

  const getLastWeight = (exerciseId: string): number | undefined => {
    // Find the most recent workout that included this exercise
    const reversedLogs = [...state.workoutLogs].reverse();
    for (const log of reversedLogs) {
      const exerciseLog = log.exercises.find(e => e.exerciseId === exerciseId);
      if (exerciseLog && exerciseLog.weight) {
        return exerciseLog.weight;
      }
    }
    return undefined;
  };

  const getCompletedDaysThisWeek = (): Set<string> => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const completedDays = new Set<string>();

    // Safety check: workoutLogs might be undefined during initial load
    if (!state.workoutLogs) {
      console.warn('⚠️ workoutLogs is undefined, returning empty set');
      return completedDays;
    }

    state.workoutLogs.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= startOfWeek && log.completed) {
        const dayName = logDate.toLocaleDateString('en-US', { weekday: 'long' });
        completedDays.add(dayName);
      }
    });

    return completedDays;
  };

  const saveCustomExercise = (customExercise: CustomExercise) => {
    setState(prev => {
      // Safety check
      if (!prev.customExercises) {
        console.warn('⚠️ customExercises is undefined, initializing empty array');
        prev = { ...prev, customExercises: [] };
      }

      // Remove any existing customization for this day + exercise
      const filtered = prev.customExercises.filter(
        ce => !(ce.dayName === customExercise.dayName && ce.replacedExerciseId === customExercise.replacedExerciseId)
      );

      return {
        ...prev,
        customExercises: [...filtered, customExercise]
      };
    });
  };

  const deleteCustomExercise = (dayName: string, replacedExerciseId: string) => {
    setState(prev => ({
      ...prev,
      customExercises: prev.customExercises.filter(
        ce => !(ce.dayName === dayName && ce.replacedExerciseId === replacedExerciseId)
      )
    }));
  };

  const getCustomExercises = () => {
    return state.customExercises;
  };

  const hasWorkoutToday = (): boolean => {
    // Safety check
    if (!state.workoutLogs) {
      console.warn('⚠️ workoutLogs is undefined in hasWorkoutToday');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    return state.workoutLogs.some(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const logDateStr = logDate.toISOString().split('T')[0];
      return logDateStr === todayStr && log.completed;
    });
  };

  const clearAllWorkoutHistory = () => {
    setState(prev => ({
      ...prev,
      workoutLogs: [],
      profile: {
        ...prev.profile,
        streak: 0,
        lastWorkoutDate: undefined
      }
    }));
    console.log('✅ Workout history cleared. Refresh the page to see changes.');
  };

  return {
    state,
    isOnboarded,
    completeOnboarding,
    toggleEnergyMode,
    startWorkout,
    updateCurrentWorkout,
    completeWorkout,
    cancelWorkout,
    updateProfile,
    getWorkoutHistory,
    getLastWeight,
    getCompletedDaysThisWeek,
    saveCustomExercise,
    deleteCustomExercise,
    getCustomExercises,
    hasWorkoutToday,
    clearAllWorkoutHistory
  };
};
