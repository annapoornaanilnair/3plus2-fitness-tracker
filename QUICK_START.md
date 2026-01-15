# ⚡ QUICK START - Action Required!

## 🚨 YOU NEED TO DO THIS NOW:

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Set Up Database

1. Open this URL in your browser:
   **https://supabase.com/dashboard/project/ngsvaqyttrfvsivvdhtc/sql**

2. Copy the ENTIRE file `supabase/migrations/001_security_setup.sql`

3. Paste it into the SQL Editor

4. Click **RUN**

### Step 3: Add YOUR Email

In the same SQL Editor, find this line near the bottom:

```sql
INSERT INTO approved_users (email, invited_by, used) 
VALUES ('your-email@example.com', NULL, false);
```

**Replace** `'your-email@example.com'` with YOUR actual email (the one you'll use to sign up)

**Remove** the `--` at the start of both lines to uncomment them

Click **RUN** again

Example:
```sql
INSERT INTO approved_users (email, invited_by, used) 
VALUES ('anna@gmail.com', NULL, false);
```

### Step 4: Test Locally

```bash
npm run dev
```

1. You should see a login screen
2. Click "Sign up"
3. Use the email you added in Step 3
4. Create a password
5. Check your email to verify

### Step 5: Make Yourself Admin

After verifying email and logging in, go back to Supabase SQL Editor:

```sql
UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
```

Click **RUN**

Refresh your app - you should now see "Admin Panel" option!

---

## ✅ What You'll Have:

- 🔐 **Secure login** system
- 🔄 **Multi-device sync** ready
- 👥 **Invite system** for family/friends
- 🛡️ **Row-level security** (each user sees only their data)
- 📱 **Ready to deploy** to Vercel/Netlify

---

## 📁 Files Created:

- ✅ `.env.local` - Your API keys (don't commit!)
- ✅ `.gitignore` - Protects your secrets
- ✅ `utils/supabase/client.ts` - Supabase connection
- ✅ `contexts/AuthContext.tsx` - Auth state management
- ✅ `components/AuthScreen.tsx` - Login/signup UI
- ✅ `components/AdminPanel.tsx` - Invite management
- ✅ `supabase/migrations/001_security_setup.sql` - Database setup
- ✅ `SECURITY_SETUP.md` - Complete security guide
- ✅ `DEPLOYMENT.md` - How to deploy

---

## 🤔 Need Help?

Check these files in order:
1. **QUICK_START.md** (this file) - Do this first
2. **SECURITY_SETUP.md** - Detailed security explanation
3. **DEPLOYMENT.md** - How to deploy to production

---

## 🎯 Next Steps After Setup:

1. Test login/logout locally
2. Invite one family member via Admin Panel
3. Test sync between two devices (phone + computer)
4. Deploy to Vercel (see DEPLOYMENT.md)
5. Share the URL with family!

---

## 💡 Pro Tips:

- Use **Magic Link** option for passwordless login (easier for family)
- Each person needs their **own email** - don't share accounts
- You can see who's signed up in the **Admin Panel**
- All workout data is **private** - even admins can't see it

---

**Questions? Let me know what step you're stuck on!**
