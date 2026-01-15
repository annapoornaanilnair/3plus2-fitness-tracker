import React, { useState } from 'react';
import { WorkoutDay, Exercise, CustomExercise } from '../types';
import { WEEKLY_PLAN } from '../data/workoutPlan';
import { validateYouTubeUrl } from '../utils/youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { motion, AnimatePresence } from 'motion/react';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from './ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { ArrowLeft, Youtube, CheckCircle, AlertCircle, Trash2, Sparkles, Dumbbell } from 'lucide-react';

type Step = 'select-day' | 'select-exercise' | 'enter-details' | 'confirm';

interface Props {
    customExercises: CustomExercise[];
    onSaveCustomExercise: (customExercise: CustomExercise) => void;
    onDeleteCustomExercise: (dayName: string, replacedExerciseId: string) => void;
    onBack: () => void;
}

export const WorkoutCustomization: React.FC<Props> = ({
    customExercises,
    onSaveCustomExercise,
    onDeleteCustomExercise,
    onBack,
}) => {
    const [step, setStep] = useState<Step>('select-day');
    const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [exerciseName, setExerciseName] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [sets, setSets] = useState('3');
    const [reps, setReps] = useState('12');
    const [restSeconds, setRestSeconds] = useState('60');
    const [urlValidation, setUrlValidation] = useState<{ valid: boolean; embedUrl: string | null; error?: string } | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState<{ dayName: string; exerciseId: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDaySelect = (day: WorkoutDay) => {
        setSelectedDay(day);
        setStep('select-exercise');
        setError(null);
    };

    const handleExerciseSelect = (exercise: Exercise) => {
        setSelectedExercise(exercise);

        // Pre-fill with existing custom exercise if it exists
        const existingCustom = customExercises.find(
            ce => ce.dayName === selectedDay?.day && ce.replacedExerciseId === exercise.id
        );

        if (existingCustom) {
            setExerciseName(existingCustom.name);
            setYoutubeUrl(existingCustom.videoUrl);
            setSets(existingCustom.sets.toString());
            setReps(existingCustom.reps.toString());
            setRestSeconds(existingCustom.restSeconds.toString());
        } else {
            // Pre-fill with original exercise details
            setExerciseName(exercise.name);
            setYoutubeUrl(exercise.videoUrl || '');
            setSets(exercise.sets.toString());
            setReps(exercise.reps.toString());
            setRestSeconds(exercise.restSeconds.toString());
        }

        setStep('enter-details');
        setError(null);
    };

    const handleUrlChange = (url: string) => {
        setYoutubeUrl(url);

        if (url.trim()) {
            const validation = validateYouTubeUrl(url);
            setUrlValidation(validation);
        } else {
            setUrlValidation(null);
        }
    };

    const handleValidateAndProceed = () => {
        setError(null);

        // Validate all fields
        if (!exerciseName.trim()) {
            setError('Please enter an exercise name');
            return;
        }

        if (!youtubeUrl.trim()) {
            setError('Please enter a YouTube URL');
            return;
        }

        const validation = validateYouTubeUrl(youtubeUrl);
        if (!validation.valid) {
            setError(validation.error || 'Invalid YouTube URL');
            return;
        }

        const setsNum = parseInt(sets);
        const repsNum = parseInt(reps);
        const restNum = parseInt(restSeconds);

        if (isNaN(setsNum) || setsNum < 1 || setsNum > 10) {
            setError('Sets must be between 1 and 10');
            return;
        }

        if (isNaN(repsNum) || repsNum < 1 || repsNum > 100) {
            setError('Reps must be between 1 and 100');
            return;
        }

        if (isNaN(restNum) || restNum < 0 || restNum > 600) {
            setError('Rest seconds must be between 0 and 600');
            return;
        }

        setUrlValidation(validation);
        setShowConfirmDialog(true);
    };

    const handleConfirmSave = () => {
        if (!selectedDay || !selectedExercise || !urlValidation?.embedUrl) return;

        const customExercise: CustomExercise = {
            id: `custom-${selectedDay.day}-${selectedExercise.id}-${Date.now()}`,
            dayName: selectedDay.day,
            replacedExerciseId: selectedExercise.id,
            name: exerciseName.trim(),
            videoUrl: urlValidation.embedUrl,
            sets: parseInt(sets),
            reps: parseInt(reps),
            restSeconds: parseInt(restSeconds),
            createdAt: new Date().toISOString(),
        };

        onSaveCustomExercise(customExercise);
        setShowConfirmDialog(false);

        // Reset and go back to day selection
        resetForm();
        setStep('select-day');
    };

    const resetForm = () => {
        setSelectedDay(null);
        setSelectedExercise(null);
        setExerciseName('');
        setYoutubeUrl('');
        setSets('3');
        setReps('12');
        setRestSeconds('60');
        setUrlValidation(null);
        setError(null);
    };

    const handleBack = () => {
        if (step === 'select-day') {
            onBack();
        } else if (step === 'select-exercise') {
            setStep('select-day');
            setSelectedDay(null);
        } else if (step === 'enter-details') {
            setStep('select-exercise');
            setSelectedExercise(null);
            resetForm();
        }
    };

    const handleDeleteCustomExercise = (dayName: string, exerciseId: string) => {
        setExerciseToDelete({ dayName, exerciseId });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (exerciseToDelete) {
            onDeleteCustomExercise(exerciseToDelete.dayName, exerciseToDelete.exerciseId);
            setShowDeleteDialog(false);
            setExerciseToDelete(null);
        }
    };

    const getCustomExerciseForOriginal = (dayName: string, exerciseId: string) => {
        return customExercises.find(
            ce => ce.dayName === dayName && ce.replacedExerciseId === exerciseId
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F5F1EB] to-[#FFE8E0] p-4 md:p-6 relative overflow-x-hidden">
            {/* Animated background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-10 md:right-20 text-3xl md:text-4xl opacity-10"
                >
                    💪
                </motion.div>
                <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-40 left-10 md:left-16 text-4xl md:text-5xl opacity-10"
                >
                    ✨
                </motion.div>
                <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 right-10 md:right-32 text-3xl md:text-4xl opacity-10"
                >
                    🎯
                </motion.div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 relative z-10 pb-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 md:gap-4 bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-lg"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2 hover:bg-[#A3C9A8]/20 transition-colors flex-shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3">
                            <Dumbbell className="h-5 w-5 md:h-7 md:w-7 text-[#A3C9A8] flex-shrink-0" />
                            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-[#A3C9A8] to-[#EDC4B3] bg-clip-text text-transparent truncate">
                                Customize Workouts
                            </h1>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 ml-7 md:ml-10 line-clamp-1">Replace exercises with your own favorites</p>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Select Day */}
                    {step === 'select-day' && (
                        <motion.div
                            key="select-day"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-white/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Sparkles className="h-6 w-6 text-[#A3C9A8]" />
                                        Step 1: Choose a Day
                                    </CardTitle>
                                    <CardDescription className="text-base">Select which day's workout you want to customize</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {WEEKLY_PLAN.map((day, index) => {
                                        const customCount = customExercises.filter(ce => ce.dayName === day.day).length;
                                        return (
                                            <motion.button
                                                key={day.day}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleDaySelect(day)}
                                                className="w-full p-5 border-2 rounded-2xl hover:border-[#A3C9A8] hover:shadow-lg transition-all text-left bg-gradient-to-br from-white to-[#FDFBF7]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <motion.span
                                                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                            transition={{ duration: 0.5 }}
                                                            className="text-4xl"
                                                        >
                                                            {day.icon}
                                                        </motion.span>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-[#4A4A4A]">{day.day}</h3>
                                                            <p className="text-sm text-gray-600">{day.focus}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${day.type === 'mandatory' ? 'bg-gradient-to-r from-[#A3C9A8] to-[#8BB58F] text-white' :
                                                            day.type === 'bonus' ? 'bg-gradient-to-r from-[#EDC4B3] to-[#D4A59A] text-white' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {day.type}
                                                        </span>
                                                        {customCount > 0 && (
                                                            <motion.p
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="text-xs text-[#A3C9A8] font-semibold mt-2 flex items-center gap-1 justify-end"
                                                            >
                                                                <CheckCircle className="h-3 w-3" />
                                                                {customCount} customized
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2: Select Exercise */}
                    {step === 'select-exercise' && selectedDay && (
                        <motion.div
                            key="select-exercise"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-white/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <motion.span
                                            animate={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 0.5 }}
                                            className="text-3xl"
                                        >
                                            {selectedDay.icon}
                                        </motion.span>
                                        Step 2: Choose Exercise to Replace
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {selectedDay.day} - {selectedDay.focus}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {selectedDay.exercises.map((exercise, index) => {
                                        const customExercise = getCustomExerciseForOriginal(selectedDay.day, exercise.id);
                                        const isCustomized = !!customExercise;

                                        return (
                                            <motion.div
                                                key={exercise.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.01, y: -2 }}
                                                className="p-5 border-2 rounded-2xl bg-gradient-to-br from-white to-[#FDFBF7] hover:border-[#A3C9A8] hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-lg text-[#4A4A4A]">
                                                            {isCustomized ? customExercise.name : exercise.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {isCustomized ? customExercise.sets : exercise.sets} sets × {isCustomized ? customExercise.reps : exercise.reps} reps
                                                        </p>
                                                        {isCustomized && (
                                                            <motion.p
                                                                initial={{ scale: 0, x: -10 }}
                                                                animate={{ scale: 1, x: 0 }}
                                                                className="text-xs text-[#A3C9A8] font-semibold mt-2 flex items-center gap-1"
                                                            >
                                                                <CheckCircle className="h-3 w-3" />
                                                                Customized by you
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleExerciseSelect(exercise)}
                                                            className="bg-gradient-to-r from-[#A3C9A8] to-[#8BB58F] hover:from-[#8BB58F] hover:to-[#A3C9A8]"
                                                        >
                                                            {isCustomized ? 'Edit' : 'Replace'}
                                                        </Button>
                                                        {isCustomized && (
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleDeleteCustomExercise(selectedDay.day, exercise.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 3: Enter Details */}
                    {step === 'enter-details' && selectedExercise && (
                        <motion.div
                            key="enter-details"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-white/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Youtube className="h-6 w-6 text-[#EDC4B3]" />
                                        Step 3: Enter Exercise Details
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Replacing: <span className="font-semibold text-gray-700">{selectedExercise.name}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="exercise-name" className="text-base font-semibold">Exercise Name *</Label>
                                        <Input
                                            id="exercise-name"
                                            placeholder="e.g., Barbell Squat"
                                            value={exerciseName}
                                            onChange={(e) => setExerciseName(e.target.value)}
                                            className="text-lg p-6 rounded-xl border-2 focus:border-[#A3C9A8]"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="youtube-url" className="text-base font-semibold flex items-center gap-2">
                                            <Youtube className="h-4 w-4 text-red-500" />
                                            YouTube Video URL *
                                        </Label>
                                        <Input
                                            id="youtube-url"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={youtubeUrl}
                                            onChange={(e) => handleUrlChange(e.target.value)}
                                            className="text-base p-6 rounded-xl border-2 focus:border-[#A3C9A8]"
                                        />
                                        {urlValidation && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`text-sm flex items-center gap-2 p-3 rounded-lg ${urlValidation.valid
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {urlValidation.valid ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4" />
                                                        Valid YouTube URL ✨
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-4 w-4" />
                                                        {urlValidation.error}
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                        {urlValidation?.valid && urlValidation.embedUrl && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="mt-3 border-2 border-[#A3C9A8] rounded-2xl overflow-hidden shadow-lg"
                                            >
                                                <iframe
                                                    src={urlValidation.embedUrl}
                                                    className="w-full aspect-video"
                                                    allowFullScreen
                                                    title="YouTube Preview"
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="sets" className="text-sm font-semibold">Sets *</Label>
                                            <Input
                                                id="sets"
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={sets}
                                                onChange={(e) => setSets(e.target.value)}
                                                className="text-center text-xl font-bold p-4 rounded-xl border-2 focus:border-[#A3C9A8]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reps" className="text-sm font-semibold">Reps *</Label>
                                            <Input
                                                id="reps"
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={reps}
                                                onChange={(e) => setReps(e.target.value)}
                                                className="text-center text-xl font-bold p-4 rounded-xl border-2 focus:border-[#A3C9A8]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="rest" className="text-sm font-semibold">Rest (sec) *</Label>
                                            <Input
                                                id="rest"
                                                type="number"
                                                min="0"
                                                max="600"
                                                value={restSeconds}
                                                onChange={(e) => setRestSeconds(e.target.value)}
                                                className="text-center text-xl font-bold p-4 rounded-xl border-2 focus:border-[#A3C9A8]"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            onClick={handleValidateAndProceed}
                                            className="w-full bg-gradient-to-r from-[#A3C9A8] to-[#8BB58F] hover:from-[#8BB58F] hover:to-[#A3C9A8] text-white font-bold shadow-lg"
                                            size="lg"
                                        >
                                            <Sparkles className="h-5 w-5 mr-2" />
                                            Review & Confirm
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Confirmation Dialog */}
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Exercise Replacement</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                                <p>You are about to replace:</p>
                                <div className="bg-red-50 p-3 rounded border border-red-200">
                                    <p className="font-semibold text-red-900">{selectedExercise?.name}</p>
                                </div>
                                <p>With:</p>
                                <div className="bg-green-50 p-3 rounded border border-green-200">
                                    <p className="font-semibold text-green-900">{exerciseName}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {sets} sets × {reps} reps · {restSeconds}s rest
                                    </p>
                                </div>
                                <p className="text-sm">This change will apply to all future workouts on {selectedDay?.day}.</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmSave}>
                                Confirm Replacement
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Restore Original Exercise?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove your customization and restore the original default exercise. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setExerciseToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                                Restore Original
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};
