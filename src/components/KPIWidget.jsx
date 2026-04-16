import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedValue = ({ value }) => {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Extract numeric part from value
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        motionValue.set(numericValue);
    }, [value, motionValue]);

    useEffect(() => {
        return springValue.on('change', (latest) => {
            setDisplayValue(Math.round(latest));
        });
    }, [springValue]);

    // Replace the numeric part in the original value
    const parts = value.match(/^([^0-9.]*)([0-9.]+)(.*)$/);
    if (!parts) return <span>{value}</span>;

    return (
        <span>
            {parts[1]}{displayValue}{parts[3]}
        </span>
    );
};

const KPIWidget = ({ title, value, label, trend, trendValue, icon: Icon, color, delay = 0 }) => {
    const isPositive = trend === 'up';

    // Color configurations
    const colorMap = {
        'text-cyan-500': { from: 'rgba(6,182,212,0.1)', to: 'rgba(6,182,212,0.05)', glow: 'rgba(6,182,212,0.3)', gradient: 'from-cyan-400 to-cyan-500' },
        'text-blue-500': { from: 'rgba(59,130,246,0.1)', to: 'rgba(59,130,246,0.05)', glow: 'rgba(59,130,246,0.3)', gradient: 'from-blue-400 to-blue-500' },
        'text-green-500': { from: 'rgba(34,197,94,0.1)', to: 'rgba(34,197,94,0.05)', glow: 'rgba(34,197,94,0.3)', gradient: 'from-green-400 to-green-500' },
        'text-red-500': { from: 'rgba(239,68,68,0.1)', to: 'rgba(239,68,68,0.05)', glow: 'rgba(239,68,68,0.3)', gradient: 'from-red-400 to-red-500' },
        'text-yellow-500': { from: 'rgba(234,179,8,0.1)', to: 'rgba(234,179,8,0.05)', glow: 'rgba(234,179,8,0.3)', gradient: 'from-yellow-400 to-yellow-500' },
        'text-purple-500': { from: 'rgba(168,85,247,0.1)', to: 'rgba(168,85,247,0.05)', glow: 'rgba(168,85,247,0.3)', gradient: 'from-purple-400 to-purple-500' },
    };

    const c = colorMap[color] || colorMap['text-cyan-500'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
                scale: 1.04,
                y: -6,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            className="relative overflow-hidden cursor-pointer group rounded-2xl"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148,163,184,0.25)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
        >
            {/* Premium glow on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${c.glow}20 0%, transparent 60%)`,
                }}
            />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div
                    className="absolute -inset-full h-full w-full"
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
                        animation: 'shimmer 2.5s ease-in-out infinite',
                        backgroundSize: '200% 100%',
                    }}
                />
            </div>

            {/* Background icon watermark with premium styling */}
            <div
                className={cn("absolute top-4 right-5 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500", color)}
                style={{ filter: 'blur(1px)' }}
            >
                <Icon size={90} strokeWidth={0.5} />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-5">
                    {/* Premium icon container */}
                    <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        className="relative"
                    >
                        <div
                            className="p-3.5 rounded-xl"
                            style={{
                                background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
                                border: `1px solid ${c.glow}`,
                                boxShadow: `0 4px 20px ${c.glow}30`,
                            }}
                        >
                            <Icon size={24} className={color} />
                        </div>
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: `radial-gradient(circle at 50% 50%, ${c.glow}40 0%, transparent 70%)`,
                                filter: 'blur(8px)',
                            }}
                        />
                    </motion.div>

                    {/* Trend badge with premium styling */}
                    {trendValue && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
                            className={cn(
                                "flex items-center text-xs font-bold px-3 py-1.5 rounded-full",
                                isPositive
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-red-100 text-red-700 border border-red-200"
                            )}
                            style={{
                                boxShadow: isPositive
                                    ? '0 0 15px rgba(34,197,94,0.2)'
                                    : '0 0 15px rgba(239,68,68,0.2)',
                            }}
                        >
                            {isPositive ? (
                                <ArrowUpRight size={14} className="mr-1" />
                            ) : (
                                <ArrowDownRight size={14} className="mr-1" />
                            )}
                            {trendValue}
                        </motion.div>
                    )}
                </div>

                {/* Animated value with premium typography */}
                <motion.h3
                    key={value}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl font-bold text-slate-800 mb-2 tracking-tight font-display"
                >
                    <AnimatedValue value={value} />
                </motion.h3>

                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>

                {label && (
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                )}
            </div>

            {/* Premium bottom gradient line that expands on hover */}
            <motion.div
                initial={{ width: '0%', opacity: 0 }}
                whileHover={{ width: '100%', opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 h-0.5"
                style={{
                    background: `linear-gradient(90deg, ${c.glow}, rgba(6,182,212,0.2))`,
                    boxShadow: `0 0 10px ${c.glow}`,
                }}
            />
        </motion.div>
    );
};

export default KPIWidget;
