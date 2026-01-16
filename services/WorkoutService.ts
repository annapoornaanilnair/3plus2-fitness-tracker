/**
 * WorkoutService - Business logic for workout operations
 * 
 * Responsibilities:
 * - Workout validation and state transitions
 * - Exercise progression logic
 * - Workout completion calculations
 * - Rest timer management
 * 
 * @follows Single Responsibility Principle
 */

import { WorkoutLog, CurrentWorkout } from '../types';

export interface WorkoutValidation {
    valid: boolean;
    errors: string[];
}

class WorkoutServiceClass {
    /**
     * Validate workout state before starting
     */
    validateWorkoutStart(weekNumber: number, day: number): WorkoutValidation {
        const errors: string[] = [];

        if (weekNumber < 1 || weekNumber > 12) {
            errors.push(`Invalid week number: ${weekNumber}. Must be 1-12.`);
        }

        if (day < 1 || day > 7) {
            errors.push(`Invalid day number: ${day}. Must be 1-7.`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Create initial workout state
     */
    createWorkout(weekNumber: number, day: number, exercises: any[]): CurrentWorkout {
        return {
            weekNumber,
            day,
            startTime: new Date().toISOString(),
            exercises,
            currentExerciseIndex: 0,
            completedExercises: []
        };
    }

    /**
     * Mark exercise as complete and move to next
     */
    completeExercise(workout: CurrentWorkout): CurrentWorkout {
        const currentExercise = workout.exercises[workout.currentExerciseIndex];

        if (!currentExercise) {
            console.warn('[WorkoutService] No current exercise to complete');
            return workout;
        }

        return {
            ...workout,
            completedExercises: [
                ...workout.completedExercises,
                {
                    ...currentExercise,
                    completedAt: new Date().toISOString()
                }
            ],
            currentExerciseIndex: workout.currentExerciseIndex + 1
        };
    }

    /**
     * Check if workout is complete
     */
    isWorkoutComplete(workout: CurrentWorkout): boolean {
        return workout.currentExerciseIndex >= workout.exercises.length;
    }

    /**
     * Calculate workout duration
     */
    getWorkoutDuration(workout: CurrentWorkout): number {
        const start = new Date(workout.startTime).getTime();
        const end = Date.now();
        return Math.floor((end - start) / 1000); // seconds
    }

    /**
     * Create workout log from completed workout
     */
    createWorkoutLog(workout: CurrentWorkout): WorkoutLog {
        const duration = this.getWorkoutDuration(workout);

        return {
            weekNumber: workout.weekNumber,
            day: workout.day,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            completed: true,
            duration,
            exercises: workout.completedExercises.map((ex: any) => ({
                reps: ex.reps,
                rest: ex.rest,
                completedAt: ex.completedAt || new Date().toISOString()
            }))
        };
    }

    /**
     * Check if workout already logged for today
     */
    hasWorkoutToday(workoutLogs: WorkoutLog[]): boolean {
        const today = new Date().toISOString().split('T')[0];
        return workoutLogs.some(log => log.date === today);
    }

    /**
     * Get workout log for specific date
     */
    getWorkoutByDate(workoutLogs: WorkoutLog[], date: string): WorkoutLog | undefined {
        return workoutLogs.find(log => log.date === date);
    }

    /**
     * Add workout log to history (prevents duplicates by date)
     */
    addWorkoutLog(currentLogs: WorkoutLog[], newLog: WorkoutLog): WorkoutLog[] {
        // Remove any existing log for the same date
        const filtered = currentLogs.filter(log => log.date !== newLog.date);

        // Add new log and sort by date (newest first)
        return [...filtered, newLog].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    /**
     * Get workout statistics
     */
    getWorkoutStats(workoutLogs: WorkoutLog[]): {
        totalWorkouts: number;
        totalDuration: number;
        averageDuration: number;
        currentWeek: number;
    } {
        const totalWorkouts = workoutLogs.filter(log => log.completed).length;
        const totalDuration = workoutLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
        const averageDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

        // Get most recent workout week
        const currentWeek = workoutLogs.length > 0 ? (workoutLogs[0].weekNumber || 1) : 1;
        return {
            totalWorkouts,
            totalDuration,
            averageDuration: Math.floor(averageDuration),
            currentWeek
        };
    }

    /**
     * Determine if it's a rest day based on week plan
     */
    isRestDay(_weekNumber: number, day: number): boolean {
        // Days 4 and 7 are rest days in the 3+2 program
        return day === 4 || day === 7;
    }

    /**
     * Get next workout day
     */
    getNextWorkoutDay(currentWeek: number, currentDay: number): { week: number; day: number } {
        let nextDay = currentDay + 1;
        let nextWeek = currentWeek;

        // Skip rest days
        while (this.isRestDay(nextWeek, nextDay)) {
            nextDay++;
        }

        // Roll over to next week if needed
        if (nextDay > 7) {
            nextWeek = currentWeek < 12 ? currentWeek + 1 : 1;
            nextDay = 1;
        }

        return { week: nextWeek, day: nextDay };
    }

    /**
     * Validate workout state integrity
     */
    validateWorkoutState(state: CurrentWorkout | null): WorkoutValidation {
        const errors: string[] = [];

        if (!state) {
            return { valid: true, errors: [] };
        }

        if (!state.startTime) {
            errors.push('Workout missing start time');
        }

        if (!state.exercises || state.exercises.length === 0) {
            errors.push('Workout has no exercises');
        }

        if (state.currentExerciseIndex < 0) {
            errors.push('Invalid exercise index');
        }

        if (state.currentExerciseIndex > state.exercises.length) {
            errors.push('Exercise index out of bounds');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Singleton instance
export const WorkoutService = new WorkoutServiceClass();
