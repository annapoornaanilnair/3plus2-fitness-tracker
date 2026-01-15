# Debug Checklist - Cloud Sync & Logout

## What I Just Fixed

Added extensive console logging throughout the app to diagnose the issues:

### 1. Hook Initialization Logs
- `🎯 useAppState initialized. User: [email]` - Shows when the hook loads
- `🔄 Setting up cloud polling for user: [email]` - Confirms polling is starting
- `⏹️  No polling - user not logged in` - If you're not logged in

### 2. Database Connection Test
- `✅ Database connected. Columns exist: {...}` - Verifies migration worked
- `❌ Initial DB check failed: [error]` - If migration didn't run properly

### 3. Polling Logs (Every 10 seconds)
- `📡 Polling cloud... Local: [time] Cloud: [time]` - Shows sync check
- `✅ 🔄 SYNCED FROM CLOUD - New data loaded!` - When pulling updates
- `⏸️  No updates (local is current)` - When no changes
- `❌ Cloud poll error: [error]` - If polling fails

### 4. Logout Logs
- `🔴 LOGOUT BUTTON CLICKED` - Confirms button was clicked
- `🚪 Logging out...` - Starting logout process
- `✅ Logged out successfully` - Logout worked
- `❌ Logout error: [error]` - If logout fails

---

## Testing Steps

### Step 1: Open the App
1. Go to http://localhost:5174
2. Open browser console (F12)
3. **Look for these messages**:

```
🔍 AuthContext: Starting auth check...
✅ Session retrieved: User logged in
🎯 useAppState initialized. User: your@email.com
```

### Step 2: Check If User is Logged In
If you see `✅ Session retrieved: No user`, you need to login first!

### Step 3: After Login, Check Database Connection
You should see:
```
🔄 Setting up cloud polling for user: your@email.com
✅ Database connected. Columns exist: { hasAppData: true, hasUpdatedAt: true }
```

**If you see `hasAppData: false` or `hasUpdatedAt: false`:**
- The migration didn't run properly
- Go back to Supabase and run it again

### Step 4: Wait 10 Seconds
After logging in, wait and watch console. Every 10 seconds you should see:
```
📡 Polling cloud... Local: 2026-01-15T... Cloud: 2026-01-15T...
⏸️  No updates (local is current)
```

**If you DON'T see this:**
- Check if you're actually logged in (Step 2)
- Check if database connection succeeded (Step 3)

### Step 5: Test Logout
1. Go to Profile page
2. Click "Log Out" button
3. **Look for these messages in order**:
```
🔴 LOGOUT BUTTON CLICKED
🚪 Logging out...
✅ Logged out successfully
```
4. Page should reload to login screen

**If nothing happens:**
- Check if you see "🔴 LOGOUT BUTTON CLICKED"
  - If YES: Issue is with signOut function
  - If NO: Button click not working (maybe a z-index/overlay issue)

---

## Common Issues & Fixes

### Issue: No Console Messages At All
**Cause**: Page not loading or JavaScript error
**Fix**: 
1. Check browser console for red errors
2. Hard refresh (Cmd+Shift+R)
3. Check network tab - is localhost:5174 responding?

### Issue: "No polling - user not logged in"
**Cause**: Not logged in
**Fix**: 
1. Go to login page
2. Login with your credentials
3. Refresh and check again

### Issue: "Initial DB check failed" or "hasAppData: false"
**Cause**: Migration not run correctly
**Fix**:
1. Open Supabase SQL Editor
2. Run this to verify:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('app_data', 'updated_at');
```
3. Should return 2 rows. If not, run migration again

### Issue: "Cloud poll error: permission denied"
**Cause**: RLS policy not set correctly
**Fix**:
1. Run this in Supabase:
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Drop and recreate
DROP POLICY IF EXISTS "Users can update their own profile data" ON profiles;
CREATE POLICY "Users can update their own profile data" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

### Issue: "LOGOUT BUTTON CLICKED" shows but page doesn't reload
**Cause**: Error in signOut function
**Fix**: Look for error message after "🚪 Logging out..."
- If you see "❌ Logout error", there's a Supabase issue
- The app should still reload anyway (fallback code)
- Check if localStorage is being blocked by browser

### Issue: Button click not registering (no "🔴" log)
**Cause**: UI element blocking clicks
**Fix**:
1. Inspect the button in DevTools
2. Check if another element has higher z-index
3. Try clicking exact center of button
4. Check if motion.div animation is blocking

---

## What Should Happen (Normal Flow)

### On Page Load (Logged In):
```
🔍 AuthContext: Starting auth check...
✅ Session retrieved: User logged in
🎯 useAppState initialized. User: test@example.com
🔄 Setting up cloud polling for user: test@example.com
✅ Database connected. Columns exist: { hasAppData: true, hasUpdatedAt: true }
```

### Every 10 Seconds:
```
📡 Polling cloud... Local: 2026-01-15T10:30:00.000Z Cloud: 2026-01-15T10:30:00.000Z
⏸️  No updates (local is current)
```

### When Completing a Workout:
```
✅ 📤 SYNCED TO CLOUD - Data saved at 2026-01-15T10:35:22.456Z
```

### On Another Device (After Workout):
```
📡 Polling cloud... Local: 2026-01-15T10:30:00.000Z Cloud: 2026-01-15T10:35:22.456Z
✅ 🔄 SYNCED FROM CLOUD - New data loaded!
```

### On Logout:
```
🔴 LOGOUT BUTTON CLICKED
🚪 Logging out...
✅ Logged out successfully
[Page reloads]
```

---

## Next Steps

1. **Open http://localhost:5174** 
2. **Open console (F12)**
3. **Login** if not logged in
4. **Wait 10 seconds** - you should see polling messages
5. **Try logout** - should see all 3 messages and reload
6. **Report back** what console messages you see

If you still see no messages, take a screenshot of your console and let me know!
