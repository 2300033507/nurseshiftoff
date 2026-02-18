/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                medical: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9', // Primary Blue
                    600: '#0284c7',
                    900: '#0c4a6e',
                },
                accent: {
                    500: '#6366f1', // Indigo for interactive elements
                    600: '#4f46e5',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-in-from-bottom-2': 'slideUp 0.5s ease-out',
            }
        },
    },
    plugins: [],
}