import { WorkoutDay, UserProfile } from '../types';

// Base workout plan (Mon-Fri)
const BASE_WORKOUTS: WorkoutDay[] = [
  {
    day: 'Monday',
    focus: 'Lower Body & Glutes',
    icon: '🍑',
    type: 'mandatory',
    exercises: [
      {
        id: 'goblet-squat',
        name: 'Dumbbell Goblet Squats',
        videoUrl: 'https://www.youtube.com/embed/MeIiIdhvXT4',
        sets: 3,
        reps: 12,
        restSeconds: 60
      },
      {
        id: 'romanian-deadlift',
        name: 'Dumbbell RDLs (Romanian Deadlifts)',
        videoUrl: 'https://www.youtube.com/embed/ScVe6I8RLKM',
        sets: 3,
        reps: 12,
        restSeconds: 60
      },
      {
        id: 'reverse-lunges',
        name: 'Reverse Lunges',
        videoUrl: 'https://www.youtube.com/embed/xXTArSKN8F0',
        sets: 3,
        reps: 10,
        restSeconds: 60
      },
      {
        id: 'plank',
        name: 'Plank',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
        sets: 3,
        reps: 45,
        restSeconds: 45
      }
    ]
  },
  {
    day: 'Tuesday',
    focus: 'Belly Fat Melt',
    icon: '🔥',
    type: 'bonus',
    exercises: [
      {
        id: 'incline-walking',
        name: 'Incline Walking',
        videoUrl: 'https://www.youtube.com/embed/1hN8pHZgETU',
        sets: 1,
        reps: 20,
        restSeconds: 0
      },
      {
        id: 'deadbugs',
        name: 'Deadbugs',
        videoUrl: 'https://www.youtube.com/embed/4XLEnwUr1d8',
        sets: 3,
        reps: 12,
        restSeconds: 45
      },
      {
        id: 'stomach-vacuums',
        name: 'Stomach Vacuums',
        videoUrl: 'https://www.youtube.com/embed/et4NUOrf7GM',
        sets: 4,
        reps: 15,
        restSeconds: 30
      },
      {
        id: 'russian-twists',
        name: 'Russian Twists',
        videoUrl: 'https://www.youtube.com/embed/wkD8rjkodUI',
        sets: 3,
        reps: 20,
        restSeconds: 45
      }
    ]
  },
  {
    day: 'Wednesday',
    focus: 'Upper Body & Posture',
    icon: '💪',
    type: 'mandatory',
    exercises: [
      {
        id: 'dumbbell-chest-press',
        name: 'Dumbbell Chest Press (Bench)',
        videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
        sets: 3,
        reps: 12,
        restSeconds: 60
      },
      {
        id: 'single-arm-row',
        name: 'Single-Arm Dumbbell Row',
        videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo',
        sets: 3,
        reps: 12,
        restSeconds: 60
      },
      {
        id: 'seated-overhead-press',
        name: 'Seated Overhead Press',
        videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
        sets: 3,
        reps: 10,
        restSeconds: 60
      },
      {
        id: 'face-pulls',
        name: 'Face Pulls (or Bent Over Flys)',
        videoUrl: 'https://www.youtube.com/embed/rep-qVOkqgk',
        sets: 3,
        reps: 15,
        restSeconds: 45
      }
    ]
  },
  {
    day: 'Thursday',
    focus: 'Active Recovery',
    icon: '🧘',
    type: 'bonus',
    exercises: [
      {
        id: 'easy-walk',
        name: '30-Minute Easy Walk on Treadmill',
        videoUrl: 'https://www.youtube.com/embed/5Vp-KhL_gVo',
        sets: 1,
        reps: 30,
        restSeconds: 0
      },
      {
        id: 'yoga-stretch',
        name: '15-Minute Yoga/Stretching Session',
        videoUrl: 'https://www.youtube.com/embed/v7AYKMP6rOE',
        sets: 1,
        reps: 15,
        restSeconds: 0
      }
    ]
  },
  {
    day: 'Friday',
    focus: 'Full Body Sweat',
    icon: '💦',
    type: 'mandatory',
    exercises: [
      {
        id: 'dumbbell-swings',
        name: 'Dumbbell Swings',
        videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8',
        sets: 3,
        reps: 15,
        restSeconds: 60
      },
      {
        id: 'db-bench-press',
        name: 'DB Bench Press',
        videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
        sets: 3,
        reps: 12,
        restSeconds: 60
      },
      {
        id: 'sumo-squats',
        name: 'Sumo Squats',
        videoUrl: 'https://www.youtube.com/embed/qKgt7VO0MsM',
        sets: 3,
        reps: 12,
        restSeconds: 60
      },
      {
        id: 'bicycle-crunches',
        name: 'Bicycle Crunches (10 per side)',
        videoUrl: 'https://www.youtube.com/embed/9FGilxCbdz8',
        sets: 3,
        reps: 20,
        restSeconds: 60
      }
    ]
  }
];

