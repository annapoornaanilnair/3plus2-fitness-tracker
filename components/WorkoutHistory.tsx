import React, { useState } from 'react';
import { WorkoutLog, UserProfile } from '../types';
import { getWeeklyPlan } from '../data/workoutPlan';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkoutHistoryProps {
    workoutLogs: WorkoutLog[];
    profile: UserProfile;
    onClose: () => void;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workoutLogs, profile, onClose }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mandatoryDays = ['Monday', 'Wednesday', 'Friday'];

    // Get weekly plan with user's custom weekend activities
    const weeklyPlan = getWeeklyPlan(profile);

    // Generate calendar days for the current month
    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: (Date | null)[] = [];

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const calendarDays = getCalendarDays();
    const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const getWorkoutForDate = (date: Date) => {
        const dayName = fullDayNames[date.getDay()];
        return weeklyPlan.find(w => w.day === dayName);
    };

    const getLogForDate = (date: Date) => {
        return workoutLogs.find(log =>
            new Date(log.date).toDateString() === date.toDateString()
        );
    };

    const isDayBeforeToday = (date: Date) => {
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        const todayOnly = new Date(today);
        todayOnly.setHours(0, 0, 0, 0);
        return dateOnly < todayOnly;
    };

    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
                    <h2
                        className="text-2xl text-[#4A4A4A]"
                        style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                    >
                        Workout History 📊
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#8A8A8A] hover:text-[#4A4A4A] text-2xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={goToPreviousMonth}
                            className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-[#4A4A4A]" />
                        </button>
                        <h3
                            className="text-xl text-[#4A4A4A]"
                            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                        >
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-[#4A4A4A]" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="mb-6">
                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {dayNames.map(day => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-semibold text-[#8A8A8A] py-2"
                                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const workout = getWorkoutForDate(date);
                                const log = getLogForDate(date);
                                const dayName = fullDayNames[date.getDay()];
                                const isMandatory = mandatoryDays.includes(dayName);
                                const isCompleted = log?.completed;
                                const isTodayDate = isToday(date);
                                const isRest = workout?.type === 'rest';
                                const beforeToday = isDayBeforeToday(date);

                                // Show workout plan for all dates, highlight completed ones
                                // No more "NA" - always show the workout that should be done
                                const isFutureDate = !beforeToday && !isTodayDate && isCurrentMonth;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={`aspect-square rounded-xl p-2 transition-all ${isCompleted
                                            ? 'bg-[#A3C9A8] text-white hover:bg-[#8FB896]'
                                            : isTodayDate
                                                ? 'bg-[#EDC4B3] text-white hover:bg-[#E0B5A4] ring-2 ring-[#EDC4B3] ring-offset-2'
                                                : isRest
                                                    ? 'bg-[#E8E4DE] hover:bg-[#DDD9D3]'
                                                    : isFutureDate
                                                        ? 'bg-gray-50 hover:bg-gray-100'
                                                        : 'bg-[#F5F1EB] hover:bg-[#E8E4DE]'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div
                                                className={`text-sm font-semibold ${isCompleted || isTodayDate ? 'text-white' :
                                                    isFutureDate ? 'text-gray-400' : 'text-[#4A4A4A]'
                                                    }`}
                                                style={{ fontFamily: 'Quicksand, sans-serif' }}
                                            >
                                                {date.getDate()}
                                            </div>
                                            <div className="text-xs mt-1">
                                                {isCompleted ? '🔥' : isRest ? '☁️' : isMandatory ? '💪' : '⭐'}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Date Summary */}
                    {selectedDate && (
                        <div className="bg-[#F5F1EB] rounded-2xl p-4">
                            <div className="flex items-start justify-between mb-3">
                                <h4
                                    className="text-lg font-semibold text-[#4A4A4A]"
                                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                                >
                                    {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h4>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-[#8A8A8A] hover:text-[#4A4A4A]"
                                >
                                    ✕
                                </button>
                            </div>

                            {(() => {
                                const workout = getWorkoutForDate(selectedDate);
                                const log = getLogForDate(selectedDate);
                                const dayName = fullDayNames[selectedDate.getDay()];
                                const isMandatory = mandatoryDays.includes(dayName);

                                if (log?.completed) {
                                    return (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">✅</span>
                                                <span
                                                    className="font-semibold text-[#A3C9A8]"
                                                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                                                >
                                                    Completed!
                                                </span>
                                            </div>
                                            <div className="text-sm text-[#4A4A4A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                {log.exercises.length} exercises completed
                                            </div>
                                        </div>
                                    );
                                }

                                if (workout?.type === 'rest') {
                                    return (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">☁️</span>
                                                <span
                                                    className="font-semibold text-[#4A4A4A]"
                                                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                                                >
                                                    Rest Day
                                                </span>
                                            </div>
                                            <div className="text-sm text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                {workout.focus}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{isMandatory ? '💪' : '⭐'}</span>
                                            <span
                                                className="font-semibold text-[#4A4A4A]"
                                                style={{ fontFamily: 'Quicksand, sans-serif' }}
                                            >
                                                {workout?.focus || dayName}
                                            </span>
                                            <span className="px-2 py-0.5 bg-white rounded-full text-[10px] text-[#8A8A8A]">
                                                {isMandatory ? 'MANDATORY' : 'BONUS'}
                                            </span>
                                        </div>
                                        {!log && (
                                            <div className="text-sm text-[#8A8A8A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                {isToday(selectedDate) ? "Not completed yet" : "Skipped"}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )
                    }
                </div >
            </div >
        </div >
    );
};
