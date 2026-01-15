# PWA Installation Guide 📱

Your app is now a **Progressive Web App (PWA)**! You can install it on your phone like a native app.

## 🎉 What's New

- ✅ **Installable** - Add to home screen on mobile
- ✅ **Offline capable** - Works without internet
- ✅ **App-like experience** - Full screen, no browser UI
- ✅ **Fast loading** - Caches assets for instant access
- ✅ **Auto-updates** - Gets latest version automatically

---

## 📱 Install on iPhone/iPad

1. **Open Safari** (must use Safari, not Chrome)
2. **Go to your deployed app URL**
3. **Tap the Share button** (square with arrow pointing up)
4. **Scroll down** and tap **"Add to Home Screen"**
5. **Tap "Add"** in the top right
6. App icon appears on your home screen! 🎉

### iPhone Tips:
- Icon will be green with "3+2" logo
- Opens in full screen (no Safari UI)
- Works offline after first load
- Gets notifications (if enabled)

---

## 📱 Install on Android

1. **Open Chrome browser**
2. **Go to your deployed app URL**
3. **Tap the menu (⋮)** in top right
4. **Tap "Install app" or "Add to Home Screen"**
5. **Tap "Install"**
6. App appears on your home screen! 🎉

### Android Tips:
- May show install banner automatically
- Icon will be green with "3+2" logo
- Runs like a native app
- Full offline support

---

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build your app:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Link to your account
   - Set project name
   - Accept defaults
   - Get your live URL!

5. **Your app is live!** Share the URL or install on phone

### Option 2: Netlify (Also Free)

1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Your app is live!**

### Option 3: GitHub Pages

1. **Update vite.config.ts** - Add your repo name as base:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## 🧪 Testing PWA Locally

### Before Deploying:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Test PWA features:**
   - Open DevTools (F12)
   - Go to **Application** tab
   - Check **Service Workers** section
   - Should see "activated and running"
   - Check **Manifest** section
   - Should see app name, icons, etc.

4. **Test Install:**
   - Chrome will show install icon in address bar
   - Click to test installation
   - App opens in standalone window

### Dev Mode:
The PWA also works in dev mode now:
```bash
npm run dev
```
- Service worker runs in development
- You can test install even in dev
- Hot reload still works!

---

## 🔧 Environment Variables

Make sure to set these in your deployment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vercel:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify:
Add in **Site settings → Environment variables**

---

## 📊 PWA Checklist

Before you deploy, verify:

- ✅ **Icons generated** - Check `public/` folder for PNG files
- ✅ **Manifest configured** - App name, colors, icons
- ✅ **Service worker enabled** - Vite PWA plugin active
- ✅ **HTTPS deployment** - PWAs require secure connection
- ✅ **Environment variables** - Set in deployment platform
- ✅ **Supabase migration run** - Cloud sync works

---

## 🎨 Customizing PWA

### Change App Name:
Edit `vite.config.ts`:
```typescript
manifest: {
  name: 'Your App Name',
  short_name: 'Short Name',
  // ...
}
```

### Change Colors:
```typescript
manifest: {
  theme_color: '#yourcolor',
  background_color: '#yourcolor',
  // ...
}
```

### New Icons:
1. Create new icons in `public/`
2. Update sizes in `vite.config.ts` manifest
3. Rebuild and redeploy

---

## 🐛 Troubleshooting

### "Add to Home Screen" not showing?
- **iPhone:** Must use Safari (not Chrome)
- **Android:** May need to visit site 2-3 times
- **Desktop:** Look for install icon in address bar

### Service Worker not activating?
- Must be served over HTTPS (or localhost)
- Check DevTools → Application → Service Workers
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Icons not showing?
- Check `public/` folder has PNG files
- Run `node generate-icons.mjs` to regenerate
- Clear cache and rebuild

### App not working offline?
- Visit app while online first
- Service worker needs to cache files
- Check DevTools → Application → Cache Storage
- Should see cached files

### Updates not appearing?
- App checks for updates every hour
- Manual: Close all tabs and reopen
- Or: Uninstall and reinstall PWA

---

## 📱 Phone-Specific Features

### iOS Specific:
```html
<!-- Already added in index.html -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

### Android Specific:
```html
<!-- Already added in index.html -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#A3C9A8">
```

---

## 🎯 Quick Start

**Fastest way to get it on your phone:**

1. **Deploy to Vercel:**
   ```bash
   npm run build
   vercel
   ```

2. **Get your URL** (something like `yourapp.vercel.app`)

3. **Open on phone** and install!

That's it! Your fitness tracker is now installable on any device! 💪

---

## 📝 Next Steps

After installation:
1. Login to your account
2. Enable notifications (Profile → Daily Reminder)
3. Complete your first workout
4. App works offline from now on!
5. Share with friends! 🎉
