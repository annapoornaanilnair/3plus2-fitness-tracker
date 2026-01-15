# 🚀 Deployment Guide - 3+2 Fitness Tracker

## 📋 Prerequisites

Before deploying, you need:
- ✅ Completed SECURITY_SETUP.md (database setup)
- ✅ Verified your email in `approved_users` table
- ✅ Tested locally that authentication works
- ✅ Git repository (for Vercel/Netlify deployment)

---

## 🎯 Recommended: Deploy to Vercel (Free)

### Why Vercel?
- ✅ **Free tier** with generous limits
- ✅ **Automatic HTTPS** 
- ✅ **Environment variables** built-in
- ✅ **Auto-deploy** on git push
- ✅ **Global CDN** for fast loading

### Step-by-Step:

#### 1. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with security features"

# Create GitHub repo at https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/3plus2-fitness.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to **https://vercel.com**
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite (or detect automatically)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   
5. Add Environment Variables:
   - `VITE_SUPABASE_URL` = `https://ngsvaqyttrfvsivvdhtc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (copy from .env.local)

6. Click **"Deploy"**

7. Wait 2-3 minutes ☕

8. Your app is live! (e.g., `https://3plus2-fitness.vercel.app`)

---

## 🔄 Alternative: Deploy to Netlify (Free)

### Step-by-Step:

#### 1. Push to GitHub (same as above)

#### 2. Deploy to Netlify

1. Go to **https://netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub
4. Select your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:**
     - `VITE_SUPABASE_URL` = `https://ngsvaqyttrfvsivvdhtc.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = (copy from .env.local)

6. Click **"Deploy site"**

7. Your app is live! (e.g., `https://3plus2-fitness.netlify.app`)

---

## 🔧 Configure Supabase for Production

### Update Supabase Settings:

1. Go to **https://supabase.com/dashboard/project/ngsvaqyttrfvsivvdhtc/auth/url-configuration**

2. Add your deployment URLs:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** Add:
     - `https://your-app.vercel.app`
     - `https://your-app.vercel.app/**`
     - `http://localhost:5173` (for local dev)

3. Go to **Authentication** → **Email Templates**
   - Customize welcome email if desired
   - Verify "Confirm signup" is enabled

4. Go to **Database** → **Replication**
   - Verify backups are enabled (default: daily)

---

## 🔐 Security Checklist for Production

- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Environment variables added to Vercel/Netlify
- [ ] Supabase redirect URLs updated
- [ ] Row-Level Security enabled (already done via SQL)
- [ ] Only approved emails can sign up (already done)
- [ ] HTTPS is enforced (automatic on Vercel/Netlify)
- [ ] Tested login/logout on production URL

---

## 📱 Make it a PWA (Progressive Web App)

Users can "install" the app on their phone/tablet!

### 1. Create manifest.json

Create `public/manifest.json`:

```json
{
  "name": "3+2 Fitness Tracker",
  "short_name": "3+2 Fitness",
  "description": "Your personal fitness companion",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F3EE",
  "theme_color": "#A8B5A0",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Add to index.html

In `index.html`, add inside `<head>`:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#A8B5A0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="3+2 Fitness">
```

### 3. Create Icons

Generate 192x192 and 512x512 PNG icons with a dumbbell emoji or logo:
- Use https://favicon.io/favicon-generator/
- Save as `public/icon-192.png` and `public/icon-512.png`

### 4. Redeploy

```bash
git add public/
git commit -m "Add PWA support"
git push
```

Now users can:
- **iOS:** Tap Share → Add to Home Screen
- **Android:** Tap menu → Install app

---

## 🌐 Custom Domain (Optional)

### Vercel:

1. Buy domain (Namecheap, Google Domains, etc.)
2. In Vercel: Settings → Domains
3. Add your domain: `fitness.yourdomain.com`
4. Update DNS records (Vercel shows you exactly what to add)
5. Wait 24-48 hours for DNS propagation

### Don't forget:
- Update Supabase redirect URLs to include new domain
- Update `VITE_SUPABASE_URL` if needed

---

## 📊 Monitor Your Deployment

### Vercel Analytics (Free):

1. In Vercel dashboard → Analytics
2. See page views, unique visitors, load times
3. Completely privacy-friendly (no cookies)

### Supabase Metrics:

1. https://supabase.com/dashboard/project/ngsvaqyttrfvsivvdhtc
2. Check:
   - Database size
   - Active users
   - API requests
   - Auth events

---

## 🐛 Troubleshooting Production Issues

### "Invalid API key" on production
**Solution:** Check Vercel/Netlify environment variables match .env.local

### Redirect loop after login
**Solution:** Verify Supabase redirect URLs include your production domain

### CORS errors
**Solution:** Supabase should allow your domain. Check Auth → URL Configuration

### Users can't sign up
**Solution:** Make sure their email is in `approved_users` table

### Sync not working
**Solution:** Check Network tab in browser DevTools for failed requests

---

## 🔄 Update Workflow

When you make changes:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Vercel/Netlify auto-deploys in ~2 minutes
```

For urgent fixes:
```bash
# Create a new deployment immediately
vercel --prod  # If using Vercel CLI
```

---

## 💰 Cost Breakdown

### For 10-20 family/friends:

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Vercel** | Free | $0 | 100GB bandwidth/mo |
| **Supabase** | Free | $0 | 500MB DB, 50K users |
| **Domain** | Optional | $10-15/year | N/A |
| **Total** | | **$0-15/year** | More than enough! |

### When to upgrade:

- **Supabase Pro ($25/mo):** Only if you exceed 500MB database or need 99.9% SLA
- **Vercel Pro ($20/mo):** Only if you exceed 100GB bandwidth or want custom features

For personal/family use, **free tier is plenty!**

---

## 📈 Performance Optimization

### Already implemented:
- ✅ Optimistic UI updates (instant feedback)
- ✅ Background sync (doesn't block UI)
- ✅ LocalStorage caching
- ✅ Lightweight bundle (React + Supabase)

### Future optimizations:
- [ ] Image lazy loading
- [ ] Code splitting by route
- [ ] Service worker for offline mode
- [ ] Compress images

---

## 🎉 You're Live!

Share your app with family:

1. **Send them the URL:** `https://your-app.vercel.app`
2. **Add their emails** in Admin Panel
3. **Tell them to sign up** with that exact email
4. **They're in!** 🏋️‍♀️

---

## 📞 Need Help?

### Common Resources:
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev

### Check logs:
- **Vercel:** Dashboard → Deployments → Click deployment → Logs
- **Netlify:** Site → Deploys → Click deploy → Deploy log
- **Supabase:** Dashboard → Logs

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel or Netlify
- [ ] Environment variables configured
- [ ] Supabase redirect URLs updated
- [ ] Tested login/logout on production
- [ ] Invited yourself and one test user
- [ ] Verified sync works across devices
- [ ] PWA manifest added (optional)
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

**All done? Congratulations! Your secure fitness tracker is live! 🎊**
