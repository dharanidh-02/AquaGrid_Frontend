import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AlertPanel = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl text-center py-12 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148,163,184,0.25)',
                }}
            >
                {/* Ambient glow for empty state */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.1) 0%, transparent 60%)',
                }} />

                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-200/50 shadow-lg shadow-green-500/20"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <CheckCircle2 className="text-green-500" size={32} />
                    </motion.div>
                </motion.div>

                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-800 font-bold text-lg mb-2"
                >
                    All Systems Normal
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-500 text-sm mt-2"
                >
                    No active alerts detected across zones.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"
                >
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-500/50"
                    />
                    Monitoring active
                </motion.div>
            </motion.div>
        );
    }

    const criticalCount = alerts.filter(a => a.type === 'Critical').length;
    const hasCritical = criticalCount > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden relative"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${hasCritical ? 'rgba(239,68,68,0.3)' : 'rgba(148,163,184,0.25)'}`,
                boxShadow: hasCritical ? '0 0 30px rgba(239,68,68,0.1)' : '0 4px 20px rgba(0,0,0,0.06)',
            }}
        >
            {/* Critical ambient glow */}
            {hasCritical && (
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 60%)',
                }} />
            )}

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2.5">
                    <motion.div
                        animate={hasCritical ? {
                            scale: [1, 1.2, 1],
                            textShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.5)', '0 0 0px rgba(239,68,68,0)']
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <AlertCircle className={hasCritical ? "text-red-400" : "text-yellow-400"} size={22} />
                    </motion.div>
                    Active Alerts
                </h3>
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-full",
                        hasCritical
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                    )}
                    style={{
                        boxShadow: hasCritical ? '0 0 15px rgba(239,68,68,0.2)' : 'none',
                    }}
                >
                    {alerts.length} {alerts.length === 1 ? 'issue' : 'issues'}
                </motion.span>
            </div>

            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                <AnimatePresence>
                    {alerts.map((alert, index) => {
                        const isCritical = alert.type === 'Critical';

                        return (
                            <motion.div
                                key={`${alert.title}-${index}`}
                                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                                transition={{
                                    delay: index * 0.08,
                                    duration: 0.4,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    x: 6,
                                    transition: { duration: 0.2 }
                                }}
                                className="relative overflow-hidden rounded-xl border"
                                style={{
                                    background: isCritical
                                        ? 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)'
                                        : 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.05) 100%)',
                                    borderColor: isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)',
                                }}
                            >
                                {/* Critical pulsing glow effect */}
                                {isCritical && (
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        animate={{ opacity: [0, 0.5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{
                                            background: 'radial-gradient(ellipse at 0% 50%, rgba(239,68,68,0.1) 0%, transparent 60%)',
                                        }}
                                    />
                                )}

                                {/* Severity indicator bar */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1"
                                    style={{
                                        background: isCritical
                                            ? 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)'
                                            : 'linear-gradient(180deg, #fbbf24 0%, #f97316 100%)',
                                        boxShadow: isCritical ? '0 0 10px rgba(239,68,68,0.5)' : 'none',
                                    }}
                                />

                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', delay: index * 0.08 + 0.1, stiffness: 200 }}
                                    className="absolute top-4 left-4"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md"
                                        style={{
                                            background: isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(249,115,22,0.2)',
                                            border: `1px solid ${isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`,
                                        }}
                                    >
                                        <AlertTriangle
                                            size={18}
                                            className={isCritical ? "text-red-400" : "text-yellow-400"}
                                        />
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <div className="pl-16 pr-4 py-4">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <h4 className={cn(
                                            "text-sm font-bold",
                                            isCritical ? "text-red-700" : "text-amber-700"
                                        )}>
                                            {alert.title}
                                        </h4>
                                        {isCritical && (
                                            <motion.span
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.08 + 0.2 }}
                                                className="shrink-0 px-2 py-0.5 text-[9px] font-black bg-red-500 text-white rounded uppercase tracking-wider"
                                                style={{
                                                    boxShadow: '0 0 10px rgba(239,68,68,0.5)',
                                                }}
                                            >
                                                Critical
                                            </motion.span>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-xs leading-relaxed",
                                        isCritical ? "text-red-600/80" : "text-amber-600/80"
                                    )}>
                                        {alert.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-500">
                                        <Clock size={10} />
                                        {alert.time}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AlertPanel;
