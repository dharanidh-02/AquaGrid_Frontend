import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, CloudRain, Cpu, BarChart3, CheckCircle2, Bell, Droplets, Zap, Shield, ChevronDown, Play, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedTank from '../components/AnimatedTank';
import WaveDivider from '../components/WaveDivider';
import RippleButton from '../components/RippleButton';

// Premium floating particle system
const FloatingParticle = ({ delay = 0, size = 4, color = 'cyan' }) => {
    const colors = {
        cyan: { bg: 'rgba(56, 189, 248, 0.4)', glow: 'rgba(56, 189, 248, 0.2)' },
        green: { bg: 'rgba(16, 185, 129, 0.36)', glow: 'rgba(16, 185, 129, 0.18)' },
        blue: { bg: 'rgba(186, 230, 253, 0.4)', glow: 'rgba(186, 230, 253, 0.2)' },
    };
    const c = colors[color] || colors.cyan;

    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                background: c.bg,
                boxShadow: `0 0 ${size * 2}px ${c.glow}`,
            }}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{
                opacity: [0, 0.8, 0.4, 0.7, 0],
                y: [0, -40, -80, -120, -180],
                x: [0, 15, -10, 20, 5],
                scale: [0, 1.2, 0.8, 1, 0.5],
            }}
            transition={{
                duration: 10 + delay * 2,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
};

// Premium wave text animation
const WaveText = ({ children, className = '', delay = 0 }) => (
    <span className={`inline-block ${className}`}>
        {children.split('').map((char, i) => (
            <motion.span
                key={i}
                initial={{ y: 0, opacity: 0.8 }}
                animate={{ y: [0, -6, 0] }}
                transition={{
                    duration: 2,
                    delay: delay + i * 0.04,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: 'easeInOut',
                }}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
    </span>
);

// Staggered fade-in animation wrapper
const FadeIn = ({ children, delay = 0, direction = 'up', distance = 30 }) => {
    const directions = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-50px' }}
        >
            {children}
        </motion.div>
    );
};

// Premium feature card with hover states
const FeatureCard = ({ icon: Icon, title, description, delay = 0, isDark = false, index = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay * 0.1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-30px' }}
        whileHover={{ y: -10, scale: 1.02 }}
        className={`relative p-8 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 ${
            isDark
                ? 'bg-slate-900/70 backdrop-blur-xl border border-slate-700/40 shadow-xl'
                : 'aqua-panel aqua-panel-hover'
        }`}
        style={{
            backdropFilter: 'blur(20px)',
        }}
    >
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-transparent to-emerald-400/20" />
            <div
                className="absolute -inset-px rounded-3xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.3), transparent, rgba(16,185,129,0.3))',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '1px',
                }}
            />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute -inset-full h-full w-full bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10 -skew-x-12 animate-[shimmer_4s_ease-in-out_infinite]" />
        </div>

        {/* Icon */}
        <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                isDark
                    ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-400/30'
                    : 'bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-100/80'
            }`}
            style={{
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)',
            }}
        >
            <Icon size={28} className={isDark ? 'text-cyan-400' : 'text-teal-700'} strokeWidth={1.5} />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
            <h3 className={`text-xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {title}
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {description}
            </p>
        </div>

        {/* Bottom progress line */}
        <motion.div
            initial={{ width: '0%' }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300"
        />
    </motion.div>
);

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value.replace(/[^0-9]/g, ''));
        const increment = end / (duration * 60);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count.toLocaleString()}{value.includes('+') ? '+' : ''}</span>;
};

// Premium testimonial card
const TestimonialCard = ({ name, role, company, quote, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl aqua-panel aqua-panel-hover"
        style={{
            backdropFilter: 'blur(20px)'
        }}
    >
        <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
        </div>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #10b981 100%)',
            }}>
                {name.charAt(0)}
            </div>
            <div>
                <p className="font-semibold text-slate-800 text-sm">{name}</p>
                <p className="text-xs text-slate-500">{role} at {company}</p>
            </div>
        </div>
    </motion.div>
);

