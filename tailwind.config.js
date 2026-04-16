/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#1e3a8a',
                    teal: '#0d9488',
                    green: '#15803d',
                    dark: '#0a0f1c',
                    cyan: '#06b6d4',
                    'cyan-light': '#22d3ee',
                    purple: '#a855f7',
                    'purple-soft': '#c084fc',
                    red: '#ef4444',
                    orange: '#f97316',
                    yellow: '#eab308',
                },
                ocean: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'ocean-gradient': 'linear-gradient(135deg, #0a0f1c 0%, #0c4a6e 40%, #0369a1 70%, #06b6d4 100%)',
                'ocean-surface': 'linear-gradient(180deg, #0ea5e9 0%, #0369a1 50%, #0c4a6e 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                'glow-cyan': 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            },
            animation: {
                'wave-slow': 'wave-slow 6s ease-in-out infinite',
                'wave-fast': 'wave-fast 3s ease-in-out infinite',
                'float': 'float 4s ease-in-out infinite',
                'float-slow': 'float-slow 6s ease-in-out infinite',
                'float-delayed': 'float-delayed 5s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'pulse-glow-fast': 'pulse-glow 1s ease-in-out infinite',
                'ripple': 'ripple 0.6s linear',
                'shimmer': 'shimmer 2.5s ease-in-out infinite',
                'fill-up': 'fill-up 2s ease-out forwards',
                'slide-up': 'slide-up 0.5s ease-out',
                'slide-down': 'slide-down 0.5s ease-out',
                'fade-in': 'fade-in 0.4s ease-out',
                'bubble': 'bubble 4s ease-in-out infinite',
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'spin-slow': 'spin 8s linear infinite',
                'counter': 'counter 1s ease-out',
                'liquid-wobble': 'liquid-wobble 3s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
            },
            keyframes: {
                'wave-slow': {
                    '0%, 100%': { transform: 'translateX(0) translateY(0)' },
                    '25%': { transform: 'translateX(-25%) translateY(3px)' },
                    '50%': { transform: 'translateX(-50%) translateY(0)' },
                    '75%': { transform: 'translateX(-25%) translateY(-3px)' },
                },
                'wave-fast': {
                    '0%, 100%': { transform: 'translateX(0) translateY(0) scaleY(1)' },
                    '50%': { transform: 'translateX(-50%) translateY(2px) scaleY(1.05)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-8px) rotate(1deg)' },
                    '66%': { transform: 'translateY(-4px) rotate(-1deg)' },
                },
                'float-delayed': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)' },
                },
                'pulse-glow-fast': {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' },
                    '50%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.8), 0 0 50px rgba(239, 68, 68, 0.4)' },
                },
                'ripple': {
                    '0%': { transform: 'scale(0)', opacity: '1' },
                    '100%': { transform: 'scale(4)', opacity: '0' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                'fill-up': {
                    '0%': { height: '0%' },
                    '100%': { height: 'var(--fill-height)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'bubble': {
                    '0%': { transform: 'translateY(100%) scale(0.8)', opacity: '0' },
                    '10%': { opacity: '0.6' },
                    '90%': { opacity: '0.3' },
                    '100%': { transform: 'translateY(-100%) scale(1)', opacity: '0' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'liquid-wobble': {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                    '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
                    '75%': { borderRadius: '60% 40% 60% 30% / 70% 30% 50% 60%' },
                },
                'glow-pulse': {
                    '0%': { filter: 'brightness(1) drop-shadow(0 0 2px rgba(6, 182, 212, 0.3))' },
                    '100%': { filter: 'brightness(1.1) drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' },
                },
            },
            boxShadow: {
                'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)',
                'glow-cyan-sm': '0 0 15px rgba(6, 182, 212, 0.3)',
                'glow-purple': '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)',
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)',
                'glow-orange': '0 0 20px rgba(249, 115, 22, 0.4)',
                'glow-liquid': '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)',
                'glass-shadow': '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 20px rgba(6, 182, 212, 0.1)',
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },
    plugins: [],
}
