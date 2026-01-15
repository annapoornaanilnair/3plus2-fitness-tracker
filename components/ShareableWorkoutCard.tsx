import React, { useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';

interface ShareableWorkoutCardProps {
    dayName: string;
    exerciseCount: number;
    streak: number;
    onClose: () => void;
}

export const ShareableWorkoutCard: React.FC<ShareableWorkoutCardProps> = ({
    dayName,
    exerciseCount,
    streak,
    onClose
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const downloadCard = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2
            });

            const link = document.createElement('a');
            link.download = `workout-${dayName}-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating card:', error);
        }
    };

    const shareCard = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], 'workout.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'My Workout 💪',
                        text: `Completed ${dayName}! ${streak} day streak 🔥`,
                        files: [file]
                    });
                } else {
                    // Fallback: download instead
                    downloadCard();
                }
            });
        } catch (error) {
            console.error('Error sharing card:', error);
            downloadCard(); // Fallback
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full"
            >
                <h2 className="text-2xl font-raleway font-bold text-[#4A4A4A] mb-4 text-center">
                    Share Your Workout 🎉
                </h2>

                {/* The actual shareable card */}
                <div ref={cardRef} className="mb-6">
                    <div className="bg-gradient-to-br from-[#A3C9A8] via-[#82A885] to-[#6B9374] rounded-3xl p-8 text-white shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">💪</div>
                            <h3 className="text-3xl font-raleway font-bold mb-2">
                                Workout Complete!
                            </h3>
                            <p className="text-lg font-lato opacity-90">
                                {dayName}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-4xl font-raleway font-bold">
                                    {exerciseCount}
                                </div>
                                <div className="text-sm font-lato opacity-90 mt-1">
                                    Exercises
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-4xl font-raleway font-bold">
                                    {streak} 🔥
                                </div>
                                <div className="text-sm font-lato opacity-90 mt-1">
                                    Day Streak
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center">
                            <div className="text-sm font-lato opacity-75">
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={downloadCard}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#A3C9A8] text-white rounded-2xl hover:bg-[#8FB896] transition-colors font-raleway font-semibold"
                    >
                        <Download size={20} />
                        Download
                    </button>
                    <button
                        onClick={shareCard}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#EDC4B3] text-white rounded-2xl hover:bg-[#E8B4A8] transition-colors font-raleway font-semibold"
                    >
                        <Share2 size={20} />
                        Share
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-3 px-6 py-3 bg-[#F5F1EB] text-[#8A8A8A] rounded-2xl hover:bg-[#E8E4DE] transition-colors font-lato"
                >
                    Close
                </button>
            </motion.div>
        </div>
    );
};
