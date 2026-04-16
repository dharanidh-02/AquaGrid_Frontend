import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AnimatedTank = ({ level = 50, status = 'Normal', showInfo = true, size = 'md' }) => {
    // Determine colors
    let fluidColor = '#06b6d4';
    let gradientStart = '#3b82f6';
    let statusText = 'text-brand-cyan';
    let alertGlow = 'rgba(6, 182, 212, 0.4)';
    let secondaryGlow = 'rgba(6, 182, 212, 0.15)';

    if (status === 'Critical') {
        fluidColor = '#ef4444';
        gradientStart = '#b91c1c';
        statusText = 'text-brand-red';
        alertGlow = 'rgba(239, 68, 68, 0.5)';
        secondaryGlow = 'rgba(239, 68, 68, 0.2)';
    } else if (status === 'Low') {
        fluidColor = '#f97316';
        gradientStart = '#c2410c';
        statusText = 'text-brand-orange';
        alertGlow = 'rgba(249, 115, 22, 0.45)';
        secondaryGlow = 'rgba(249, 115, 22, 0.15)';
    } else if (status === 'Overflow') {
        fluidColor = '#a855f7';
        gradientStart = '#7e22ce';
        statusText = 'text-brand-purple';
        alertGlow = 'rgba(168, 85, 247, 0.5)';
        secondaryGlow = 'rgba(168, 85, 247, 0.2)';
    }

    // Size configurations
    const sizes = {
        sm: { width: 'w-32', height: 'h-52', text: 'text-3xl', padding: 'p-6' },
        md: { width: 'w-48', height: 'h-80', text: 'text-5xl', padding: 'p-8' },
        lg: { width: 'w-56', height: 'h-96', text: 'text-6xl', padding: 'p-10' },
    };

    const { width, height, text, padding } = sizes[size] || sizes.md;

    // Generate wave paths for liquid animation
    const wavePaths = useMemo(() => {
        return [
            "M0,40 Q100,0 200,40 T400,40 T600,40 T800,40 T1000,40 L1000,1000 L0,1000 Z",
            "M0,60 Q100,20 200,60 T400,60 T600,60 T800,60 T1000,60 L1000,1000 L0,1000 Z",
            "M0,20 Q100,60 200,20 T400,20 T600,20 T800,20 T1000,20 L1000,1000 L0,1000 Z",
            "M0,50 Q100,80 200,50 T400,50 T600,50 T800,50 T1000,50 L1000,1000 L0,1000 Z",
        ];
    }, []);

    // Bubbles configuration
    const bubbles = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => ({
            id: i,
            x: 15 + (i * 14),
            size: 3 + Math.random() * 4,
            delay: i * 0.8,
            duration: 2.5 + Math.random() * 1.5,
        }));
    }, []);

    return (
        <div className="flex flex-col items-center">
            {/* Glow effect behind tank */}
            <div
                className={`absolute ${height} ${width} rounded-t-[2rem] rounded-b-[2.5rem]`}
                style={{
                    background: `radial-gradient(ellipse at 50% 80%, ${secondaryGlow} 0%, transparent 70%)`,
                    filter: 'blur(30px)',
                    transform: 'scale(1.2)',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${width} ${height} ${padding} rounded-t-[2rem] rounded-b-[2.5rem] overflow-hidden z-10`}
                style={{
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)',
                    boxShadow: `
                        0 0 0 1px ${fluidColor}20,
                        0 25px 50px -12px ${alertGlow},
                        inset 0 1px 0 rgba(255,255,255,0.1)
                    `,
                }}
            >
                {/* Glass reflection overlay */}
                <div
                    className="absolute inset-0 z-30 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)',
                    }}
                />

                {/* Background Grid */}
                <div className="absolute inset-0 z-0 flex flex-col justify-between py-4 opacity-15 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    ))}
                </div>

                {/* Percentage markers */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between py-4 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center px-2">
                            <span className="text-[8px] text-white/50 font-medium tabular-nums">
                                {100 - (i * 20)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Animated Water Level */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: `${100 - level}%` }}
                    transition={{
                        type: 'spring',
                        bounce: 0.15,
                        stiffness: 80,
                        damping: 20,
                        duration: 1.8,
                    }}
                    className="absolute bottom-0 w-[400%] h-[120%] z-10"
                    style={{ left: '-150%' }}
                >
                    <svg viewBox="0 0 1000 1000" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id={`grad-tank-${status}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={fluidColor} stopOpacity="0.95" />
                                <stop offset="50%" stopColor={fluidColor} stopOpacity="0.85" />
                                <stop offset="100%" stopColor={gradientStart} stopOpacity="1" />
                            </linearGradient>
                            <filter id={`glow-${status}`}>
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <motion.path
                            d={wavePaths[0]}
                            fill={`url(#grad-tank-${status})`}
                            filter={`url(#glow-${status})`}
                            animate={{
                                d: wavePaths,
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </svg>

                    {/* Secondary wave layer for depth */}
                    <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ opacity: 0.5 }}>
                        <motion.path
                            d={wavePaths[2]}
                            fill={fluidColor}
                            opacity="0.3"
                            animate={{
                                d: wavePaths.reverse(),
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                            }}
                        />
                    </svg>
                </motion.div>

                {/* Rising bubbles */}
                {bubbles.map((bubble) => (
                    <motion.div
                        key={bubble.id}
                        initial={{ y: '100%', x: `${bubble.x}%`, opacity: 0, scale: 0 }}
                        animate={{
                            y: '-30%',
                            opacity: [0, 0.8, 0.4, 0],
                            scale: [0, 1, 1.2, 0.8],
                        }}
                        transition={{
                            duration: bubble.duration,
                            delay: bubble.delay,
                            repeat: Infinity,
                            ease: 'easeOut',
                        }}
                        className="absolute bottom-0 rounded-full z-15 pointer-events-none"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            left: `${bubble.x}%`,
                            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${fluidColor}40)`,
                            filter: 'blur(0.5px)',
                        }}
                    />
                ))}

                {/* Percentage Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
                    <motion.div
                        key={level}
                        initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            filter: 'blur(0px)'
                        }}
                        transition={{
                            type: 'spring',
                            bounce: 0.4,
                            stiffness: 150,
                            damping: 20,
                            duration: 0.8,
                        }}
                        className="text-center"
                    >
                        <p className={`${text} font-display font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight`}>
                            {Math.round(level)}
                        </p>
                        <p className="text-xs text-white/60 font-medium -mt-1">%</p>
                    </motion.div>
                </div>

                {/* Shimmer effect */}
                <div
                    className="absolute inset-0 z-30 pointer-events-none opacity-20"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        animation: 'shimmer 3s ease-in-out infinite',
                        backgroundSize: '200% 100%',
                    }}
                />
            </motion.div>

            {showInfo && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-6 text-center backdrop-blur-md px-6 py-3 rounded-2xl border"
                    style={{
                        background: `linear-gradient(135deg, ${fluidColor}10 0%, transparent 100%)`,
                        borderColor: `${fluidColor}30`,
                        boxShadow: `0 0 20px ${secondaryGlow}`,
                    }}
                >
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Status</p>
                    <div className={`text-lg font-bold ${statusText} flex items-center gap-2 justify-center`}>
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                                backgroundColor: fluidColor,
                                boxShadow: `0 0 10px ${fluidColor}`,
                            }}
                        />
                        {status}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AnimatedTank;