const Landing = () => {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 100, damping: 30 });
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    useEffect(() => { setMounted(true); }, []);

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-emerald-500/25 overflow-x-hidden aqua-natural-bg">
            {/* Animated gradient background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 aqua-natural-bg" />

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 aqua-field-bg opacity-90" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(25)].map((_, i) => (
                        <FloatingParticle
                            key={i}
                            delay={i * 0.4}
                            size={2 + (i % 5)}
                            color={['cyan', 'green', 'blue'][i % 3]}
                        />
                    ))}
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(rgba(14, 165, 233, 1px) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 1px) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <Navbar />

            {/* HERO SECTION */}
            <section ref={containerRef} className="relative min-h-[94vh] pt-24 overflow-hidden water-network-scene">
                <div className="water-surface-ribbon hidden lg:block left-[6%] top-[24%] h-14 w-72 -rotate-6 opacity-70" />
                <div className="water-surface-ribbon hidden lg:block right-[8%] top-[18%] h-16 w-96 rotate-3 opacity-80" />
                <div className="water-surface-ribbon hidden lg:block right-[18%] bottom-[22%] h-12 w-80 -rotate-12 opacity-70" />
                <div className="water-line hidden md:block left-[44%] top-[28%] w-[420px] rotate-[18deg]" />
                <div className="water-line hidden md:block left-[52%] top-[54%] w-[360px] -rotate-[16deg]" />
                <div className="water-line hidden md:block left-[60%] top-[38%] w-[310px] rotate-[84deg]" />
                <div className="water-node hidden md:block left-[50%] top-[30%]" />
                <div className="water-node hidden md:block left-[76%] top-[41%]" />
                <div className="water-node hidden md:block left-[63%] top-[67%]" />

                <motion.div
                    style={{ y, opacity }}
                    className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 min-h-[calc(92vh-6rem)] flex items-center"
                >
                    <div className="w-full grid lg:grid-cols-[minmax(0,1.04fr)_minmax(380px,0.96fr)] gap-10 lg:gap-16 items-center pb-24">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full aqua-chip backdrop-blur-xl mb-7 shadow-sm"
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span className="text-xs font-bold tracking-widest uppercase">Sustainable water operations</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 26 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="text-5xl md:text-7xl lg:text-[92px] font-bold leading-[0.94] tracking-tight text-slate-950"
                            >
                                See every drop.
                                <span className="block text-gradient">Act before waste.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-8 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
                            >
                                AquaGrid AI blends tank monitoring, leak alerts, resident usage, and billing into one calm interface shaped for real communities and real conservation.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-6 flex flex-wrap gap-3"
                            >
                                {['Tank clarity', 'Leak prediction', 'Fair billing'].map((item) => (
                                    <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/[0.62] px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl">
                                        <CheckCircle2 size={15} className="text-emerald-600" />
                                        {item}
                                    </span>
                                ))}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-10 flex flex-col sm:flex-row gap-4"
                            >
                                <Link
                                    to="/login"
                                    className="aqua-cta h-14 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 text-lg"
                                >
                                    Login <ArrowRight size={20} />
                                </Link>
                                <Link
                                    to="/features"
                                    className="h-14 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 text-slate-800 bg-white/70 border border-teal-100 hover:border-teal-300 transition-all shadow-sm"
                                >
                                    <Play size={17} />
                                    Get Started
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 42, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative min-h-[430px] hidden md:block"
                        >
                            <div className="absolute right-0 top-8 w-[430px] h-[360px] hero-visual-shell rotate-2" />
                            <div className="absolute right-10 top-10 flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-700 backdrop-blur-xl">
                                <CloudRain size={15} />
                                Water network
                            </div>
                            <div className="absolute right-16 top-24 w-72 rounded-3xl border border-white/75 bg-white/60 p-6 shadow-xl backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Community flow</p>
                                    <Activity size={20} className="text-emerald-600" />
                                </div>
                                <div className="mt-6 space-y-4">
                                    {[
                                        ['Block A', '82% stable'],
                                        ['Block B', '76% stable'],
                                        ['Garden line', '94% efficient'],
                                    ].map(([label, value], idx) => (
                                        <div key={label}>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold text-slate-700">{label}</span>
                                                <span className="text-slate-500">{value}</span>
                                            </div>
                                            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${82 + idx * 5}%` }}
                                                    transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                                                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute left-4 top-[8.5rem] w-56 natural-metric-card p-5">
                                <p className="text-xs font-bold tracking-widest text-teal-700 uppercase">Leak risk</p>
                                <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '18%' }}
                                        transition={{ duration: 1, delay: 0.9 }}
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                    />
                                </div>
                                <p className="mt-3 text-3xl font-bold text-slate-900">Low</p>
                                <p className="text-sm text-slate-500">All zones within normal pressure.</p>
                            </div>
                            <div className="absolute right-1 bottom-12 w-64 natural-metric-card p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">Today saved</p>
                                    <Droplets size={18} className="text-teal-600" />
                                </div>
                                <p className="mt-3 text-4xl font-bold text-slate-950">1,280L</p>
                                <p className="text-sm text-slate-500">Compared with expected use.</p>
                            </div>
                            <div className="absolute left-24 bottom-2 w-56 natural-metric-card p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Flow health</p>
                                        <p className="mt-1 text-2xl font-bold text-slate-950">96%</p>
                                    </div>
                                    <Activity size={26} className="text-emerald-600" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 z-20 hero-data-strip">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            ['98%', 'AI detection accuracy'],
                            ['24/7', 'Tank and meter watch'],
                            ['7 sec', 'Alert response window'],
                            ['32%', 'Typical water savings'],
                        ].map(([value, label]) => (
                            <div key={label} className="text-left">
                                <p className="text-2xl md:text-3xl font-bold text-slate-950">{value}</p>
                                <p className="text-xs md:text-sm font-medium text-slate-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Wave divider */}
            <WaveDivider variant="ocean" className="-mt-1" />

            {/* STATS SECTION */}
            <section className="py-24 relative z-10" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(240,253,250,0.88) 100%)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '50K+', label: 'Liters Saved', icon: Droplets },
                            { value: '98%', label: 'Accuracy', icon: Shield },
                            { value: '24/7', label: 'Monitoring', icon: Activity },
                            { value: '3x', label: 'Faster Response', icon: Zap },
                        ].map((stat, idx) => (
                            <FadeIn key={stat.label} delay={idx * 0.1} direction="up">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center p-6 rounded-2xl max-w-sm mx-auto aqua-panel aqua-panel-hover"
                                    style={{
                                        background: 'rgba(255,255,255,0.8)',
                                        backdropFilter: 'blur(20px)',
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ delay: idx * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0.05) 100%)',
                                            border: '1px solid rgba(14,165,233,0.2)',
                                        }}
                                    >
                                        <stat.icon className="text-teal-700" size={26} />
                                    </motion.div>
                                    <div className="text-4xl font-bold text-slate-900 mb-2 font-display tracking-tight">
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Wave divider */}
            <WaveDivider variant="light" />

            {/* FLOW SECTION */}
            <section className="py-32 relative z-10 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.9) 100%)' }}>
                {/* Background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{
                    background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
                }} />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-24 md:w-2/3">
                        <FadeIn>
                            <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6 text-slate-900">
                                Water flow, clearly connected.
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <p className="text-slate-600 text-xl leading-relaxed font-light">
                                From tank sensors to resident dashboards, AquaGrid turns live water movement into clear decisions for operations, billing, and maintenance.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: CloudRain, title: "Sensor Hub", desc: "Passive edge devices collect node data." },
                            { icon: Activity, title: "Data Ingestion", desc: "Secure MQTT tunneling to our backend." },
                            { icon: Cpu, title: "Edge Analytics", desc: "Real-time anomaly detection." },
                            { icon: BarChart3, title: "Visualization", desc: "Clean React interfaces render metrics." }
                        ].map((step, idx) => (
                            <FadeIn key={idx} delay={idx * 0.15} direction="up">
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative group"
                                >
                                    {/* Connector line with flow animation */}
                                    {idx < 3 && (
                                        <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 overflow-hidden">
                                            <motion.div
                                                className="w-full h-full bg-gradient-to-r from-cyan-400 to-cyan-300"
                                                initial={{ x: '-100%' }}
                                                whileInView={{ x: '100%' }}
                                                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                                            />
                                        </div>
                                    )}

                                    <div className="relative p-8 rounded-2xl aqua-panel aqua-panel-hover">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                            transition={{ duration: 0.5 }}
                                            className="w-18 h-18 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0.02) 100%)',
                                                border: '1px solid rgba(14,165,233,0.2)',
                                            }}
                                        >
                                            <step.icon className="text-teal-700" size={28} strokeWidth={1.5} />
                                        </motion.div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2 text-center">{step.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed text-center">{step.desc}</p>
                                    </div>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Wave divider */}
            <WaveDivider variant="ocean" />

            {/* FEATURES GRID */}
            <section className="py-32 relative z-10 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(255,255,255,0.95) 100%)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-28">
                        {/* Text side */}
                        <div>
                            <FadeIn>
                                <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6 text-slate-900">
                                    Real-time tank awareness.
                                </h2>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <p className="text-slate-600 text-lg mb-10 leading-relaxed font-light">
                                    Monitor every reservoir with a natural, readable interface that highlights levels, pressure, leaks, and abnormal consumption before they become costly.
                                </p>
                            </FadeIn>
                            <FadeIn delay={0.2}>
                                <ul className="space-y-5">
                                    {['Zero latency updates', 'Custom warning thresholds', 'Historical capacity trending'].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 + 0.3 }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-4 text-slate-700 font-medium text-base"
                                        >
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{
                                                background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0.02) 100%)',
                                                border: '1px solid rgba(14,165,233,0.2)',
                                            }}>
                                                <CheckCircle2 className="text-cyan-600" size={16} />
                                            </div>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </FadeIn>
                        </div>

                        {/* Tank visual */}
                        <FadeIn delay={0.3} direction="right">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                                className="flex justify-center lg:justify-end"
                            >
                                <div className="relative">
                                    {/* Ambient glow */}
                                    <div className="absolute inset-0 rounded-full" style={{
                                        background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
                                        filter: 'blur(60px)',
                                    }} />

                                    <motion.div
                                        whileHover={{ boxShadow: '0 0 100px rgba(14, 165, 233, 0.2)' }}
                                        transition={{ duration: 0.4 }}
                                        className="relative rounded-[3rem] border border-slate-200/50 p-12 shadow-2xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.8)',
                                            backdropFilter: 'blur(20px)',
                                            boxShadow: '0 0 60px rgba(14,165,233,0.1)',
                                        }}
                                    >
                                        <AnimatedTank overrideLevel={72} status="Normal" size="lg" isDark={false} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </FadeIn>
                    </div>

                    {/* Feature cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Activity}
                            title="Analytics Engine"
                            description="Compute intensive processing of historical consumption data to output actionable saving plans."
                            delay={0}
                            index={0}
                            isDark={false}
                        />
                        <FeatureCard
                            icon={Bell}
                            title="Intelligent Alerts"
                            description="Configurable webhooks and SMS routes trigger immediately upon pipeline integrity faults."
                            delay={1}
                            index={1}
                            isDark={false}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Automated Ledger"
                            description="Programmatic bill generation based on per-liter configurations set per apartment zone."
                            delay={2}
                            index={2}
                            isDark={false}
                        />
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-32 relative z-10" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.9) 100%)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6 text-slate-900">
                            Loved by teams worldwide
                        </h2>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                            See what water management professionals say about AquaGrid AI
                        </p>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah Chen"
                            role="Facilities Manager"
                            company="Skyline Residences"
                            quote="AquaGrid reduced our water waste by 34% in just three months. The real-time alerts are incredibly responsive."
                            delay={0}
                        />
                        <TestimonialCard
                            name="Michael Torres"
                            role="Operations Director"
                            company="Urban Living Corp"
                            quote="The AI-powered leak detection saved us from a major disaster. We caught a pipe issue before it became a flood."
                            delay={0.1}
                        />
                        <TestimonialCard
                            name="Emily Nakamura"
                            role="Sustainability Lead"
                            company="GreenView Apartments"
                            quote="Our residents love the transparency. They can see their usage in real-time and compete to save water."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Wave divider */}
            <WaveDivider variant="ocean" />

            {/* CTA SECTION */}
            <section className="py-40 relative text-center overflow-hidden z-10" style={{ background: 'linear-gradient(180deg, rgba(241,245,249,0.95) 0%, rgba(224,242,254,0.98) 100%)' }}>
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.08) 0%, transparent 60%)',
                }} />

                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1 + i * 0.5, 2 + i * 0.5], opacity: [0.3, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 1.5,
                                ease: 'easeOut',
                            }}
                            className="absolute rounded-full border border-blue-400/20"
                            style={{ width: 300 + i * 200, height: 300 + i * 200 }}
                        />
                    ))}
                </div>

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <FadeIn>
                        <h2 className="text-5xl md:text-6xl tracking-tight font-bold mb-8 text-slate-900">
                            Ready to modernize?
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="text-xl text-slate-600 mb-14 font-light max-w-xl mx-auto">
                            Integrate AquaGrid AI today and dramatically optimize your water sustainability metrics.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <RippleButton
                            variant="primary"
                            size="xl"
                            icon={ArrowRight}
                            onClick={() => {}}
                            className="shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40"
                        >
                            Create an Account
                        </RippleButton>
                    </FadeIn>
                </div>
            </section>

            <WaveDivider variant="light" />

            <Footer isDark={false} />
        </div>
    );
};

export default Landing;
