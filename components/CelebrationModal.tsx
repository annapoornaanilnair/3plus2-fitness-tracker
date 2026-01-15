import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import { Trophy, Flame, Star, Award, Share2 } from 'lucide-react';

interface CelebrationModalProps {
    streak: number;
    dayName?: string;
    exerciseCount?: number;
    onClose: () => void;
    onShare?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
    streak,
    dayName: _dayName,
    exerciseCount: _exerciseCount,
    onClose,
    onShare
}) => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);

        // Stop confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    // Determine milestone
    const getMilestone = () => {
        if (streak >= 100) return { title: "LEGEND!", icon: <Trophy className="text-yellow-400" size={64} />, color: "from-yellow-400 to-orange-500" };
        if (streak >= 30) return { title: "30 Day Warrior!", icon: <Award className="text-purple-400" size={64} />, color: "from-purple-400 to-pink-500" };
        if (streak >= 14) return { title: "Two Weeks Strong!", icon: <Star className="text-blue-400" size={64} />, color: "from-blue-400 to-cyan-500" };
        if (streak >= 7) return { title: "Week Streak!", icon: <Flame className="text-orange-400" size={64} />, color: "from-orange-400 to-red-500" };
        if (streak >= 3) return { title: "On Fire!", icon: <Flame className="text-red-400" size={64} />, color: "from-red-400 to-orange-500" };
        return { title: "Great Job!", icon: <Star className="text-green-400" size={64} />, color: "from-green-400 to-teal-500" };
    };

    const milestone = getMilestone();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Confetti */}
                {showConfetti && (
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.3}
                    />
                )}

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        {milestone.icon}
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-4xl font-raleway font-bold text-center mb-4 bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent`}
                    >
                        {milestone.title}
                    </motion.h2>

                    {/* Streak Count */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center mb-6"
                    >
                        <p className="text-6xl font-raleway font-bold text-[#4A4A4A] mb-2">
                            {streak} 🔥
                        </p>
                        <p className="text-lg font-lato text-[#8A8A8A]">
                            {streak === 1 ? "day streak" : "day streak"}
                        </p>
                    </motion.div>

                    {/* Message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-[#8A8A8A] font-lato mb-8"
                    >
                        {streak >= 30 ? "You're absolutely crushing it! 💪" :
                            streak >= 7 ? "Keep this momentum going! You're unstoppable! 🚀" :
                                streak >= 3 ? "You're building an amazing habit! 🌟" :
                                    "Every workout counts! You're doing great! ✨"}
                    </motion.p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {onShare && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={onShare}
                                className="flex-1 px-6 py-3 bg-[#EDC4B3] text-white rounded-2xl font-raleway font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Share2 size={20} />
                                Share
                            </motion.button>
                        )}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={onClose}
                            className={`${onShare ? 'flex-1' : 'w-full'} px-6 py-3 bg-gradient-to-r from-[#A3C9A8] to-[#82A885] text-white rounded-2xl font-raleway font-semibold hover:shadow-lg transition-all`}
                        >
                            Continue
                        </motion.button>
                    </div>
                </motion.div>

                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            </div>
        </AnimatePresence>
    );
};
