import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, ChevronLeft, ChevronRight, Droplets, LayoutDashboard, Droplet, AlertTriangle, Settings, Bell, BarChart3, Users, Wrench, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Sidebar = ({ items = [], isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    return (
        <motion.aside
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "hidden md:flex flex-col h-screen fixed pt-20 z-40 transition-all duration-500 ease-out",
                isCollapsed ? "w-[80px]" : "w-64",
            )}
            style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(240,253,250,0.9) 100%)',
                backdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(125,211,252,0.36)',
                boxShadow: '16px 0 40px rgba(15,118,110,0.08)',
            }}
        >
            {/* Ambient glow at top */}
            <div className="absolute top-0 inset-x-0 h-32 pointer-events-none" style={{
                background: 'linear-gradient(180deg, rgba(20,184,166,0.12) 0%, transparent 75%)',
            }} />

            {/* Toggle Button - Premium pill style */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3.5 top-24 z-50"
            >
                <div
                    className="rounded-full p-1.5 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 55%, #10b981 100%)',
                        boxShadow: '0 10px 25px rgba(13,148,136,0.28)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isCollapsed ? 'right' : 'left'}
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {isCollapsed ? (
                                <ChevronRight size={15} className="text-white" />
                            ) : (
                                <ChevronLeft size={15} className="text-white" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.button>

            {/* Brand indicator at top */}
            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="px-5 py-5 border-b border-teal-100/80"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Droplets className="h-6 w-6 text-teal-600" />
                            </motion.div>
                            <div className="absolute inset-0 blur-md bg-emerald-300/30 rounded-full" />
                        </div>
                        <div>
                            <span className="text-base font-bold text-slate-900 tracking-wide">AquaGrid</span>
                            <p className="text-[10px] text-teal-700/70 font-medium">AI Dashboard</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Collapsed brand icon */}
            {isCollapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-3 py-5 border-b border-teal-100/80 flex justify-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        className="relative"
                    >
                        <Droplets className="h-6 w-6 text-teal-600" />
                        <div className="absolute inset-0 blur-md bg-emerald-300/30 rounded-full" />
                    </motion.div>
                </motion.div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden no-scrollbar space-y-1">
                {items.map((item, index) => {
                    const currentTab = new URLSearchParams(location.search).get('tab');
                    const targetTab = new URLSearchParams(item.path.split('?')[1] || '').get('tab');
                    const isActive = currentTab === targetTab;

                    return (
                        <motion.div
                            key={item.path}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.1, duration: 0.4 }}
                        >
                            <Link
                                to={item.path}
                                title={isCollapsed ? item.label : ""}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",
                                    isActive
                                        ? "text-teal-900"
                                        : "text-slate-600 hover:text-teal-700"
                                )}
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(90deg, rgba(20,184,166,0.16) 0%, rgba(14,165,233,0.08) 100%)'
                                        : 'transparent',
                                }}
                            >
                                {/* Active indicator - Animated water wave line */}
                                {isActive && (
                                    <>
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full"
                                            style={{
                                                background: 'linear-gradient(180deg, #10b981 0%, #06b6d4 55%, #0f766e 100%)',
                                                boxShadow: '0 0 15px rgba(13,148,136,0.38)',
                                            }}
                                            initial={{ scaleY: 0, opacity: 0 }}
                                            animate={{ scaleY: 1, opacity: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        />
                                        {/* Glow effect behind icon */}
                                        <div
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg opacity-30"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(20,184,166,0.45) 0%, transparent 70%)',
                                                filter: 'blur(8px)',
                                            }}
                                        />
                                    </>
                                )}

                                {/* Icon with glow on active */}
                                <div className={cn(
                                    "relative flex-shrink-0 transition-all duration-300",
                                    isActive ? "text-teal-700" : "text-slate-500 group-hover:text-teal-600"
                                )}>
                                    <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                                    {isActive && (
                                        <div className="absolute inset-0 blur-sm bg-emerald-300/35 rounded-full" />
                                    )}
                                </div>

                                {/* Label */}
                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                            className={cn(
                                                "text-sm font-semibold whitespace-nowrap overflow-hidden",
                                                isActive ? "text-slate-900" : "text-slate-600 group-hover:text-teal-800"
                                            )}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Hover glow */}
                                {!isActive && (
                                    <div
                                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: 'linear-gradient(90deg, rgba(20,184,166,0.08), rgba(14,165,233,0.05))',
                                        }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer / Help */}
            <div className="p-4 border-t border-teal-100/80">
                <Link
                    to="/help"
                    title={isCollapsed ? "Help & Support" : ""}
                    className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                        "text-slate-500 hover:text-teal-700",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <div className="relative flex-shrink-0 transition-colors">
                        <HelpCircle size={20} strokeWidth={1.5} />
                        <div className="absolute inset-0 blur-sm bg-emerald-300/0 group-hover:bg-emerald-300/20 rounded-full transition-colors duration-300" />
                    </div>
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm font-medium text-slate-500 group-hover:text-teal-700 whitespace-nowrap"
                            >
                                Help & Support
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
