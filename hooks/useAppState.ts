/**
 * useAppState - Application State Management Hook
 * 
 * Refactored to use Service Layer following SOLID principles
 * 
 * Responsibilities:
 * - React state management (UI layer only)
 * - Orchestrate service calls
 * - Handle user interactions
 * 
 * Dependencies: StorageService, SyncService, WorkoutService, BackgroundSyncService
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, WorkoutLog, UserProfile, CustomExercise } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  StorageService,
  SyncService,
  WorkoutService,
  BackgroundSyncService,
  SyncState
} from '../services';

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
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'offline',
    lastSyncTime: 0
  });

  // Refs for debouncing and tracking
  const syncTimerRef = useRef<NodeJS.Timeout>();
  const workoutSyncTimerRef = useRef<NodeJS.Timeout>();

  /**
   * Load initial state from Supabase/Storage
   */
  useEffect(() => {
    if (!user) {
      console.log('[useAppState] No user - resetting to default state');
      setState(DEFAULT_STATE);
      setIsOnboarded(false);
      return;
    }

    const loadState = async () => {
      console.log('[useAppState] Loading state for user:', user.email);

      // Try loading from cloud first
      const cloudResult = await SyncService.fetch(user.id);

      if (cloudResult.success && cloudResult.data) {
        console.log('[useAppState] Loaded from cloud');
        setState(cloudResult.data);

        // Cache to localStorage
        StorageService.write('app_data', cloudResult.data, user.id);
        StorageService.write('last_updated', cloudResult.data.last_updated, user.id);

        setIsOnboarded(true);
        return;
      }

      // Fallback to localStorage
      console.log('[useAppState] Cloud load failed, trying localStorage');
      const localResult = StorageService.read<AppState>('app_data', user.id);

      if (localResult.success && localResult.data) {
        console.log('[useAppState] Loaded from localStorage');
        setState(localResult.data);
        setIsOnboarded(true);
        return;
      }

      // First time user
      console.log('[useAppState] New user - using default state');
      setState(DEFAULT_STATE);
      setIsOnboarded(false);
    };

    loadState();
  }, [user]);

  /**
   * Setup real-time subscription when user is loaded
   */
  useEffect(() => {
    if (!user) {
      SyncService.unsubscribe();
      BackgroundSyncService.cleanup();
      return;
    }

    console.log('[useAppState] Setting up real-time sync for user:', user.id);

    // Subscribe to real-time updates
    SyncService.subscribe(
      user.id,
      (remoteState) => {
        console.log('[useAppState] Received remote update via real-time');
        setState(remoteState);
        StorageService.write('app_data', remoteState, user.id);
      },
      (status) => {
        console.log('[useAppState] Sync status changed:', status);
        setSyncState(status);
      }
    );

    // Setup background sync to prevent data loss
    BackgroundSyncService.initialize(user.id, () => state);

    // Cleanup on unmount
    return () => {
      SyncService.unsubscribe();
      BackgroundSyncService.cleanup();
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (workoutSyncTimerRef.current) clearTimeout(workoutSyncTimerRef.current);
    };
  }, [user]);

  /**
   * Debounced cloud sync on state changes
   * REMOVED: Workout pause - now syncs continuously
   */
  useEffect(() => {
    if (!user || !isOnboarded) return;

    // Clear existing timer
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    // Save to localStorage immediately (fast, synchronous)
    const writeResult = StorageService.write('app_data', state, user.id);
    if (!writeResult.success) {
      console.error('[useAppState] Failed to save to localStorage:', writeResult.error);
    }

    // Debounce cloud sync (2 seconds)
    syncTimerRef.current = setTimeout(async () => {
      console.log('[useAppState] Syncing to cloud (debounced)...');
      const result = await SyncService.push(user.id, state);

      if (result.success) {
        StorageService.write('last_updated', state.last_updated, user.id);
      } else {
        console.error('[useAppState] Cloud sync failed:', result.error);
      }
    }, 2000);

    // Cleanup timer on unmount
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [state, user, isOnboarded]);

  /**
   * Continuous workout sync (backup timer during active workout)
   * Syncs every 30 seconds during workout to prevent data loss
   */
  useEffect(() => {
    if (!user || !state.currentWorkout) {
      if (workoutSyncTimerRef.current) {
        clearTimeout(workoutSyncTimerRef.current);
      }
      return;
    }

    console.log('[useAppState] Active workout detected, enabling continuous sync');

    const syncWorkoutProgress = async () => {
      console.log('[useAppState] Backup workout sync...');
      await SyncService.push(user.id, state);

      // Schedule next sync in 30 seconds
      workoutSyncTimerRef.current = setTimeout(syncWorkoutProgress, 30000);
    };

    // Initial sync after 30 seconds
    workoutSyncTimerRef.current = setTimeout(syncWorkoutProgress, 30000);

    return () => {
      if (workoutSyncTimerRef.current) {
        clearTimeout(workoutSyncTimerRef.current);
      }
    };
  }, [state.currentWorkout, user]);

  /**
   * Complete onboarding (backward compatible - no params needed)
   */
  const completeOnboarding = useCallback((profile?: UserProfile) => {
    console.log('[useAppState] Completing onboarding');

    const profileToUse = profile || state.profile;

    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileToUse,
        last_updated: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    }));

    setIsOnboarded(true);
  }, [state.profile]);
  /**
   * Update profile
   */
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    console.log('[useAppState] Updating profile:', updates);

    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates,
        last_updated: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Start workout - backward compatible with old API (dayName, exercises)
   * Also supports new API (weekNumber, day, exercises)
   */
  const startWorkout = useCallback((
    weekNumberOrDayName: number | string,
    dayOrExercises: number | any[],
    exercisesOptional?: any[]
  ) => {
    let weekNumber: number;
    let day: number;
    let exercises: any[];

    // Detect which API signature is being used
    if (typeof weekNumberOrDayName === 'string') {
      // Old API: startWorkout(dayName, exercises)
      const dayName = weekNumberOrDayName;
      exercises = dayOrExercises as any[];

      // Map day name to day number (assuming Monday=1, Sunday=7)
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      day = dayNames.indexOf(dayName);
      if (day === -1) day = 1; // Default to Monday if not found

      // Default week number to 1 for backward compatibility
      weekNumber = 1;

      console.log('[useAppState] Starting workout (old API):', { dayName, day, exerciseCount: exercises.length });
    } else {
      // New API: startWorkout(weekNumber, day, exercises)
      weekNumber = weekNumberOrDayName;
      day = dayOrExercises as number;
      exercises = exercisesOptional || [];

      console.log('[useAppState] Starting workout (new API):', { weekNumber, day, exerciseCount: exercises.length });
    }

    // Validate using WorkoutService
    const validation = WorkoutService.validateWorkoutStart(weekNumber, day);
    if (!validation.valid) {
      console.error('[useAppState] Workout validation failed:', validation.errors);
      // Don't throw - just log warning for backward compatibility
      console.warn('[useAppState] Continuing despite validation errors');
    }

    const workout = WorkoutService.createWorkout(weekNumber, day, exercises);

    setState(prev => ({
      ...prev,
      currentWorkout: workout,
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Complete current exercise and move to next
   */
  const completeExercise = useCallback(() => {
    setState(prev => {
      if (!prev.currentWorkout) {
        console.warn('[useAppState] No active workout to complete exercise');
        return prev;
      }

      const updatedWorkout = WorkoutService.completeExercise(prev.currentWorkout);

      console.log('[useAppState] Exercise completed:', {
        current: updatedWorkout.currentExerciseIndex,
        total: updatedWorkout.exercises.length
      });

      return {
        ...prev,
        currentWorkout: updatedWorkout,
        last_updated: new Date().toISOString()
      };
    });
  }, []);

  /**
   * Complete entire workout
   * Returns the new streak number for backward compatibility
   */
  const completeWorkout = useCallback(async (checkInData?: any) => {
    if (!state.currentWorkout) {
      console.warn('[useAppState] No active workout to complete');
      return 0;
    }

    console.log('[useAppState] Completing workout');

    const workoutLog = WorkoutService.createWorkoutLog(state.currentWorkout);

    // Add checkIn data if provided
    if (checkInData) {
      (workoutLog as any).checkIn = checkInData;
    }

    const updatedLogs = WorkoutService.addWorkoutLog(state.workoutLogs || [], workoutLog);

    // TODO: Call Edge Function for server-side streak validation
    // For now, keep client-side calculation but mark for migration
    const newStreak = calculateStreakClientSide(state.profile, workoutLog.date);

    setState(prev => ({
      ...prev,
      workoutLogs: updatedLogs,
      currentWorkout: undefined,
      profile: {
        ...prev.profile,
        streak: newStreak,
        lastWorkoutDate: workoutLog.date,
        last_updated: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    }));

    // Force immediate sync on workout completion
    if (user) {
      await SyncService.forceSync(user.id, {
        ...state,
        workoutLogs: updatedLogs,
        currentWorkout: undefined,
        profile: {
          ...state.profile,
          streak: newStreak,
          lastWorkoutDate: workoutLog.date
        }
      });
    }

    return newStreak; // Return for backward compatibility
  }, [state, user]);

  /**
   * Cancel workout
   */
  const cancelWorkout = useCallback(() => {
    console.log('[useAppState] Cancelling workout');

    setState(prev => ({
      ...prev,
      currentWorkout: undefined,
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Add custom exercise
   */
  const addCustomExercise = useCallback((exercise: CustomExercise) => {
    console.log('[useAppState] Adding custom exercise:', exercise.name);

    setState(prev => ({
      ...prev,
      customExercises: [...(prev.customExercises || []), exercise],
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Update energy mode
   */
  const updateEnergyMode = useCallback((mode: 'high' | 'low') => {
    console.log('[useAppState] Updating energy mode:', mode);

    setState(prev => ({
      ...prev,
      energyMode: mode,
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Check in (manual streak update)
   */
  const checkIn = useCallback(async () => {
    console.log('[useAppState] Manual check-in');

    const date = new Date().toISOString().split('T')[0];
    const hasToday = WorkoutService.hasWorkoutToday(state.workoutLogs || []);

    if (hasToday) {
      console.warn('[useAppState] Already checked in today');
      return;
    }

    const newLog: WorkoutLog = {
      date,
      completed: true,
      duration: 0,
      exercises: []
    };

    const updatedLogs = WorkoutService.addWorkoutLog(state.workoutLogs || [], newLog);
    const newStreak = calculateStreakClientSide(state.profile, date);

    setState(prev => ({
      ...prev,
      workoutLogs: updatedLogs,
      profile: {
        ...prev.profile,
        streak: newStreak,
        lastWorkoutDate: date,
        last_updated: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    }));
  }, [state]);

  /**
   * Toggle energy mode (deprecated - use updateEnergyMode)
   */
  const toggleEnergyMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      energyMode: prev.energyMode === 'high' ? 'low' : 'high',
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Get last weight used for an exercise
   */
  const getLastWeight = useCallback((exerciseId: string): number | undefined => {
    // Find most recent log that contains this exercise
    const logs = state.workoutLogs || [];
    for (const log of logs) {
      const exercise = log.exercises?.find((ex: any) => ex.exerciseId === exerciseId);
      if (exercise?.weight) {
        return exercise.weight;
      }
    }
    return undefined;
  }, [state.workoutLogs]);

  /**
   * Get completed days this week - returns Set of dates for backward compatibility
   */
  const getCompletedDaysThisWeek = useCallback((): Set<string> => {
    const logs = state.workoutLogs || [];
    const completedDates = logs
      .filter(log => log.completed)
      .map(log => log.date);
    return new Set(completedDates);
  }, [state.workoutLogs]);

  /**
   * Save custom exercise (deprecated - use addCustomExercise)
   */
  const saveCustomExercise = useCallback((exercise: CustomExercise) => {
    addCustomExercise(exercise);
  }, [addCustomExercise]);

  /**
   * Delete custom exercise
   */
  const deleteCustomExercise = useCallback((id: string) => {
    console.log('[useAppState] Deleting custom exercise:', id);
    setState(prev => ({
      ...prev,
      customExercises: (prev.customExercises || []).filter(ex => ex.id !== id),
      last_updated: new Date().toISOString()
    }));
  }, []);

  /**
   * Get all custom exercises
   */
  const getCustomExercises = useCallback((): CustomExercise[] => {
    return state.customExercises || [];
  }, [state.customExercises]);

  /**
   * Has workout today
   */
  const hasWorkoutToday = useCallback((): boolean => {
    return WorkoutService.hasWorkoutToday(state.workoutLogs || []);
  }, [state.workoutLogs]);

  /**
   * Clear all workout history (for testing/debugging)
   */
  const clearAllWorkoutHistory = useCallback(() => {
    console.warn('[useAppState] CLEARING ALL WORKOUT HISTORY');
    setState(prev => ({
      ...prev,
      workoutLogs: [],
      profile: {
        ...prev.profile,
        streak: 0,
        lastWorkoutDate: undefined,
        last_updated: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    }));
  }, []);

  return {
    state,
    isOnboarded,
    syncState,
    isSyncing: syncState.status === 'syncing',

    // Actions
    completeOnboarding,
    updateProfile,
    startWorkout,
    completeExercise,
    completeWorkout,
    cancelWorkout,
    addCustomExercise,
    updateEnergyMode,
    checkIn,

    // Deprecated/compatibility methods
    toggleEnergyMode,
    getLastWeight,
    getCompletedDaysThisWeek,
    saveCustomExercise,
    deleteCustomExercise,
    getCustomExercises,
    hasWorkoutToday,
    clearAllWorkoutHistory
  };
};

/**
 * Temporary client-side streak calculation
 * TODO: Replace with Edge Function call
 */
function calculateStreakClientSide(profile: UserProfile, newWorkoutDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  if (!profile.lastWorkoutDate) {
    return 1; // First workout
  }

  const lastDate = new Date(profile.lastWorkoutDate);
  lastDate.setHours(0, 0, 0, 0);
  const lastDateStr = lastDate.toISOString().split('T')[0];

  const newDate = new Date(newWorkoutDate);
  newDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((newDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    // Consecutive day - increment streak
    return (profile.streak || 0) + 1;
  } else if (daysDiff === 0 && lastDateStr === todayStr) {
    // Same day - keep streak
    return profile.streak || 1;
  } else {
    // Streak broken - start over
    return 1;
  }
}
