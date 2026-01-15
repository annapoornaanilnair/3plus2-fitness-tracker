import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { WorkoutDay, ExerciseLog, SetLog, EnergyMode } from '../types';
import { LOW_ENERGY_MODIFICATIONS } from '../data/workoutPlan';
import confetti from 'canvas-confetti';

interface WorkoutPlayerProps {
  workout: WorkoutDay;
  energyMode: EnergyMode;
  onComplete: (exercises: ExerciseLog[]) => void;
  onCancel: () => void;
  getLastWeight: (exerciseId: string) => number | undefined;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  workout,
  energyMode,
  onComplete,
  onCancel,
  getLastWeight
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  const currentExercise = workout.exercises[currentExerciseIndex];

  // Apply low energy modifications
  const getExerciseDetails = (exerciseId: string, originalSets: number, originalReps: number) => {
    if (energyMode === 'low' && LOW_ENERGY_MODIFICATIONS[exerciseId]) {
      const mod = LOW_ENERGY_MODIFICATIONS[exerciseId];
      return {
        sets: mod.sets || originalSets,
        reps: mod.reps || originalReps,
        note: mod.note
      };
    }
    return { sets: originalSets, reps: originalReps, note: undefined };
  };

  const exerciseDetails = currentExercise ? getExerciseDetails(
    currentExercise.id,
    currentExercise.sets,
    currentExercise.reps
  ) : { sets: 0, reps: 0, note: undefined };

  // Initialize exercise logs
  useEffect(() => {
    const logs: ExerciseLog[] = workout.exercises.map(ex => {
      const details = getExerciseDetails(ex.id, ex.sets, ex.reps);
      return {
        exerciseId: ex.id,
        weight: getLastWeight(ex.id) || 0,
        sets: Array(details.sets).fill({ completed: false, struggled: false })
      };
    });
    setExerciseLogs(logs);
  }, [workout, getLastWeight, energyMode]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;

    const interval = setInterval(() => {
      setRestTimer(prev => (prev && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer]);

  const currentLog = exerciseLogs[currentExerciseIndex];

  const toggleSet = (setIndex: number) => {
    if (!currentLog) return;

    const currentSet = currentLog.sets[setIndex];
    let newSet: SetLog;

    if (!currentSet.completed) {
      newSet = { completed: true, struggled: false };
    } else if (!currentSet.struggled) {
      newSet = { completed: true, struggled: true };
    } else {
      newSet = { completed: false, struggled: false };
    }

    const newLogs = [...exerciseLogs];
    newLogs[currentExerciseIndex].sets[setIndex] = newSet;
    setExerciseLogs(newLogs);

    // Start rest timer if set is completed
    if (newSet.completed && setIndex < currentExercise.sets - 1) {
      setRestTimer(currentExercise.restSeconds);
    }
  };

  const updateWeight = (weight: number) => {
    const newLogs = [...exerciseLogs];
    newLogs[currentExerciseIndex].weight = weight;
    setExerciseLogs(newLogs);
  };

  const goToNext = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setRestTimer(null);
    }
  };

  const goToPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setRestTimer(null);
    }
  };

  const finishWorkout = () => {
    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    setTimeout(() => {
      onComplete(exerciseLogs);
    }, 3000);
  };

  const allSetsCompleted = currentLog?.sets.every(set => set.completed);
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  if (!currentExercise || !currentLog) return null;

  return (
    <div className="fixed inset-0 bg-[#FDFBF7] z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onCancel} className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors">
            <X size={24} className="text-[#8A8A8A]" />
          </button>
          <div className="text-center">
            <h2
              className="text-xl text-[#4A4A4A]"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              {workout.focus}
            </h2>
            <p className="text-sm text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div>
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6"
            >
              {currentExercise.videoUrl ? (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${currentExercise.videoUrl}${currentExercise.videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
                    title={currentExercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-[#F5F1EB] flex items-center justify-center">
                  <div className="text-6xl">{workout.icon}</div>
                </div>
              )}
            </motion.div>

            <motion.h3
              key={`title-${currentExercise.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl mb-4 text-[#4A4A4A]"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
            >
              {currentExercise.name}
            </motion.h3>

            {/* Low Energy Mode Indicator */}
            {energyMode === 'low' && exerciseDetails.note && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#EDC4B3] rounded-2xl p-4 mb-4"
              >
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xl">🌙</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                      Low Energy Mode
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {exerciseDetails.note}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Logger Section */}
          <div>
            {/* Weight Input */}
            <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
              <label
                className="block text-sm mb-2 text-[#6A6A6A]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Weight (kg)
              </label>
              <input
                type="number"
                value={currentLog.weight || ''}
                onChange={(e) => updateWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F1EB] text-[#4A4A4A] text-xl text-center"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                step="0.5"
              />
            </div>

            {/* Sets Logger */}
            <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
              <h4
                className="text-lg mb-4 text-[#4A4A4A]"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                Sets & Reps
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {currentLog.sets.map((set, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSet(index)}
                    className={`aspect-square rounded-3xl flex flex-col items-center justify-center text-lg transition-all ${set.completed && set.struggled
                      ? 'bg-yellow-200 border-2 border-yellow-400'
                      : set.completed
                        ? 'bg-[#A3C9A8] text-white'
                        : 'bg-[#F5F1EB] text-[#8A8A8A] border-2 border-dashed border-[#C5E0C9]'
                      }`}
                  >
                    <div
                      className="text-3xl mb-1"
                      style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                    >
                      {set.completed ? '✓' : currentExercise.reps}
                    </div>
                    <div className="text-xs" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Set {index + 1}
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="mt-4 text-sm text-center text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Tap once: Done ✓ | Tap again: Struggled 💪
              </p>
            </div>

            {/* Rest Timer */}
            {restTimer !== null && restTimer > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#EDC4B3] rounded-3xl p-6 shadow-md mb-6 text-center"
              >
                <div
                  className="text-5xl mb-2 text-white"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  {restTimer}s
                </div>
                <div className="text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Rest time ☁️
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={goToPrevious}
                disabled={currentExerciseIndex === 0}
                className="flex-1 py-4 rounded-full bg-white text-[#8A8A8A] disabled:opacity-30 flex items-center justify-center gap-2 shadow-md"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              {isLastExercise && allSetsCompleted ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={finishWorkout}
                  className="flex-1 py-4 rounded-full bg-[#A3C9A8] text-white flex items-center justify-center gap-2 shadow-md"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Finish 🎉
                </motion.button>
              ) : (
                <button
                  onClick={goToNext}
                  disabled={currentExerciseIndex === workout.exercises.length - 1}
                  className="flex-1 py-4 rounded-full bg-[#A3C9A8] text-white disabled:opacity-30 flex items-center justify-center gap-2 shadow-md"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};