// Generate weekend activities based on user profile
export function getWeeklyPlan(profile?: UserProfile): WorkoutDay[] {
  const saturdayActivity: WorkoutDay = {
    day: 'Saturday',
    focus: profile?.saturdayActivity || 'Violin Class',
    icon: profile?.saturdayEmoji || '🎻',
    type: 'rest',
    exercises: []
  };

  const sundayActivity: WorkoutDay = {
    day: 'Sunday',
    focus: profile?.sundayActivity || 'Rest / Meal Prep',
    icon: profile?.sundayEmoji || '☁️',
    type: 'rest',
    exercises: []
  };

  return [...BASE_WORKOUTS, saturdayActivity, sundayActivity];
}

// Export backward compatible WEEKLY_PLAN for existing code
export const WEEKLY_PLAN: WorkoutDay[] = getWeeklyPlan();

// Low energy alternatives - lighter versions of exercises
export const LOW_ENERGY_MODIFICATIONS: Record<string, { sets?: number; reps?: number; note?: string }> = {
  // Monday - Lower Body & Glutes
  'goblet-squat': { sets: 2, reps: 10, note: 'Use half the weight' },
  'romanian-deadlift': { sets: 2, reps: 10, note: 'Reduce weight by 50%' },
  'reverse-lunges': { sets: 2, reps: 8, note: 'Bodyweight only if needed' },
  'plank': { sets: 2, reps: 30, note: 'Hold for shorter time' },

  // Wednesday - Upper Body & Posture
  'dumbbell-chest-press': { sets: 2, reps: 10, note: 'Use half the weight' },
  'single-arm-row': { sets: 2, reps: 10, note: 'Lighter dumbbells' },
  'seated-overhead-press': { sets: 2, reps: 8, note: 'Lighter dumbbells' },
  'face-pulls': { sets: 2, reps: 12, note: 'Lighter resistance' },

  // Friday - Full Body Sweat
  'step-ups': { sets: 2, reps: 10, note: 'Slower pace' },
  'pushups': { sets: 2, reps: 8, note: 'On knees is perfectly fine' },
  'dumbbell-thrusters': { sets: 2, reps: 8, note: 'Use half the weight' },
  'glute-bridges': { sets: 2, reps: 15, note: 'Bodyweight only' },

  // Bonus days - can skip entirely in low energy mode or do gentle versions
  'incline-walking': { sets: 1, reps: 15, note: 'Reduce time to 15 min or lower incline' },
  'deadbugs': { sets: 2, reps: 10, note: 'Slower pace' },
  'stomach-vacuums': { sets: 3, reps: 10, note: 'Hold for 10 seconds' },
  'russian-twists': { sets: 2, reps: 15, note: 'Slower pace' },
  'easy-walk': { sets: 1, reps: 20, note: 'Reduce to 20 minutes' },
  'yoga-stretch': { sets: 1, reps: 10, note: 'Reduce to 10 minutes' }
};

export const getDayOfWeek = (date: Date = new Date()): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

export const getTodaysWorkout = (date: Date = new Date()): WorkoutDay | undefined => {
  const today = getDayOfWeek(date);
  return WEEKLY_PLAN.find(day => day.day === today);
};