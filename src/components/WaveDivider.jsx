import React from 'react';
import { motion } from 'framer-motion';

const WaveDivider = ({ variant = 'ocean', className = '' }) => {
    const variants = {
        ocean: {
            primary: '#0ea5e9',
            secondary: '#0369a1',
            tertiary: '#0284c7',
            bgFrom: 'from-ocean-50/50',
            bgTo: 'to-ocean-100/50',
            glowColor: 'rgba(14, 165, 233, 0.3)',
        },
        dark: {
            primary: '#0c4a6e',
            secondary: '#082f49',
            tertiary: '#0c4a6e',
            bgFrom: 'from-slate-900/80',
            bgTo: 'to-ocean-950/80',
            glowColor: 'rgba(6, 182, 212, 0.2)',
        },
        light: {
            primary: '#e0f2fe',
            secondary: '#bae6fd',
            tertiary: '#7dd3fc',
            bgFrom: 'from-white',
            bgTo: 'to-slate-50',
            glowColor: 'rgba(14, 165, 233, 0.2)',
        },
        gradient: {
            primary: '#06b6d4',
            secondary: '#a855f7',
            tertiary: '#22d3ee',
            bgFrom: 'from-cyan-50/30',
            bgTo: 'to-purple-50/30',
            glowColor: 'rgba(6, 182, 212, 0.25)',
        },
    };

    const { primary, secondary, tertiary, bgFrom, bgTo, glowColor } = variants[variant] || variants.ocean;

    // Wave paths for organic motion
    const wavePaths = {
        back: "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z",
        middle: "M0,50 C180,10 360,70 540,30 C720,80 900,20 1080,50 C1260,80 1350,40 1440,50 L1440,80 L0,80 Z",
        front: "M0,60 C120,30 240,70 360,40 C480,80 600,30 720,60 C840,80 960,40 1080,60 C1200,70 1320,50 1440,60 L1440,80 L0,80 Z",
    };

    return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ height: '90px' }}>
            {/* Top gradient fade for seamless blend */}
            <div className={`absolute inset-0 bg-gradient-to-b ${bgFrom} ${bgTo} z-10`} />

            {/* Premium glow effect at the top of waves */}
            <div
                className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
                style={{
                    height: '60px',
                    background: `linear-gradient(to top, ${glowColor}40, transparent)`,
                    filter: 'blur(10px)',
                }}
            />

            {/* Animated wave SVG with smooth motion */}
            <svg
                className="absolute bottom-0 w-full h-full"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Back wave - slowest, most transparent */}
                <motion.path
                    d={wavePaths.back}
                    fill={secondary}
                    opacity="0.4"
                    animate={{
                        d: [
                            wavePaths.back,
                            "M0,35 C240,75 480,5 720,35 C960,75 1200,5 1440,35 L1440,80 L0,80 Z",
                            wavePaths.back,
                        ],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Middle wave - medium speed */}
                <motion.path
                    d={wavePaths.middle}
                    fill={tertiary}
                    opacity="0.5"
                    animate={{
                        d: [
                            wavePaths.middle,
                            "M0,45 C180,5 360,65 540,25 C720,75 900,15 1080,45 C1260,75 1350,35 1440,45 L1440,80 L0,80 Z",
                            wavePaths.middle,
                        ],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Front wave - fastest, most visible */}
                <motion.path
                    d={wavePaths.front}
                    fill={primary}
                    opacity="0.85"
                    animate={{
                        d: [
                            wavePaths.front,
                            "M0,55 C120,25 240,65 360,35 C480,75 600,25 720,55 C840,75 960,35 1080,55 C1200,65 1320,45 1440,55 L1440,80 L0,80 Z",
                            wavePaths.front,
                        ],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Highlight line on front wave crest */}
                <motion.path
                    d="M0,60 C120,30 240,70 360,40 C480,80 600,30 720,60 C840,80 960,40 1080,60 C1200,70 1320,50 1440,60"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.5"
                    animate={{
                        d: [
                            "M0,60 C120,30 240,70 360,40 C480,80 600,30 720,60 C840,80 960,40 1080,60 C1200,70 1320,50 1440,60",
                            "M0,55 C120,25 240,65 360,35 C480,75 600,25 720,55 C840,75 960,35 1080,55 C1200,65 1320,45 1440,55",
                            "M0,60 C120,30 240,70 360,40 C480,80 600,30 720,60 C840,80 960,40 1080,60 C1200,70 1320,50 1440,60",
                        ],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </svg>

            {/* Bottom glow effect */}
            <div
                className="absolute bottom-0 left-0 w-full h-3"
                style={{
                    background: `linear-gradient(to top, ${glowColor}, transparent)`,
                }}
            />
        </div>
    );
};

export default WaveDivider;
