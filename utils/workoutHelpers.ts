import { WorkoutDay, Exercise, CustomExercise } from '../types';
import { WEEKLY_PLAN } from '../data/workoutPlan';

/**
 * Gets the workout plan with custom exercise replacements applied
 */
export const getWorkoutPlanWithCustomizations = (
    customExercises: CustomExercise[]
): WorkoutDay[] => {
    return WEEKLY_PLAN.map(day => {
        // Find custom exercises for this day
        const dayCustomExercises = customExercises.filter(ce => ce.dayName === day.day);

        if (dayCustomExercises.length === 0) {
            // No customizations for this day, return as-is
            return day;
        }

        // Replace exercises with custom ones
        const customizedExercises = day.exercises.map(exercise => {
            const customReplacement = dayCustomExercises.find(
                ce => ce.replacedExerciseId === exercise.id
            );

            if (customReplacement) {
                // Return the custom exercise
                return {
                    id: exercise.id, // Keep original ID for tracking
                    name: customReplacement.name,
                    videoUrl: customReplacement.videoUrl,
                    sets: customReplacement.sets,
                    reps: customReplacement.reps,
                    restSeconds: customReplacement.restSeconds,
                } as Exercise;
            }

            // Return original exercise
            return exercise;
        });

        return {
            ...day,
            exercises: customizedExercises
        };
    });
};

/**
 * Gets today's workout with customizations
 */
export const getTodaysCustomWorkout = (customExercises: CustomExercise[]): WorkoutDay | null => {
    const customizedPlan = getWorkoutPlanWithCustomizations(customExercises);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return customizedPlan.find(day => day.day === today) || null;
};

/**
 * Gets a specific day's workout with customizations
 */
export const getDayWorkout = (dayName: string, customExercises: CustomExercise[]): WorkoutDay | null => {
    const customizedPlan = getWorkoutPlanWithCustomizations(customExercises);
    return customizedPlan.find(day => day.day === dayName) || null;
};
