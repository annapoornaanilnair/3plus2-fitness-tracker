/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./main.tsx",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: '#FDFBF7',
                sage: '#A3C9A8',
                'sage-light': '#C5E0C9',
                'sage-dark': '#82A885',
                'dusty-pink': '#EDC4B3',
                'dusty-pink-dark': '#D4956A',
                'dusty-pink-light': '#F5DDD4',
                charcoal: '#4A4A4A',
                matcha: '#A3C9A8',
                strawberry: '#F85E5E',
            },
            fontFamily: {
                raleway: ['Raleway', 'sans-serif'],
                lato: ['Lato', 'sans-serif'],
                nunito: ['Nunito', 'sans-serif'],
                quicksand: ['Quicksand', 'sans-serif'],
            },
            borderRadius: {
                'squircle-sm': '1.25rem',
                'squircle': '1.5rem',
                'squircle-lg': '2rem',
                'squircle-xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(74, 74, 74, 0.06)',
                'soft-md': '0 4px 12px rgba(74, 74, 74, 0.08)',
                'soft-lg': '0 8px 20px rgba(74, 74, 74, 0.1)',
                'soft-xl': '0 12px 32px rgba(74, 74, 74, 0.12)',
                'glow': '0 0 20px rgba(163, 201, 168, 0.15)',
                'glow-pink': '0 0 20px rgba(237, 196, 179, 0.15)',
                'inner-soft': 'inset 0 1px 3px rgba(74, 74, 74, 0.05)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float 4s ease-in-out infinite',
                'float-slower': 'float 5s ease-in-out infinite',
                'drift': 'drift 6s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                drift: {
                    '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
                    '50%': { transform: 'translateX(4px) translateY(-4px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shimmer: {
                    '0%, 100%': { backgroundPosition: '200% center' },
                    '50%': { backgroundPosition: '0% center' },
                },
            },
        },
    },
    plugins: [],
}
