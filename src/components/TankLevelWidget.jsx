import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Droplets, AlertTriangle, TrendingUp, Activity, Clock, Zap, Bell } from 'lucide-react';
import { API_URL } from '../config';
import { io } from 'socket.io-client';

// Spring-based animated number
const AnimatedNumber = ({ value, suffix = '' }) => {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 75, damping: 15 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    useEffect(() => {
        return springValue.on('change', (latest) => {
            setDisplayValue(Math.round(latest));
        });
    }, [springValue]);

    return <span>{displayValue}{suffix}</span>;
};

// Premium bubble component
const Bubble = ({ delay, x, size, duration }) => (
    <motion.div
        initial={{ y: '100%', x: `${x}%`, opacity: 0, scale: 0 }}
        animate={{
            y: '-30%',
            opacity: [0, 0.8, 0.5, 0],
            scale: [0, 1.2, 1, 0.5],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeOut',
        }}
        className="absolute bottom-0 rounded-full pointer-events-none"
        style={{
            width: size,
            height: size,
            left: `${x}%`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(6,182,212,0.4))',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 6px rgba(255,255,255,0.5)',
        }}
    />
);

const TankLevelWidget = ({ overrideLevel }) => {
    const [tankData, setTankData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState('Just now');
    const containerRef = useRef(null);

    useEffect(() => {
        if (overrideLevel !== undefined) return;

        const fetchCurrent = async () => {
            try {
                const res = await fetch(`${API_URL}/api/tank/current`);
                const data = await res.json();
                setTankData(data);
            } catch (err) {
                console.error('Failed to fetch tank data', err);
            }
        };
        fetchCurrent();

        const socket = io(API_URL);
        socket.on('tank:update', (data) => {
            setTankData(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [overrideLevel]);

    useEffect(() => {
        if (!tankData?.lastUpdated) return;
        const interval = setInterval(() => {
            const diff = Math.floor((new Date() - new Date(tankData.lastUpdated)) / 1000);
            if (diff < 60) setLastUpdated(`${diff}s ago`);
            else if (diff < 3600) setLastUpdated(`${Math.floor(diff / 60)}m ago`);
            else setLastUpdated(`${Math.floor(diff / 3600)}h ago`);
        }, 1000);
        return () => clearInterval(interval);
    }, [tankData?.lastUpdated]);

    // Generate premium bubbles
    const bubbles = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: 10 + (i * 11) + Math.random() * 8,
            size: 3 + Math.random() * 5,
            delay: i * 0.6,
            duration: 2 + Math.random() * 2,
        }));
    }, []);

    // Wave paths for liquid animation
    const wavePaths = useMemo(() => [
        "M0,35 Q125,-5 250,35 T500,35 T750,35 T1000,35 L1000,1000 L0,1000 Z",
        "M0,55 Q125,85 250,55 T500,55 T750,55 T1000,55 L1000,1000 L0,1000 Z",
        "M0,15 Q125,45 250,15 T500,15 T750,15 T1000,15 L1000,1000 L0,1000 Z",
        "M0,45 Q125,75 250,45 T500,45 T750,45 T1000,45 L1000,1000 L0,1000 Z",
    ], []);

    const isOverride = overrideLevel !== undefined;
    const level = isOverride ? overrideLevel : (tankData ? tankData.currentLevel : 0);

    // Calculate Status
    let status = 'Normal';
    if (isOverride) {
        if (level < 20) status = 'Critical';
        else if (level < 40) status = 'Low';
        else if (level > 90) status = 'Overflow';
    } else {
        status = tankData ? tankData.status : 'Normal';
    }

    // Status Styling with premium gradients
    const getStatusStyle = () => {
        if (status === 'Critical') return {
            color: '#ef4444',
            glow: 'rgba(239, 68, 68, 0.5)',
            bgFrom: '#dc2626',
            bgTo: '#ef4444',
            gradient: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)',
            textClass: 'text-red-600',
            badgeClass: 'bg-red-50 border-red-200'
        };
        if (status === 'Low') return {
            color: '#f97316',
            glow: 'rgba(249, 115, 22, 0.4)',
            bgFrom: '#ea580c',
            bgTo: '#f97316',
            gradient: 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)',
            textClass: 'text-orange-600',
            badgeClass: 'bg-orange-50 border-orange-200'
        };
        if (status === 'Overflow') return {
            color: '#a855f7',
            glow: 'rgba(168, 85, 247, 0.5)',
            bgFrom: '#9333ea',
            bgTo: '#a855f7',
            gradient: 'linear-gradient(180deg, #9333ea 0%, #7e22ce 100%)',
            textClass: 'text-purple-600',
            badgeClass: 'bg-purple-50 border-purple-200'
        };
        return {
            color: '#06b6d4',
            glow: 'rgba(6, 182, 212, 0.4)',
            bgFrom: '#0891b2',
            bgTo: '#06b6d4',
            gradient: 'linear-gradient(180deg, #0891b2 0%, #0e7490 100%)',
            textClass: 'text-cyan-600',
            badgeClass: 'bg-cyan-50 border-cyan-200'
        };
    };

    const style = getStatusStyle();

    // Smart insight based on level
    const getInsight = () => {
        if (level < 25) {
            return {
                type: 'critical',
                icon: AlertTriangle,
                message: 'Critical level! Immediate refill recommended to avoid supply disruption.',
                bgGradient: 'from-red-50/90 to-orange-50/90',
                borderColor: 'border-red-200/50',
                iconColor: 'text-red-500',
            };
        } else if (level < 50) {
            return {
                type: 'warning',
                icon: Droplets,
                message: 'Water level declining. Consider scheduling a refill within 2 hours.',
                bgGradient: 'from-orange-50/90 to-yellow-50/90',
                borderColor: 'border-orange-200/50',
                iconColor: 'text-orange-500',
            };
        } else if (level > 85) {
            return {
                type: 'info',
                icon: Bell,
                message: 'Near overflow. Reduce inflow to prevent water wastage.',
                bgGradient: 'from-purple-50/90 to-cyan-50/90',
                borderColor: 'border-purple-200/50',
                iconColor: 'text-purple-500',
            };
        }
        return {
            type: 'success',
            icon: Zap,
            message: 'Water level stable. All systems operating normally.',
            bgGradient: 'from-cyan-50/90 to-green-50/90',
            borderColor: 'border-cyan-200/50',
            iconColor: 'text-cyan-500',
        };
    };

    const insight = getInsight();
    const InsightIcon = insight.icon;

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 p-8 rounded-3xl relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(241,245,249,0.95) 0%, rgba(224,242,254,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148,163,184,0.3)',
                boxShadow: `0 0 40px ${style.glow}, 0 25px 50px -12px rgba(0,0,0,0.1)`,
            }}
        >
            {/* Ambient glow background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${style.glow}20 0%, transparent 60%)`,
                }}
            />

            {/* Tank */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
            >
                {/* Tank container with premium styling */}
                <div
                    className="relative w-52 h-80 rounded-t-[2.5rem] rounded-b-[3rem] overflow-hidden"
                    style={{
                        boxShadow: `
                            0 0 0 1px ${style.color}30,
                            0 0 60px ${style.glow},
                            inset 0 0 40px rgba(0,0,0,0.2)
                        `,
                    }}
                >
                    {/* Glass reflection */}
                    <div
                        className="absolute inset-0 z-30 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 100%)',
                        }}
                    />

                    {/* Background grid with premium styling */}
                    <div className="absolute inset-0 z-0 flex flex-col justify-between py-5 opacity-20">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        ))}
                    </div>

                    {/* Percentage markers */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-between py-5 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center px-4">
                                <span className="text-[10px] text-white/60 font-medium tabular-nums">
                                    {100 - i * 20}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Animated water with multi-layer waves */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: `${100 - level}%` }}
                        transition={{
                            type: 'spring',
                            bounce: 0.1,
                            stiffness: 60,
                            damping: 18,
                            duration: 2,
                        }}
                        className="absolute bottom-0 w-[400%] h-[120%] z-10"
                        style={{ left: '-150%' }}
                    >
                        <svg viewBox="0 0 1000 1000" className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={`widgetGrad-${status}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor={style.color} stopOpacity="0.95" />
                                    <stop offset="50%" stopColor={style.color} stopOpacity="0.8" />
                                    <stop offset="100%" stopColor={style.bgFrom} stopOpacity="1" />
                                </linearGradient>
                                <filter id={`widgetGlow-${status}`}>
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Primary wave */}
                            <motion.path
                                d={wavePaths[0]}
                                fill={`url(#widgetGrad-${status})`}
                                filter={`url(#widgetGlow-${status})`}
                                animate={{ d: wavePaths }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />

                            {/* Secondary wave for depth */}
                            <motion.path
                                d={wavePaths[2]}
                                fill={style.color}
                                opacity="0.25"
                                animate={{ d: wavePaths.reverse() }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 0.3,
                                }}
                            />
                        </svg>
                    </motion.div>

                    {/* Premium bubbles */}
                    {bubbles.map((bubble) => (
                        <Bubble key={bubble.id} {...bubble} />
                    ))}

                    {/* Percentage overlay with spring animation */}
                    <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
                        <motion.div
                            key={level}
                            initial={{ scale: 0.3, opacity: 0, filter: 'blur(15px)' }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                filter: 'blur(0px)'
                            }}
                            transition={{
                                type: 'spring',
                                bounce: 0.5,
                                stiffness: 180,
                                damping: 20,
                                duration: 0.8,
                            }}
                            className="text-center"
                        >
                            <div className="relative">
                                <p className="text-6xl font-display font-bold text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)] tracking-tight">
                                    <AnimatedNumber value={Math.round(level)} />
                                </p>
                                <p className="text-sm text-white/60 font-medium -mt-2">%</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Shimmer effect */}
                    <div
                        className="absolute inset-0 z-30 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                            animation: 'shimmer 4s ease-in-out infinite',
                            backgroundSize: '200% 100%',
                        }}
                    />
                </div>

                {/* Premium Status indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-6 flex items-center justify-center gap-3"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.5, 1],
                            boxShadow: [
                                `0 0 10px ${style.color}`,
                                `0 0 20px ${style.color}`,
                                `0 0 10px ${style.color}`
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: style.color }}
                    />
                    <span
                        className="text-base font-bold tracking-wide uppercase"
                        style={{ color: style.color }}
                    >
                        {status}
                    </span>
                </motion.div>
            </motion.div>

            {/* Info panel */}
            <div className="flex-1 space-y-5 w-full z-10 max-w-md">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Primary Reservoir</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Clock size={14} className="text-slate-500" />
                        {isOverride ? (
                            <span className="inline-flex items-center gap-1.5 text-cyan-600">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                                </span>
                                Live Simulation Active
                            </span>
                        ) : (
                            `Last updated: ${lastUpdated}`
                        )}
                    </p>
                </motion.div>

                {/* Stats grid with premium cards */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Flow Rate', value: '2.4 L/min', icon: Droplets, color: '#06b6d4', delay: 0.3 },
                        { label: 'Status', value: status, icon: Activity, color: style.color, delay: 0.35 },
                        { label: 'Est. Empty', value: level < 25 ? '12 min' : '--', icon: AlertTriangle, color: level < 25 ? '#ef4444' : '#64748b', delay: 0.4 },
                        { label: 'Refill Trend', value: level < 50 ? '-0.5%/hr' : '+0.8%/hr', icon: TrendingUp, color: level < 50 ? '#ef4444' : '#22c55e', delay: 0.45 },
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stat.delay, duration: 0.4 }}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: `0 10px 30px ${stat.color}20`,
                            }}
                            className="p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-default"
                            style={{
                                background: `linear-gradient(135deg, ${stat.color}15 0%, rgba(255,255,255,0.8) 100%)`,
                                borderColor: `${stat.color}40`,
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <stat.icon size={14} style={{ color: stat.color }} />
                                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                            </div>
                            <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Premium Smart insight */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.01 }}
                    className={`p-5 rounded-2xl bg-gradient-to-r ${insight.bgGradient} backdrop-blur-md border ${insight.borderColor}`}
                >
                    <p className={`text-xs font-bold mb-2 flex items-center gap-2 ${insight.iconColor}`}>
                        <InsightIcon size={14} />
                        Smart Insight
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        {insight.message}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TankLevelWidget;
