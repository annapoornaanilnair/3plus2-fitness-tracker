import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface WeekendActivityModalProps {
  isOpen: boolean;
  day: 'Saturday' | 'Sunday';
  profile: UserProfile;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => void;
}

export const WeekendActivityModal: React.FC<WeekendActivityModalProps> = ({
  isOpen,
  day,
  profile,
  onClose,
  onSave
}) => {
  const isActivityKey = day === 'Saturday' ? 'saturdayActivity' : 'sundayActivity';
  const isEmojiKey = day === 'Saturday' ? 'saturdayEmoji' : 'sundayEmoji';
  
  const [activity, setActivity] = useState(profile[isActivityKey] || '');
  const [emoji, setEmoji] = useState(profile[isEmojiKey] || '');
  
  // Emoji picker options
  const emojiOptions = ['🎻', '🏃', '🧘', '🧗', '🚴', '🏊', '💃', '🎬', '📚', '🍕', '🎮', '🛴', '🏋️', '⛷️', '🏄', '🎯', '🎨', '🎭', '🚶', '🛋️'];

  const handleSave = () => {
    const updates: Partial<UserProfile> = {
      [isActivityKey]: activity,
      [isEmojiKey]: emoji
    };
    onSave(updates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4] rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-sage/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Customize {day}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/40 rounded-full transition-colors"
          >
            <X size={24} className="text-charcoal/50" />
          </button>
        </div>

        {/* Activity Input */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-charcoal mb-2 block">
            Activity Name
          </Label>
          <Input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g., Yoga, Swimming, Cooking"
            className="bg-white/60 border border-sage/20 rounded-2xl text-charcoal placeholder-charcoal/40 focus:border-sage focus:ring-sage/30"
          />
        </div>

        {/* Emoji Picker */}
        <div className="mb-8">
          <Label className="text-sm font-semibold text-charcoal mb-3 block">
            Choose an Emoji
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {emojiOptions.map((option) => (
              <button
                key={option}
                onClick={() => setEmoji(option)}
                className={`text-2xl p-3 rounded-2xl transition-all ${
                  emoji === option
                    ? 'bg-gradient-to-br from-[#A3C9A8] to-[#82A885] ring-2 ring-sage/50 scale-110 shadow-soft-lg'
                    : 'bg-white/60 hover:bg-white/80 shadow-soft'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-charcoal/60">Selected: {emoji || 'None'}</p>
            <Input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={2}
              placeholder="Or paste an emoji"
              className="w-20 bg-white/60 border border-sage/20 rounded-lg text-center text-xl py-1 focus:border-sage"
            />
          </div>
        </div>

        {/* Preview */}
        {(activity || emoji) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl p-4 mb-8 text-center border border-sage/10 shadow-soft"
          >
            <p className="text-sm text-charcoal/60 mb-2">Preview:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">{emoji || '?'}</span>
              <span className="text-lg font-semibold text-charcoal">{activity || 'Activity'}</span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-sage/20 text-charcoal/60 hover:bg-white/40 hover:border-sage/40"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-[#A3C9A8] to-[#82A885] hover:shadow-soft-lg text-white"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
