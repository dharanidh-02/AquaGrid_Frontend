import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0891b2', '#f97316', '#6366f1'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-3 rounded-xl border border-white/50 shadow-lg">
                <p className="font-semibold text-slate-700">{payload[0].name}</p>
                <p className="text-sm mt-1" style={{ color: payload[0].payload.fill }}>
                    Usage: <span className="font-bold">{payload[0].value.toLocaleString()} L</span>
                </p>
            </div>
        );
    }
    return null;
};

const PieChartWidget = ({ data }) => {
    if (!data || data.length === 0) return (
        <div className="h-[300px] w-full flex items-center justify-center text-slate-400">
            <p className="text-sm">No data available</p>
        </div>
    );

    const activeData = data.filter(item => item.value > 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[300px] w-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        {activeData.map((entry, index) => (
                            <linearGradient key={`grad-${index}`} id={`pieGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                                <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7} />
                            </linearGradient>
                        ))}
                    </defs>
                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                        animationBegin={0}
                        animationDuration={1200}
                        animationEasing="ease-out"
                    >
                        {activeData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#pieGrad-${index})`}
                                style={{ filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.2))' }}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default PieChartWidget;
