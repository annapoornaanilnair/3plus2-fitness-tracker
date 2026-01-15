import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smile, Zap } from 'lucide-react';
import { DailyCheckIn } from '../types';

interface CheckInModalProps {
    onComplete: (checkIn: DailyCheckIn) => void;
    onSkip: () => void;
}

const MOOD_EMOJIS = ['😫', '😔', '😐', '🙂', '😊', '😄', '😃', '😁', '🤩', '🥳'];
const ENERGY_EMOJIS = ['😴', '🥱', '😌', '😊', '🙂', '💪', '⚡', '🔥', '🚀', '⭐'];

export const CheckInModal: React.FC<CheckInModalProps> = ({ onComplete, onSkip }) => {
    const [mood, setMood] = useState(7);
    const [energy, setEnergy] = useState(7);

    const handleSubmit = () => {
        const checkIn: DailyCheckIn = {
            mood,
            energy,
            timestamp: new Date().toISOString()
        };
        onComplete(checkIn);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-raleway font-bold text-[#4A4A4A]">
                            Quick Check-In ✨
                        </h2>
                        <button
                            onClick={onSkip}
                            className="p-2 hover:bg-[#F5F1EB] rounded-full transition-colors"
                        >
                            <X size={24} className="text-[#8A8A8A]" />
                        </button>
                    </div>

                    <p className="text-[#8A8A8A] font-lato mb-8">
                        How are you feeling today? This helps personalize your experience!
                    </p>

                    {/* Mood Slider */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <Smile className="text-[#A3C9A8]" size={24} />
                            <label className="text-lg font-raleway font-semibold text-[#4A4A4A]">
                                Mood
                            </label>
                        </div>

                        <div className="text-center mb-4">
                            <span className="text-6xl">{MOOD_EMOJIS[mood - 1]}</span>
                            <p className="text-sm text-[#8A8A8A] font-lato mt-2">
                                {mood <= 3 ? "Rough day?" : mood <= 6 ? "Hanging in there" : "Feeling good!"}
                            </p>
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={mood}
                            onChange={(e) => setMood(Number(e.target.value))}
                            className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-300 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #FCA5A5 0%, #FDE047 50%, #86EFAC 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-[#8A8A8A] font-lato mt-1">
                            <span>1</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Energy Slider */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="text-[#EDC4B3]" size={24} />
                            <label className="text-lg font-raleway font-semibold text-[#4A4A4A]">
                                Energy Level
                            </label>
                        </div>

                        <div className="text-center mb-4">
                            <span className="text-6xl">{ENERGY_EMOJIS[energy - 1]}</span>
                            <p className="text-sm text-[#8A8A8A] font-lato mt-2">
                                {energy <= 3 ? "Need rest?" : energy <= 6 ? "Moderate energy" : "Fully charged!"}
                            </p>
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={energy}
                            onChange={(e) => setEnergy(Number(e.target.value))}
                            className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-300 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #BFDBFE 0%, #DDD6FE 50%, #FED7AA 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-[#8A8A8A] font-lato mt-1">
                            <span>1</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onSkip}
                            className="flex-1 px-6 py-3 bg-[#F5F1EB] text-[#8A8A8A] rounded-2xl font-raleway font-semibold hover:bg-[#E8E4DE] transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#A3C9A8] to-[#EDC4B3] text-white rounded-2xl font-raleway font-semibold hover:shadow-lg transition-all"
                        >
                            Start Workout
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
