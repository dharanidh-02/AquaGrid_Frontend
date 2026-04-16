import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const RiskMeter = ({ riskLevel }) => {
    let percentage = 20;
    let color = '#10b981';
    let label = 'Low Risk';
    let gradientId = 'riskGreen';

    if (riskLevel === 'Medium') {
        percentage = 55;
        color = '#f59e0b';
        gradientId = 'riskYellow';
    } else if (riskLevel === 'High') {
        percentage = 90;
        color = '#ef4444';
        gradientId = 'riskRed';
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex justify-between items-end">
                <span className="text-slate-500 font-medium text-sm">Stress Level</span>
                <span
                    className="text-sm font-bold px-2.5 py-1 rounded-full"
                    style={{
                        color,
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}30`
                    }}
                >
                    {label}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={color} />
                    </linearGradient>
                </defs>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", type: 'spring' }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: `url(#${gradientId})` }}
                >
                    {/* Shimmer effect */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"
                        style={{ width: '50%' }}
                    />

                    {/* Glow at leading edge */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 rounded-r-full"
                        style={{
                            background: color,
                            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}50`
                        }}
                    />
                </motion.div>
            </div>

            {/* Scale markers */}
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed">
                Based on current supply vs demand ratio across all connected zones
            </p>
        </div>
    );
};

export default RiskMeter;
