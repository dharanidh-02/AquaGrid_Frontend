import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const RippleButton = ({
    children,
    onClick,
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    icon: Icon,
    ...props
}) => {
    const [ripples, setRipples] = useState([]);
    const buttonRef = useRef(null);

    const handleClick = (e) => {
        if (disabled) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height);

        const newRipple = {
            id: Date.now(),
            x,
            y,
            size,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Clean up ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick(e);
    };

    const variants = {
        primary: {
            base: 'bg-gradient-to-r from-ocean-700 via-ocean-600 to-cyan-500 text-white shadow-glow-cyan',
            hover: 'hover:shadow-glow-cyan hover:brightness-110',
            active: 'active:brightness-90 active:shadow-none',
        },
        secondary: {
            base: 'bg-white/70 backdrop-blur-md border border-white/40 text-ocean-700 shadow-sm',
            hover: 'hover:bg-white/90 hover:shadow-md',
            active: 'active:bg-white/70',
        },
        ghost: {
            base: 'bg-transparent text-slate-600 hover:bg-slate-100',
            hover: 'hover:bg-slate-100/50',
            active: 'active:bg-slate-200',
        },
        danger: {
            base: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-glow-red',
            hover: 'hover:brightness-110',
            active: 'active:brightness-90',
        },
        success: {
            base: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
            hover: 'hover:brightness-110',
            active: 'active:brightness-90',
        },
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-xl',
        xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    const { base, hover, active } = variants[variant] || variants.primary;

    return (
        <motion.button
            ref={buttonRef}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                'relative overflow-hidden font-semibold transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2',
                base,
                hover,
                active,
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {/* Ripple effects */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{
                        left: ripple.x - ripple.size / 2,
                        top: ripple.y - ripple.size / 2,
                        width: ripple.size,
                        height: ripple.size,
                        animation: 'ripple-effect 0.6s linear',
                    }}
                />
            ))}

            {/* Icon + Text */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16} />}
                {children}
            </span>
        </motion.button>
    );
};

export default RippleButton;
