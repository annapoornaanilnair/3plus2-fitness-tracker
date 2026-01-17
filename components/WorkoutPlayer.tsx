import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { WorkoutDay, ExerciseLog, SetLog, EnergyMode } from '../types';
import { LOW_ENERGY_MODIFICATIONS } from '../data/workoutPlan';
import { getRandomMessage } from '../data/lowEnergyMessages';
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

  // Calculate exercise progress
  const completedExercises = exerciseLogs.filter((log) =>
    log.sets.every(set => set.completed)
  ).length;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] z-50 overflow-y-auto">
      {/* Professional Header */}
      <div className="bg-white/60 backdrop-blur-xl shadow-soft sticky top-0 z-10 border-b border-sage/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Top Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors"
            >
              <X size={24} className="text-[#8A8A8A]" />
            </button>
            <div className="text-center flex-1">
              <h1
                className="text-2xl font-bold text-[#4A4A4A]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {workout.day} {workout.icon}
              </h1>
              <p
                className="text-sm text-[#8A8A8A] mt-1"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {workout.focus}
              </p>
            </div>
            <div className="w-10" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p
                className="text-sm font-semibold text-[#6A6A6A]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Progress: {currentExerciseIndex + 1} / {workout.exercises.length} Exercises
              </p>
              <p
                className="text-sm text-[#A3C9A8] font-bold"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {completedExercises} Completed
              </p>
            </div>
            <div className="w-full bg-[#F0EDE8] rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#A3C9A8] to-[#82A885] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Low Energy Start Message */}
          {energyMode === 'low' && currentExerciseIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 bg-gradient-to-r from-[#F5DEB3] to-[#FFE4B5] rounded-2xl p-4 border border-[#D4A574]"
            >
              <p className="text-sm text-center text-[#8B6F47]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {getRandomMessage('start')}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video & Details Section (Left - 2 cols) */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6"
            >
              {currentExercise.videoUrl ? (
                <div className="aspect-video bg-black">
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
                <div className="aspect-video bg-gradient-to-br from-[#F5F1EB] to-[#E8E4DE] flex items-center justify-center">
                  <div className="text-8xl">{workout.icon}</div>
                </div>
              )}
            </motion.div>

            {/* Exercise Name & Details */}
            <motion.div
              key={`title-${currentExercise.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2
                className="text-3xl font-bold mb-4 text-[#4A4A4A]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {currentExercise.name}
              </h2>

              {/* Exercise Specs Card */}
              <div className="bg-white rounded-3xl p-6 shadow-md grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div
                    className="text-3xl font-bold text-[#A3C9A8] mb-1"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {exerciseDetails.sets}
                  </div>
                  <p
                    className="text-sm text-[#8A8A8A]"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    Sets
                  </p>
                </div>
                <div className="text-center border-l border-r border-[#E8E4DE]">
                  <div
                    className="text-3xl font-bold text-[#A3C9A8] mb-1"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {exerciseDetails.reps}
                  </div>
                  <p
                    className="text-sm text-[#8A8A8A]"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    Reps
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold text-[#EDC4B3] mb-1"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {currentExercise.restSeconds}s
                  </div>
                  <p
                    className="text-sm text-[#8A8A8A]"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    Rest
                  </p>
                </div>
              </div>

              {/* Low Energy Mode Indicator */}
              {energyMode === 'low' && exerciseDetails.note && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-[#EDC4B3] to-[#D4A59A] rounded-3xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-3xl">🌙</span>
                    <div className="flex-1">
                      <p
                        className="font-bold text-sm"
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        Low Energy Mode
                      </p>
                      <p
                        className="text-xs mt-1 leading-relaxed"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        {exerciseDetails.note}
                      </p>
                      <p
                        className="text-xs mt-2 italic opacity-90"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        ✨ {getRandomMessage('modifications')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Logger Section (Right - 1 col) */}
          {/* Logger Section (Right - 1 col) */}
          <div className="lg:col-span-1">
            {/* Weight Input - Now much more prominent */}
            <div className="bg-gradient-to-br from-white to-[#FDFBF7] rounded-3xl p-6 shadow-md mb-6 border-2 border-[#A3C9A8]">
              <label
                className="block text-sm font-bold mb-3 text-[#4A4A4A]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Weight Used (kg)
              </label>
              <input
                type="number"
                value={currentLog.weight || ''}
                onChange={(e) => updateWeight(parseFloat(e.target.value) || 0)}
                placeholder="Enter weight..."
                className="w-full px-4 py-4 rounded-2xl bg-[#F5F1EB] text-[#4A4A4A] text-2xl text-center font-bold border-2 border-[#E8E4DE] focus:border-[#A3C9A8] focus:outline-none transition-colors"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                step="0.5"
              />
              {(currentLog.weight && currentLog.weight > 0) && (
                <p
                  className="mt-2 text-xs text-[#8A8A8A] text-center"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Last time: {getLastWeight(currentExercise.id) || 'N/A'} kg
                </p>
              )}
            </div>

            {/* Sets Logger - Professional Grid */}
            <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
              <h4
                className="text-lg font-bold mb-4 text-[#4A4A4A]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Mark Sets Complete
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {currentLog.sets.map((set, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleSet(index)}
                    className={`aspect-square rounded-3xl flex flex-col items-center justify-center font-bold text-lg transition-all shadow-sm ${set.completed && set.struggled
                        ? 'bg-yellow-300 border-2 border-yellow-400 text-[#4A4A4A]'
                        : set.completed
                          ? 'bg-gradient-to-br from-[#A3C9A8] to-[#82A885] text-white border-2 border-[#7A9E7D]'
                          : 'bg-[#F5F1EB] text-[#8A8A8A] border-2 border-[#D5D0CA] hover:border-[#A3C9A8]'
                      }`}
                  >
                    <div
                      className="text-2xl mb-1"
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {set.completed && set.struggled ? '💪' : set.completed ? '✓' : 'Set'}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {index + 1}
                    </div>
                  </motion.button>
                ))}
              </div>
              <p
                className="text-xs text-center text-[#8A8A8A]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Tap: Done ✓ | Tap Again: Struggled 💪 | Tap Once More: Reset
              </p>
            </div>

            {/* Rest Timer - More Prominent */}
            {restTimer !== null && restTimer > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#EDC4B3] to-[#D4A59A] rounded-3xl p-6 shadow-lg mb-6 text-center border-2 border-[#C9916E]"
              >
                <p
                  className="text-white text-sm font-bold mb-2"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Rest Time
                </p>
                <div
                  className="text-6xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {restTimer}
                </div>
                <p
                  className="text-white text-lg"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  seconds
                </p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPrevious}
                disabled={currentExerciseIndex === 0}
                className="flex-1 py-4 rounded-full bg-white text-[#8A8A8A] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md border-2 border-[#E8E4DE] font-bold transition-all hover:border-[#8A8A8A]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                <ChevronLeft size={20} />
                Previous
              </motion.button>

              {isLastExercise && allSetsCompleted ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={finishWorkout}
                  className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#A3C9A8] to-[#82A885] text-white flex items-center justify-center gap-2 shadow-lg font-bold text-lg transition-all"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Finish Workout 🎉
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNext}
                  disabled={currentExerciseIndex === workout.exercises.length - 1}
                  className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#A3C9A8] to-[#82A885] text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md font-bold transition-all"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  Next Exercise
                  <ChevronRight size={20} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};