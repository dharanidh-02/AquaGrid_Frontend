import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, TrendingUp, Users } from 'lucide-react';

const ZoneCard = ({ zone }) => {
    const { zoneName, zoneType, currentLevel, tankCapacity, population } = zone;
    const percentage = Math.round((currentLevel / tankCapacity) * 100);

    const getStatus = (pct) => {
        if (pct >= 80) return { label: 'Healthy', color: '#06b6d4', bgColor: 'bg-cyan-50' };
        if (pct >= 50) return { label: 'Normal', color: '#3b82f6', bgColor: 'bg-blue-50' };
        if (pct >= 25) return { label: 'Low', color: '#f97316', bgColor: 'bg-orange-50' };
        return { label: 'Critical', color: '#ef4444', bgColor: 'bg-red-50' };
    };

    const status = getStatus(percentage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.03,
                y: -4,
                transition: { duration: 0.2 }
            }}
            className="glass-card rounded-2xl p-5 cursor-pointer overflow-hidden relative group"
        >
            {/* Status stripe at top */}
            <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${status.color}, ${status.color}80)` }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4 pt-2">
                <div>
                    <h4 className="text-base font-bold text-slate-800">{zoneName}</h4>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 mt-1">
                        {zoneType}
                    </span>
                </div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${status.color}15` }}
                >
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: status.color, boxShadow: `0 0 6px ${status.color}` }}
                    />
                    <span className="text-xs font-bold" style={{ color: status.color }}>
                        {status.label}
                    </span>
                </motion.div>
            </div>

            {/* Level bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500 font-medium">Water Level</span>
                    <span className="text-xs font-bold text-slate-700">{percentage}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full relative"
                        style={{
                            background: `linear-gradient(to right, ${status.color}, ${status.color}cc)`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                    </motion.div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50">
                    <Droplets size={14} className="text-cyan-500" />
                    <div>
                        <p className="text-[10px] text-slate-400">Capacity</p>
                        <p className="text-sm font-bold text-slate-700">{(tankCapacity / 1000).toFixed(1)}k L</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/50">
                    <Users size={14} className="text-indigo-500" />
                    <div>
                        <p className="text-[10px] text-slate-400">Population</p>
                        <p className="text-sm font-bold text-slate-700">{population.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Hover glow */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 0 25px ${status.color}20` }}
            />
        </motion.div>
    );
};

export default ZoneCard;
