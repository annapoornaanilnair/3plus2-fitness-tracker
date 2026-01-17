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
            // Strawberry matcha theme: warm pink base
            return 'from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4]';
        }

        if (mode === 'dark') {
            // Dark cozy: charcoal with warm undertones
            return 'from-[#2A2A2A] via-[#3A2A2A] to-[#3A3A3A]';
        }

        if (mode === 'time') {
            const hour = new Date().getHours();

            // Morning (5am-11am): Warm pink sunrise
            if (hour >= 5 && hour < 11) {
                return 'from-[#FFF0F5] via-[#FFE8E0] to-[#FFF4E6]';
            }

            // Afternoon (11am-5pm): Fresh strawberry pink
            if (hour >= 11 && hour < 17) {
                return 'from-[#FFF5F7] via-[#FFE0E6] to-[#F5DDD4]';
            }

            // Evening (5pm-9pm): Sunset towards deeper strawberry
            if (hour >= 17 && hour < 21) {
                return 'from-[#FFF4E6] via-[#F5DDD4] to-[#EDC4B3]';
            }

            // Night (9pm-5am): Deep cozy vibes
            return 'from-[#2A2A2A] via-[#3A2A2A] to-[#3A3A3A]';
        }

        if (mode === 'energy') {
            // High energy (7-10): Vibrant strawberry with brightness
            if (energy >= 7) {
                return 'from-[#FFF5F7] via-[#FFD6E0] to-[#EDC4B3]';
            }

            // Medium energy (4-6): Balanced pink blend
            if (energy >= 4) {
                return 'from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4]';
            }

            // Low energy (1-3): Soft calming pastels - pure comfort
            return 'from-[#FFF5F7] via-[#F5DDD4] to-[#D4956A]';
        }

        return 'from-[#FFF5F7] via-[#FFE8E0] to-[#F5DDD4]';
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
