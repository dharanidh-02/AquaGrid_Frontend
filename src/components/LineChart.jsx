import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-3 rounded-xl border border-white/50 shadow-lg">
                <p className="font-semibold text-slate-700">{label}</p>
                <p className="text-cyan-600 text-sm mt-1">
                    Usage: <span className="font-bold">{payload[0].value.toLocaleString()} L</span>
                </p>
            </div>
        );
    }
    return null;
};

const LineChart = ({ data, height = 300 }) => {
    if (!data || data.length === 0) return (
        <div className="h-[300px] w-full flex items-center justify-center text-slate-400">
            <p className="text-sm">No data available</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[300px] w-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0891b2" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(148, 163, 184, 0.15)"
                        horizontalLines={false}
                    />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                        dy={12}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                        tickFormatter={(value) => `${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#waveGradient)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorUsage)"
                        dot={false}
                        activeDot={{
                            r: 6,
                            fill: '#06b6d4',
                            stroke: '#fff',
                            strokeWidth: 2,
                            style: { filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))' }
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default LineChart;
