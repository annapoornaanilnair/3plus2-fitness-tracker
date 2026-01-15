export type EnergyMode = 'high' | 'low';

export type DayType = 'mandatory' | 'bonus' | 'rest';

export interface WorkoutDay {
  day: string;
  focus: string;
  icon: string;
  type: DayType;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  videoUrl?: string;
  sets: number;
  reps: number;
  restSeconds: number;
}

export interface SetLog {
  completed: boolean;
  struggled?: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  weight?: number;
  sets: SetLog[];
  notes?: string;
}

export interface WorkoutLog {
  date: string;
  dayName: string;
  exercises: ExerciseLog[];
  completed: boolean;
  checkIn?: DailyCheckIn;
}

export interface DailyCheckIn {
  mood: number; // 1-10
  energy: number; // 1-10
  timestamp: string;
}

export interface UserProfile {
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  equipment: string[];
  notificationTime?: string;
  creativeNotes?: string;
  streak?: number;
  lastWorkoutDate?: string;
}

export interface CustomExercise {
  id: string;
  dayName: string;
  replacedExerciseId: string;
  name: string;
  videoUrl: string;
  sets: number;
  reps: number;
  restSeconds: number;
  createdAt: string;
  userId?: string;
}

export interface AppState {
  energyMode: EnergyMode;
  workoutLogs: WorkoutLog[];
  profile: UserProfile;
  customExercises: CustomExercise[];
  currentWorkout?: {
    dayName: string;
    exercises: ExerciseLog[];
    currentExerciseIndex: number;
  };
}
