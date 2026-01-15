# 3+2 Fitness Tracker 💪

A modern, progressive web app (PWA) for tracking your fitness journey with a personalized 3 days strength + 2 days cardio workout plan.

## Features ✨

- **Personalized Workout Plan** - 3 days strength training, 2 days cardio, customizable exercises
- **Progress Tracking** - Log weight, track sets completed, monitor your streak
- **Daily Check-ins** - Energy level tracking and mood logging before each workout
- **Celebration Rewards** - Visual celebrations for completed workouts
- **Shareable Cards** - Download and share your workout achievements
- **Cloud Sync** - Real-time sync across devices with Supabase
- **Progressive Web App** - Works offline, installable on mobile and desktop
- **Dark/Light Theme** - Beautiful UI with theme preferences
- **Notification Reminders** - Daily workout reminders at your preferred time

## Quick Start 🚀

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (free tier works great)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/annapoornaanilnair/3plus2-fitness-tracker.git
cd 3plus2-fitness-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to SQL Editor and run the migrations:
     - `supabase/migrations/001_security_setup.sql`
     - `supabase/migrations/002_add_app_data.sql`

4. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Build for Production 📦

```bash
npm run build
npm run preview
```

## Project Structure 📁

```
├── components/        # React components
│   ├── Dashboard.tsx
│   ├── WorkoutPlayer.tsx
│   ├── ProfilePage.tsx
│   └── ...
├── contexts/          # React context (Auth, Theme)
├── hooks/             # Custom hooks (useAppState)
├── utils/             # Utility functions
│   └── supabase/      # Supabase client & configuration
├── styles/            # Tailwind CSS
├── public/            # Static assets & PWA icons
├── supabase/          # Database migrations
└── types/             # TypeScript definitions
```

## Tech Stack 🛠️

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Supabase (PostgreSQL)
- **PWA**: Vite PWA Plugin
- **Build**: Vite
- **State**: React Context + localStorage
- **Forms**: React Hook Form

## Features in Detail 🎯

### Workout Customization
- Create custom exercises for each day
- Set weight, reps, and sets
- Save your exercise preferences
- Modify the default plan anytime

### Progress Tracking
- Log completed sets and weights
- Track daily energy levels
- Monitor your workout streak
- View weekly completion bubbles

### Cloud Sync
- Automatic sync to Supabase
- Works offline with localStorage
- Seamless multi-device support
- Real-time updates

### PWA Capabilities
- Install as mobile app
- Offline functionality
- Home screen icon
- Works on iOS and Android

## Contributing 🤝

Feel free to fork, modify, and use this project for your fitness journey!

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For issues, feature requests, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for your fitness goals**
