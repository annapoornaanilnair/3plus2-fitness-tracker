import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AppMode = 'light' | 'dark' | 'energy' | 'time';

interface ThemeContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    getBackgroundGradient: (energy?: number) => string;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<AppMode>(() => {
        const saved = localStorage.getItem('fitness-mode');
        return (saved as AppMode) || 'light';
    });

    // Save mode preference
    useEffect(() => {
        localStorage.setItem('fitness-mode', mode);
    }, [mode]);

    const setMode = (newMode: AppMode) => {
        setModeState(newMode);
    };

    // Get dynamic background gradient based on mode
    const getBackgroundGradient = (energy: number = 5): string => {
        if (mode === 'light') {
            return 'from-[#FDFBF7] to-[#F5F1EB]';
        }

        if (mode === 'dark') {
            return 'from-gray-900 to-gray-800';
        }

        if (mode === 'time') {
            const hour = new Date().getHours();

            // Morning (5am-11am): Fresh sunrise
            if (hour >= 5 && hour < 11) {
                return 'from-orange-100 via-pink-50 to-[#FDFBF7]';
            }

            // Afternoon (11am-5pm): Bright daylight
            if (hour >= 11 && hour < 17) {
                return 'from-blue-50 via-cyan-50 to-[#F5F1EB]';
            }

            // Evening (5pm-9pm): Sunset
            if (hour >= 17 && hour < 21) {
                return 'from-purple-100 via-orange-100 to-[#FFF5F0]';
            }

            // Night (9pm-5am): Calm darkness
            return 'from-indigo-100 via-purple-50 to-[#FDFBF7]';
        }

        if (mode === 'energy') {
            // High energy (7-10): Vibrant gradients
            if (energy >= 7) {
                return 'from-green-100 via-teal-100 to-emerald-50';
            }

            // Medium energy (4-6): Balanced
            if (energy >= 4) {
                return 'from-[#A3C9A8]/20 via-[#EDC4B3]/20 to-[#FDFBF7]';
            }

            // Low energy (1-3): Soft pastels
            return 'from-rose-50 via-pink-50 to-[#FFF5F0]';
        }

        return 'from-[#FDFBF7] to-[#F5F1EB]';
    };

    return (
        <ThemeContext.Provider value={{
            mode,
            setMode,
            getBackgroundGradient
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
