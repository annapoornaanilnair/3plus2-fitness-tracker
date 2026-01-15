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
                cream: '#F5F3EE',
                sage: '#A8B5A0',
                'dusty-pink': '#D4A5A5',
                charcoal: '#3A3A3A',
            },
            fontFamily: {
                raleway: ['Raleway', 'sans-serif'],
                lato: ['Lato', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
