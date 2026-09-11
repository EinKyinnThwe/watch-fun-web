/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                background: '#0a0a0b',
                surface: '#141416',
                'surface-elevated': '#1c1c1f',
                card: '#18181b',

                // Brand
                primary: '#e50914',
                'primary-hover': '#f40612',
                'primary-dark': '#b20710',

                // Rating
                rating: '#f5c518',

                // Text
                secondary: '#a1a1aa',
                muted: '#71717a',

                // Borders
                border: '#27272a',
                'border-hover': '#3f3f46',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                xl: '0.875rem',
                '2xl': '1rem',
            },
            boxShadow: {
                'primary': '0 10px 25px -5px rgba(229, 9, 20, 0.25)',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-400px 0' },
                    '100%': { backgroundPosition: '400px 0' },
                },
            },
            animation: {
                shimmer: 'shimmer 1.4s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};