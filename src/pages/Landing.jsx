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
        cyan: { bg: 'rgba(6, 182, 212, 0.4)', glow: 'rgba(6, 182, 212, 0.2)' },
        purple: { bg: 'rgba(168, 85, 247, 0.35)', glow: 'rgba(168, 85, 247, 0.15)' },
        blue: { bg: 'rgba(59, 130, 246, 0.35)', glow: 'rgba(59, 130, 246, 0.15)' },
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
                : 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg'
        }`}
        style={{
            backdropFilter: 'blur(20px)',
        }}
    >
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-transparent to-purple-400/20" />
            <div
                className="absolute -inset-px rounded-3xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.3), transparent, rgba(168,85,247,0.3))',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '1px',
                }}
            />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute -inset-full h-full w-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 -skew-x-12 animate-[shimmer_4s_ease-in-out_infinite]" />
        </div>

        {/* Icon */}
        <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                isDark
                    ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-400/30'
                    : 'bg-gradient-to-br from-ocean-50 to-cyan-50 border border-cyan-100/60'
            }`}
            style={{
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)',
            }}
        >
            <Icon size={28} className={isDark ? 'text-cyan-400' : 'text-ocean-600'} strokeWidth={1.5} />
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
        className="p-6 rounded-2xl border border-white/10"
        style={{
            background: 'rgba(15,23,42,0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
    >
        <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
        </div>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
            }}>
                {name.charAt(0)}
            </div>
            <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-xs text-slate-400">{role} at {company}</p>
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
        <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)' }}>
            {/* Animated gradient background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)' }} />

                {/* Animated gradient overlay */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(-45deg, #0f172a, #1e3a8a, #0c4a6e, #06b6d4, #0f172a)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient-shift 12s ease infinite',
                    opacity: 0.4,
                }} />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(25)].map((_, i) => (
                        <FloatingParticle
                            key={i}
                            delay={i * 0.4}
                            size={2 + (i % 5)}
                            color={['cyan', 'purple', 'blue'][i % 3]}
                        />
                    ))}
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 1px, transparent 1px))',
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <Navbar />

            {/* HERO SECTION */}
            <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
                {/* Parallax hero content */}
                <motion.div
                    style={{ y, opacity }}
                    className="text-center max-w-5xl mx-auto mb-12 relative z-10"
                >
                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-xl mb-10 shadow-lg shadow-cyan-500/10"
                    >
                        <motion.span
                            className="flex h-2.5 w-2.5 relative"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan-400 to-cyan-300" />
                        </motion.span>
                        <span className="text-xs font-bold text-cyan-300 tracking-widest uppercase">AquaGrid AI 2.0 — Now Live</span>
                    </motion.div>

                    {/* Main heading with wave animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl lg:text-[84px] tracking-tighter font-bold leading-[1.02] mb-10"
                    >
                        <span className="text-white">Water management,</span>
                        <br />
                        <WaveText delay={0.5} className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300">
                            perfectly engineered.
                        </WaveText>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-slate-300 mb-14 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        The enterprise-grade platform for residential complexes to track usage, predict leaks, and automate billing with zero friction.
                    </motion.p>

                    {/* CTA buttons with premium styling */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                    >
                        <RippleButton
                            variant="primary"
                            size="xl"
                            icon={ArrowRight}
                            onClick={() => {}}
                            className="shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40"
                        >
                            Start Free Trial
                        </RippleButton>
                        <Link
                            to="/login"
                            className="group relative h-14 px-10 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden"
                        >
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Border */}
                            <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors duration-500" />
                            {/* Glow on hover */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl" />
                            <span className="relative z-10 text-white flex items-center gap-2">
                                <Play size={16} className="group-hover:scale-110 transition-transform" />
                                View Live Demo
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Hero visual - Animated tank with premium effects */}
                <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mt-8"
                >
                    <div className="relative">
                        {/* Ambient glow */}
                        <div className="absolute inset-0 blur-[100px] bg-cyan-500/15 rounded-full scale-125" />

                        {/* Tank wrapper with glass effect */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative rounded-[3.5rem] border border-cyan-400/20 bg-slate-900/70 backdrop-blur-2xl p-14 shadow-[0_0_80px_rgba(6,182,212,0.2)]"
                            style={{
                                boxShadow: '0 0 60px rgba(6, 182, 212, 0.15), 0 0 120px rgba(6, 182, 212, 0.1)',
                            }}
                        >
                            <AnimatedTank overrideLevel={68} status="Normal" size="lg" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex flex-col items-center gap-3 text-cyan-400/50"
                    >
                        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase">Scroll</span>
                        <motion.div
                            animate={{ rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Wave divider */}
            <WaveDivider variant="dark" className="-mt-1" />

            {/* STATS SECTION */}
            <section className="py-24 relative z-10" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 100%)' }}>
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
                                    className="text-center p-6 rounded-2xl border border-slate-700/50"
                                    style={{
                                        background: 'rgba(15,23,42,0.8)',
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ delay: idx * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)',
                                            border: '1px solid rgba(6,182,212,0.2)',
                                        }}
                                    >
                                        <stat.icon className="text-cyan-400" size={26} />
                                    </motion.div>
                                    <div className="text-4xl font-bold text-white mb-2 font-display tracking-tight">
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Wave divider */}
            <WaveDivider variant="light" />

            {/* FLOW SECTION */}
            <section className="py-32 relative z-10 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.9) 100%)' }}>
                {/* Background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{
                    background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
                }} />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-24 md:w-2/3">
                        <FadeIn>
                            <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6 text-white">
                                Seamless data pipelines.
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <p className="text-slate-400 text-xl leading-relaxed font-light">
                                From physical sensors to analytical dashboards, AquaGrid handles the entire lifecycle of water management data with sub-second latency.
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

                                    <div className="relative p-8 rounded-2xl border transition-all duration-500" style={{
                                        background: 'rgba(15,23,42,0.8)',
                                        backdropFilter: 'blur(20px)',
                                        borderColor: 'rgba(51,65,85,0.5)',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                    }}>
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                            transition={{ duration: 0.5 }}
                                            className="w-18 h-18 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)',
                                                border: '1px solid rgba(6,182,212,0.2)',
                                            }}
                                        >
                                            <step.icon className="text-cyan-400" size={28} strokeWidth={1.5} />
                                        </motion.div>
                                        <h4 className="text-lg font-bold text-white mb-2 text-center">{step.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed text-center">{step.desc}</p>
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
            <section className="py-32 relative z-10 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 100%)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-28">
                        {/* Text side */}
                        <div>
                            <FadeIn>
                                <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6 text-white">
                                    Real-time Digital Twins.
                                </h2>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                                    Monitor your reservoirs with precision. Our SVG-based AnimatedTank component reflects fluid dynamics and alerts you instantly if thresholds fail.
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
                                            className="flex items-center gap-4 text-slate-300 font-medium text-base"
                                        >
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{
                                                background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)',
                                                border: '1px solid rgba(6,182,212,0.2)',
                                            }}>
                                                <CheckCircle2 className="text-cyan-400" size={16} />
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
                                        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
                                        filter: 'blur(60px)',
                                    }} />

                                    <motion.div
                                        whileHover={{ boxShadow: '0 0 100px rgba(6, 182, 212, 0.3)' }}
                                        transition={{ duration: 0.4 }}
                                        className="relative rounded-[3rem] border border-slate-700/50 p-12"
                                        style={{
                                            background: 'rgba(15,23,42,0.9)',
                                            backdropFilter: 'blur(20px)',
                                            boxShadow: '0 0 60px rgba(6,182,212,0.15)',
                                        }}
                                    >
                                        <AnimatedTank overrideLevel={72} status="Normal" size="lg" />
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
                            isDark={true}
                        />
                        <FeatureCard
                            icon={Bell}
                            title="Intelligent Alerts"
                            description="Configurable webhooks and SMS routes trigger immediately upon pipeline integrity faults."
                            delay={1}
                            index={1}
                            isDark={true}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Automated Ledger"
                            description="Programmatic bill generation based on per-liter configurations set per apartment zone."
                            delay={2}
                            index={2}
                            isDark={true}
                        />
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-32 relative z-10" style={{ background: 'linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.9) 100%)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6 text-white">
                            Loved by teams worldwide
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
            <WaveDivider variant="gradient" />

            {/* CTA SECTION */}
            <section className="py-40 relative text-center overflow-hidden z-10" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)' }}>
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 60%)',
                }} />

                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1 + i * 0.5, 2 + i * 0.5], opacity: [0.08, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 1.5,
                                ease: 'easeOut',
                            }}
                            className="absolute rounded-full border border-cyan-400/20"
                            style={{ width: 300 + i * 200, height: 300 + i * 200 }}
                        />
                    ))}
                </div>

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <FadeIn>
                        <h2 className="text-5xl md:text-6xl tracking-tight font-bold mb-8 text-white">
                            Ready to modernize?
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="text-xl text-slate-400 mb-14 font-light max-w-xl mx-auto">
                            Integrate AquaGrid AI today and dramatically optimize your water sustainability metrics.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <RippleButton
                            variant="primary"
                            size="xl"
                            icon={ArrowRight}
                            onClick={() => {}}
                            className="shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50"
                        >
                            Create an Account
                        </RippleButton>
                    </FadeIn>
                </div>
            </section>

            <WaveDivider variant="dark" />

            <Footer isDark />
        </div>
    );
};

export default Landing;
