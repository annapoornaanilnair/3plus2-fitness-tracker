# 🎯 Workout Customization Feature Guide

## Overview

The Workout Customization feature allows you to replace any default exercise with your own favorite exercise from YouTube. This gives you full control over your workout plan while maintaining the structure and tracking features.

---

## ✨ Features

### What You Can Do:

1. **Replace Any Exercise** - Swap out default exercises with your favorites
2. **YouTube Integration** - Use any YouTube video as your exercise demo
3. **Custom Sets/Reps** - Adjust volume to match your preferences
4. **Visual Confirmation** - See video preview before confirming
5. **Double Confirmation** - Prevent accidental changes
6. **Easy Restoration** - Remove customizations anytime to restore defaults
7. **Per-User Customization** - Each family member has their own custom exercises (secure & private)

---

## 🚀 How to Use

### Step 1: Navigate to Customization

1. Open the app
2. Go to **Profile** (bottom right)
3. Scroll down to **"Customize Workouts"** section
4. Click **"Customize Exercises"** button

### Step 2: Choose a Day

- Select which day you want to customize (Monday - Sunday)
- You'll see how many exercises you've already customized for each day
- Days show their type: **Mandatory** (green), **Bonus** (blue), or **Rest** (gray)

### Step 3: Select Exercise to Replace

- You'll see all exercises for that day
- Already customized exercises show a green **"Customized"** badge
- Click **"Replace"** to change a default exercise
- Click **"Edit"** to modify an existing customization
- Click the **trash icon** to restore the original exercise

### Step 4: Enter New Exercise Details

Fill in the form:

1. **Exercise Name** - e.g., "Barbell Back Squat"
2. **YouTube URL** - Paste any YouTube link
   - Supports: `youtube.com/watch?v=...`, `youtu.be/...`, or just the video ID
   - Automatically validates and shows preview
3. **Sets** - Number of sets (1-10)
4. **Reps** - Number of reps per set (1-100)
5. **Rest Seconds** - Rest time between sets (0-600 seconds)

### Step 5: Review & Confirm

- Click **"Review & Confirm"**
- See a side-by-side comparison:
  - ❌ Old exercise (red box)
  - ✅ New exercise (green box)
- Video preview is shown
- Click **"Confirm Replacement"** to save

### Step 6: Done!

- Customization is saved immediately
- Changes apply to all future workouts
- Your workout history remains unchanged

---

## 🎥 YouTube URL Examples

All these formats work:

```
✅ https://www.youtube.com/watch?v=ScVe6I8RLKM
✅ https://youtu.be/ScVe6I8RLKM
✅ https://www.youtube.com/embed/ScVe6I8RLKM
✅ https://m.youtube.com/watch?v=ScVe6I8RLKM
✅ ScVe6I8RLKM (just the video ID)
```

The app will:
- ✅ Validate the URL format
- ✅ Extract the video ID
- ✅ Convert to embed format
- ✅ Show you a preview before saving

---

## 🔒 Security Features

### How Your Customizations Are Protected:

1. **User Isolation** - You can only see and edit YOUR customizations
2. **Database RLS** - Row-level security prevents access to others' data
3. **Validation** - All inputs are validated (sets 1-10, reps 1-100, etc.)
4. **YouTube Only** - Only valid YouTube URLs are accepted
5. **Unique Constraints** - Can't duplicate customizations
6. **Audit Trail** - Creation timestamps are recorded

### What's Stored in Database:

```sql
- User ID (auto-linked to your account)
- Day name (Monday, Tuesday, etc.)
- Original exercise ID (what you replaced)
- New exercise name
- YouTube embed URL (validated)
- Sets, reps, rest seconds
- Timestamp
```

---

## 💡 Use Cases

### Common Scenarios:

1. **Equipment Preference**
   - Replace "Barbell Squat" with "Dumbbell Squat" if no barbell

2. **Injury Modification**
   - Replace "Bulgarian Split Squat" with "Leg Press" if knee issues

3. **Personal Favorites**
   - Replace any exercise with one you enjoy more

4. **Progressive Difficulty**
   - Start with easier variations, swap in harder ones later

5. **Space Constraints**
   - Replace gym exercises with home-friendly alternatives

---

## 🎨 User Experience Features

### Smart Defaults:

When editing an existing customization:
- Form pre-fills with your current custom values
- Video preview loads immediately
- Easy to tweak small details

When replacing a default:
- Form pre-fills with original exercise details
- You can keep sets/reps and just change the exercise
- Or customize everything

### Visual Feedback:

- ✅ **Green checkmark** - Valid YouTube URL
- ❌ **Red X** - Invalid URL with helpful error
- 🎥 **Video preview** - See exercise before confirming
- 🏷️ **Customized badge** - Know which exercises you've changed
- 🗑️ **Delete button** - Quick restore to default

---

## 🔄 How Workouts Use Customizations

### Behind the Scenes:

1. **App loads default workout plan** from `data/workoutPlan.ts`
2. **Merges your customizations** - Replaces exercises you've customized
3. **You work out** with the combined plan
4. **Tracking continues** - Weight history, PRs, etc. all work normally

