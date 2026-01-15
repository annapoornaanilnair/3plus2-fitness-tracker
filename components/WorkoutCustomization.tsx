import React, { useState } from 'react';
import { WorkoutDay, Exercise, CustomExercise } from '../types';
import { WEEKLY_PLAN } from '../data/workoutPlan';
import { validateYouTubeUrl } from '../utils/youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
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
import { ArrowLeft, Youtube, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-[#F5F3EE] to-[#E8E5D8] p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#3A3A3A]">Customize Workouts</h1>
                        <p className="text-sm text-gray-600">Replace exercises with your own favorites</p>
                    </div>
                </div>

                {/* Step 1: Select Day */}
                {step === 'select-day' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Choose a Day</CardTitle>
                            <CardDescription>Select which day's workout you want to customize</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {WEEKLY_PLAN.map((day) => {
                                const customCount = customExercises.filter(ce => ce.dayName === day.day).length;
                                return (
                                    <button
                                        key={day.day}
                                        onClick={() => handleDaySelect(day)}
                                        className="w-full p-4 border-2 rounded-lg hover:border-[#A8B5A0] transition-all text-left bg-white"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{day.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{day.day}</h3>
                                                    <p className="text-sm text-gray-600">{day.focus}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded-full ${day.type === 'mandatory' ? 'bg-green-100 text-green-700' :
                                                    day.type === 'bonus' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {day.type}
                                                </span>
                                                {customCount > 0 && (
                                                    <p className="text-xs text-[#A8B5A0] mt-1">
                                                        {customCount} customized
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Select Exercise */}
                {step === 'select-exercise' && selectedDay && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Choose Exercise to Replace</CardTitle>
                            <CardDescription>
                                {selectedDay.day} - {selectedDay.focus}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedDay.exercises.map((exercise) => {
                                const customExercise = getCustomExerciseForOriginal(selectedDay.day, exercise.id);
                                const isCustomized = !!customExercise;

                                return (
                                    <div
                                        key={exercise.id}
                                        className="p-4 border-2 rounded-lg bg-white hover:border-[#A8B5A0] transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold">
                                                    {isCustomized ? customExercise.name : exercise.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {isCustomized ? customExercise.sets : exercise.sets} sets × {isCustomized ? customExercise.reps : exercise.reps} reps
                                                </p>
                                                {isCustomized && (
                                                    <p className="text-xs text-[#A8B5A0] mt-1 flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Customized
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleExerciseSelect(exercise)}
                                                >
                                                    {isCustomized ? 'Edit' : 'Replace'}
                                                </Button>
                                                {isCustomized && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteCustomExercise(selectedDay.day, exercise.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Enter Details */}
                {step === 'enter-details' && selectedExercise && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 3: Enter Exercise Details</CardTitle>
                            <CardDescription>
                                Replacing: {selectedExercise.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="exercise-name">Exercise Name *</Label>
                                <Input
                                    id="exercise-name"
                                    placeholder="e.g., Barbell Squat"
                                    value={exerciseName}
                                    onChange={(e) => setExerciseName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="youtube-url">YouTube Video URL *</Label>
                                <Input
                                    id="youtube-url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={youtubeUrl}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                />
                                {urlValidation && (
                                    <div className={`text-sm flex items-center gap-2 ${urlValidation.valid ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {urlValidation.valid ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Valid YouTube URL
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="h-4 w-4" />
                                                {urlValidation.error}
                                            </>
                                        )}
                                    </div>
                                )}
                                {urlValidation?.valid && urlValidation.embedUrl && (
                                    <div className="mt-2 border rounded-lg overflow-hidden">
                                        <iframe
                                            src={urlValidation.embedUrl}
                                            className="w-full aspect-video"
                                            allowFullScreen
                                            title="YouTube Preview"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sets">Sets *</Label>
                                    <Input
                                        id="sets"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={sets}
                                        onChange={(e) => setSets(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reps">Reps *</Label>
                                    <Input
                                        id="reps"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={reps}
                                        onChange={(e) => setReps(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rest">Rest (sec) *</Label>
                                    <Input
                                        id="rest"
                                        type="number"
                                        min="0"
                                        max="600"
                                        value={restSeconds}
                                        onChange={(e) => setRestSeconds(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleValidateAndProceed}
                                className="w-full"
                                size="lg"
                            >
                                <Youtube className="h-5 w-5 mr-2" />
                                Review & Confirm
                            </Button>
                        </CardContent>
                    </Card>
                )}

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
