# 🔒 Security Setup Guide for 3+2 Fitness Tracker

## 📋 Overview
This guide will walk you through setting up secure multi-device sync for your family and friends.

## 🚀 Quick Start (5 Steps)

### Step 1: Set Up Supabase Database

1. Go to your Supabase SQL Editor:
   **https://supabase.com/dashboard/project/ngsvaqyttrfvsivvdhtc/sql**

2. Copy and paste the ENTIRE contents of:
   `supabase/migrations/001_security_setup.sql`

3. Click **RUN** to execute the SQL

4. You should see: "Success. No rows returned"

### Step 2: Add Your Admin Email

1. In the SQL Editor, find this section (near the bottom of the file):
   ```sql
   INSERT INTO approved_users (email, invited_by, used) 
   VALUES ('your-email@example.com', NULL, false);
   ```

2. **Replace** `'your-email@example.com'` with **YOUR actual email**

3. **Uncomment** the line (remove the `--` at the start)

4. Click **RUN**

Example:
```sql
INSERT INTO approved_users (email, invited_by, used) 
VALUES ('anna@gmail.com', NULL, false);
```

### Step 3: Install Required Dependencies

Run this in your project terminal:

```bash
npm install @supabase/supabase-js
```

### Step 4: Create Your Account

1. Start your app: `npm run dev`

2. You'll see the login screen

3. Click **"Don't have an account? Sign up"**

4. Use the SAME email you added in Step 2

5. Create a password (minimum 6 characters)

6. Check your email and verify

### Step 5: Make Yourself Admin

1. After verifying your email and logging in, go back to Supabase SQL Editor