### Important Notes:

- **Workout history is preserved** - Past workouts show what you actually did
- **Future workouts use custom** - Next time you do that day, it uses your exercise
- **Original ID is maintained** - Progress tracking continues seamlessly
- **Easy to undo** - Delete customization = instant restore

---

## 📊 Example Workflow

### Scenario: Replace Monday's Hip Thrust

**Before:**
```
Monday - Glutes
1. Glute Bridge - 3×12
2. Bulgarian Split Squat - 3×10
3. Romanian Deadlift - 3×12
4. Hip Thrust - 3×15  ← Want to replace this
```

**Steps:**
1. Profile → Customize Workouts
2. Select "Monday"
3. Click "Replace" on "Hip Thrust"
4. Enter:
   - Name: "Barbell Hip Thrust"
   - URL: `https://youtu.be/xDmFkJxPzeM`
   - Sets: 4
   - Reps: 12
   - Rest: 90 seconds
5. Review preview
6. Confirm

**After:**
```
Monday - Glutes
1. Glute Bridge - 3×12
2. Bulgarian Split Squat - 3×10
3. Romanian Deadlift - 3×12
4. Barbell Hip Thrust - 4×12  ← Customized! ✨
```

---

## ❓ FAQ

### Can I customize rest days?
Yes! You can add exercises to rest days if you want active recovery.

### Will this affect my workout history?
No. Past workouts remain unchanged. Only future workouts use the custom exercise.

### Can I customize the same exercise on different days?
Yes! Monday squats and Wednesday squats can be different exercises.

### What if I paste an invalid YouTube link?
You'll see an error immediately with a clear message. The video preview won't load.

### Can I have multiple custom exercises per day?
Absolutely! Customize as many as you want on each day.

### How do I restore the original exercise?
Click the trash/delete icon next to a customized exercise. Confirm deletion.

### Can family members see my customizations?
No. Each user's customizations are private and isolated via database security.

### What happens if YouTube removes the video?
The URL will still be stored, but the video won't load. You can edit and replace with a new URL.

### Can I export my customizations?
Not yet, but coming soon with the general data export feature!

### Do customizations sync across devices?
Yes! Once you set up cloud sync (see SECURITY_SETUP.md), customizations sync everywhere.

---

## 🛡️ Technical Implementation

### Database Schema:

```sql
CREATE TABLE custom_exercises (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  day_name VARCHAR(20) NOT NULL,
  replaced_exercise_id VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  sets INTEGER CHECK (sets >= 1 AND sets <= 10),
  reps INTEGER CHECK (reps >= 1 AND reps <= 100),
  rest_seconds INTEGER CHECK (rest_seconds >= 0 AND rest_seconds <= 600),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, day_name, replaced_exercise_id)
);
```

### Row-Level Security Policies:

- **SELECT** - User can only view their own customizations
- **INSERT** - User can only create customizations for themselves
- **UPDATE** - User can only update their own customizations
- **DELETE** - User can only delete their own customizations

### Validation Logic:

- YouTube URL regex validation
- Video ID extraction and verification
- Sets: 1-10
- Reps: 1-100
- Rest: 0-600 seconds
- Name: Required, max 255 characters
- Unique constraint: One customization per day+exercise combo

---

## 🚀 Future Enhancements

Planned features:

- [ ] **Exercise Library** - Browse pre-approved exercises
- [ ] **Community Sharing** - Share favorite exercise swaps
- [ ] **Bulk Import** - Import entire workout plan
- [ ] **Exercise Tags** - Category/equipment filtering
- [ ] **Form Check Integration** - Upload your form video
- [ ] **Alternative Suggestions** - AI recommends similar exercises
- [ ] **Difficulty Levels** - Mark exercises as beginner/advanced
- [ ] **Equipment Required** - Auto-filter by available equipment

---

## 📝 Notes for Developers

### Key Files:

- `components/WorkoutCustomization.tsx` - Main UI component
- `utils/youtube.ts` - YouTube URL validation
- `utils/workoutHelpers.ts` - Merge custom with default plan
- `hooks/useAppState.ts` - State management for customizations
- `types/index.ts` - CustomExercise type definition
- `supabase/migrations/001_security_setup.sql` - Database schema

### How It Works:

1. User makes changes in UI
2. `WorkoutCustomization` component validates input
3. Confirmation dialog shows comparison
4. `saveCustomExercise()` called in `useAppState`
5. Saved to localStorage AND database (if synced)
6. `getTodaysCustomWorkout()` merges custom + default
7. WorkoutPlayer receives merged plan
8. User works out with customized exercises

---

## ✅ Summary

The Workout Customization feature gives you complete flexibility while maintaining:

- ✅ **Security** - Your customizations are private
- ✅ **Simplicity** - 5-step process with visual feedback
- ✅ **Safety** - Double confirmation prevents accidents
- ✅ **Flexibility** - Customize anything, anytime
- ✅ **Reversibility** - Easy to restore defaults
- ✅ **Sync** - Works across all your devices

**Start customizing your workouts today! 🏋️‍♀️**
