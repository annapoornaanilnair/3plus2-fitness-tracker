# Testing & Reset Instructions

## How to Clear Workout History

To reset all workout data and start fresh for testing:

1. **Open Browser Console** (F12 or Cmd+Option+I on Mac)

2. **Run this command:**
   ```javascript
   clearWorkoutHistory()
   ```

3. **Confirm the dialog** that appears

4. The app will **automatically reload** with fresh data

### What Gets Cleared:
- ✅ All workout logs
- ✅ Streak counter (reset to 0)
- ✅ Last workout date
- ✅ Weekly progress bubbles

### What's Kept:
- ✅ Your profile (weight, goals)
- ✅ Custom exercises
- ✅ App settings (mode, notification time)
- ✅ User account/login

---

## What's New

### 1. ✅ Equipment Section - REMOVED
The equipment bar has been removed from the Profile page for a cleaner interface.

### 2. ✅ Murder Board - REMOVED
The creative notes/"murder board" section has been removed.

### 3. ✅ Working Reminders
- Go to Profile → Daily Reminder ⏰
- Set your preferred time
- Click **Save**
- Browser will ask for notification permission - **click Allow**
- You'll get a daily reminder at your chosen time!

**Testing tip:** Set reminder for 1-2 minutes from now to test it quickly.

### 4. ✅ Shareable Workout Cards
After completing a workout:
1. Celebration modal appears with confetti 🎉
2. Click **Share** button
3. Beautiful workout card appears with:
   - Day name
   - Exercise count
   - Your streak 🔥
   - Date stamp
4. Options:
   - **Download** - Saves image to your device
   - **Share** - Opens native share menu (mobile)
   - **Close** - Returns to dashboard

### 5. ✅ Elegant Workout Complete Card
The "Workout Complete" card on the Dashboard now features:
- Beautiful green gradient background
- Animated checkmark with spring bounce
- Decorative circles
- Glassmorphism streak badge
- Smooth fade-in animations
- More dynamic and visually appealing

---

## Testing Workflow

### Full Test Sequence:

1. **Clear history:**
   ```javascript
   clearWorkoutHistory()
   ```

2. **Set a reminder:**
   - Go to Profile
   - Set time for 2 minutes from now
   - Click Save
   - Allow notifications

3. **Complete a workout:**
   - Go to Dashboard
   - Click "Start Workout"
   - Complete check-in (optional)
   - Do the workout
   - Complete it

4. **See the new features:**
   - ✨ Animated completion card on Dashboard
   - 🎉 Celebration modal with confetti
   - 📤 Share button appears
   - 🎨 Download/share your workout card

5. **Test streak tracking:**
   - Change your system date to tomorrow
   - Complete another workout
   - See streak increment to 2 days
   - Celebration shows updated streak

6. **Test reminders:**
   - Wait for your set time
   - You should get a browser notification
   - "Time to Workout! 💪"

---

## Cloud Sync Status

### How It Works Now:
- **Local-first** - All changes save instantly to localStorage
- **Smart sync** - Waits 2 seconds after you stop making changes
- **Workout pause** - Cloud sync PAUSES during active workout
- **Auto-resume** - Syncs to cloud when workout completes
- **1-minute polling** - Checks for updates every 60 seconds

### Console Messages:
- `✅ Saved to cloud` - Your data was backed up
- `✅ Synced from cloud` - New data loaded from another device

### During Workout:
- No cloud sync (prevents interruptions)
- All changes saved locally
- Syncs automatically when you finish

---

## Browser Testing

### Test Across Devices:
1. Login on **Chrome**
2. Complete a workout
3. Wait for "✅ Saved to cloud"
4. Open **Safari** (or another browser)
5. Login with same account
6. Wait ~60 seconds
7. Data appears! 🎉

---

## Quick Commands

```javascript
// Clear all workout history
clearWorkoutHistory()

// Check current state
localStorage.getItem('3plus2-app-state')

// Clear everything (nuclear option)
localStorage.clear()
window.location.reload()
```

---

## Known Behaviors

### Notifications:
- **Desktop:** Browser must be open to receive
- **Mobile:** May need PWA installed for background notifications
- **Permission:** Must be granted in browser settings

### Cloud Sync:
- Requires migration to be run in Supabase
- If not working, check console for errors
- Local data always works even if cloud fails

### Share Feature:
- **Desktop:** Always downloads
- **Mobile:** Shows native share menu
- **Image quality:** 2x resolution for crisp sharing

---

## Troubleshooting

### "clearWorkoutHistory is not defined"
- Refresh the page
- Make sure you're logged in
- Try running: `window.location.reload()`

### Notifications not working
- Check browser permissions
- Some browsers block on HTTP (use HTTPS)
- Try incognito mode to test fresh permissions

### Share button does nothing
- Check console for errors
- Try Download button instead
- html2canvas may need time to load

---

## For Future Testing

Every time you want to start fresh:
1. Open console
2. Run `clearWorkoutHistory()`
3. Confirm
4. App reloads with clean slate

Perfect for testing:
- Streak milestones (3, 7, 14, 30, 100 days)
- Celebration animations
- Share cards
- Weekly progress
- Cloud sync

---

Enjoy testing! 🎉