2. Run this command (replace with your email):
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'anna@gmail.com';
   ```

3. Refresh the app - you should now see "Admin Panel" in your profile

## ✅ You're Done! Now You Can:

- ✨ **Invite family & friends** from the Admin Panel
- 🔄 **Sync workouts** across all your devices
- 🔒 **Secure data** - only you can see your workouts
- 📱 **Use on phone, tablet, computer** - all synced

---

## 👥 Inviting Family & Friends

### From Admin Panel:

1. Click **Profile** → **Admin Panel**
2. Enter their email address
3. Click **Send Invite**
4. Tell them to:
   - Go to your app URL
   - Click "Sign up"
   - Use the exact email you invited
   - Create their account

### Security Features:

- ✅ Only approved emails can sign up
- ✅ Each person only sees their own data
- ✅ All data encrypted in transit (HTTPS)
- ✅ Row-level security in database
- ✅ Automatic backups (Supabase handles this)

---

## 🔐 Security Features Explained

### 1. **Row-Level Security (RLS)**
- Users can ONLY access their own workout data
- Even admins can't see others' workouts
- Database enforces this automatically

### 2. **Invite-Only Registration**
- Public signups are BLOCKED
- Only pre-approved emails can create accounts
- You control who has access

### 3. **Environment Variables**
- API keys stored in `.env.local` (not committed to git)
- Different keys for development/production
- Keys never exposed in code

### 4. **Authentication**
- Email verification required
- Secure password hashing (bcrypt)
- Session tokens auto-refresh
- Magic link option (passwordless)

### 5. **Data Encryption**
- All API calls use HTTPS/TLS
- Data encrypted at rest (Supabase default)
- Passwords never stored in plain text

---

## 🛠️ Troubleshooting

### "Email not approved" error
**Solution:** Make sure you added the email in `approved_users` table first (Step 2)

### "Invalid API key" error
**Solution:** Check that `.env.local` exists and has correct values

### Can't see Admin Panel
**Solution:** Run the UPDATE query to set `is_admin = true` (Step 5)

### Sync not working
**Solution:** Check browser console for errors. Make sure you're logged in.

### "User already registered"
**Solution:** Use password reset instead of signing up again

---

## 📊 How Sync Works

### Initial State (No Account):
- Data stored in localStorage only
- Works offline
- Lost if browser cleared

### After Login:
- Data backed up to Supabase cloud
- Syncs across all devices
- Survives browser clear
- Automatic conflict resolution

### Sync Process:
1. You make changes (complete workout, update weight)
2. Saved to localStorage immediately (fast)
3. Background sync to cloud (within seconds)
4. Other devices pull latest data
5. Conflicts resolved by timestamp (latest wins)

---

## 🔒 Privacy & Data Ownership

### What data is stored:
- Your workout logs (exercises, weights, reps)
- Your profile (weight, equipment, preferences)
- Energy mode settings
- Creative notes

### What is NOT stored:
- No third-party analytics
- No tracking cookies
- No ads
- No data selling

### Who can access your data:
- **You** - Full access to your data
- **Admins** - Can invite users, CANNOT see workout data
- **Supabase** - Infrastructure provider (encrypted at rest)
- **Nobody else**

### Data portability:
- Export feature coming soon (JSON/CSV)
- You can delete your account anytime
- All data is permanently deleted

---

## 💰 Costs

### Free Tier (Supabase):
- ✅ Up to 50,000 monthly active users
- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth

### For 10 family members:
- **Database usage:** ~5-10 MB (plenty of room)
- **Bandwidth:** ~100 MB/month (well under limit)
- **Cost:** **$0/month** ✨

### When to upgrade:
- If you exceed 500 MB data (unlikely for personal use)
- If you want guaranteed uptime SLA
- Supabase Pro is $25/month (only if needed)

---

## 🎯 Next Steps

### Immediate:
1. ✅ Complete Steps 1-5 above
2. ✅ Test login/logout
3. ✅ Invite one family member
4. ✅ Test sync between devices

### Soon:
- 📱 Add PWA support (install as app)
- 📊 Advanced analytics dashboard
- 🤝 Social features (optional)
- 🔔 Push notifications

### Later:
- 🤖 AI workout recommendations
- 📹 Form check videos
- ⌚ Wearable integration

---

## 📞 Support

If you run into issues:

1. Check the troubleshooting section above
2. Check browser console for errors (F12)
3. Verify Supabase tables were created (SQL Editor → Table Editor)
4. Make sure `.env.local` has correct values

---

## 🔄 Backup & Recovery

### Automatic Backups:
- Supabase backs up database daily
- Point-in-time recovery available
- 7-day retention on free tier

### Manual Backup:
- Export data from Admin Panel (feature coming)
- Download as JSON
- Store safely

### Disaster Recovery:
- If database is lost: Supabase restores from backup
- If account is lost: Contact Supabase support
- If device is lost: Login on new device, data syncs

---

## 🎉 Success Checklist

- [ ] SQL migration ran successfully
- [ ] Your email added to approved_users
- [ ] Account created and verified
- [ ] Made yourself admin
- [ ] Can access Admin Panel
- [ ] Invited at least one family member
- [ ] Tested sync between two devices
- [ ] Data persists after logout/login

**All checked?** You're ready to roll! 🏋️‍♀️

---

## 🔒 Security Best Practices

1. **Never share your password** - Each person should have their own account
2. **Use strong password** - At least 12 characters
3. **Don't commit .env.local** - Already in .gitignore
4. **Review approved users regularly** - Remove anyone who shouldn't have access
5. **Enable 2FA** (coming soon) - Extra security layer

---

## 📚 Technical Details (For Developers)

### Architecture:
- **Frontend:** React + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Sync:** Optimistic updates + background sync
- **Storage:** localStorage (cache) + Supabase (source of truth)

### Security Stack:
- **Database:** Row-Level Security (RLS)
- **Auth:** Supabase Auth (JWT tokens)
- **Transport:** TLS 1.3 encryption
- **Password:** bcrypt hashing
- **Session:** Auto-refreshing tokens

### Data Flow:
```
User Action → localStorage (instant) → Supabase (background) → Other Devices
```

### Conflict Resolution:
```
If (localTimestamp > cloudTimestamp) → Upload local
Else → Download cloud
```

---

**Questions? Check the code comments or Supabase docs!**
