/**
 * Cute and motivational messages for low energy workouts
 */

export const LOW_ENERGY_MESSAGES = {
  // Start of workout messages
  start: [
    "🌙 Taking it easy today? That's totally okay! You're still showing up. 💪",
    "🌙 Low energy, high self-care! Let's do this at YOUR pace. ✨",
    "🌙 Some days we go hard, some days we go smart. Today's a smart day! 🧠",
    "🌙 Feeling tired? No problem! Lighter workouts count too. 💖",
    "🌙 Listen to your body - it's wise. You've got this! 🌟",
    "🌙 Slow and steady wins the race! Let's be kind to ourselves today. 🌸"
  ],

  // Exercise modifications
  modifications: [
    "✨ Go lighter, go slower - no shame, just smart training!",
    "💖 Modify as needed - you know your body best!",
    "🌙 Half the weight, same amount of strength building!",
    "💪 Fewer reps, same dedication!",
    "🧘 Quality over quantity - you've got this!",
    "✨ Listening to your body is a superpower!"
  ],

  // Encouragement during workout
  encouragement: [
    "You're doing amazing! 🌟",
    "Every rep counts! 💪",
    "Be proud of yourself! 🎉",
    "You're stronger than you think! 💖",
    "This matters! Keep going! 🚀",
    "You've got the strength! ✨"
  ],

  // Finish messages
  finish: [
    "🎉 You did it! Even on a low energy day, you showed up for yourself! 💖",
    "🌟 That was perfect! Rest well, you earned it! ✨",
    "💪 Low energy workout = still a WIN! Be proud! 🎊",
    "🌙 You listened to your body AND stayed consistent. That's wisdom! 🧠",
    "✨ Rest is part of training. You did great today! 💤",
    "🎯 Every workout counts. Today's your proof! 💖"
  ],

  // Bonus day skip message
  bonusSkipped: [
    "🌙 Smart choice! Bonus day skipped for today. Rest and recover! 💤",
    "✨ Taking it easy on bonus days too - wise choice! 💖",
    "🌟 Recovery is where the magic happens. You'll be back stronger! 💪",
    "🎯 Bonus day rest today = stronger comeback tomorrow! 🚀"
  ]
};

/**
 * Get a random message from a category
 */
export const getRandomMessage = (category: keyof typeof LOW_ENERGY_MESSAGES): string => {
  const messages = LOW_ENERGY_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
};
