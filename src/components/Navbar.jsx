import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Droplets, LogOut, Play, Square, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useDemo } from '../context/DemoContext';

const Navbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { isDemoMode, toggleDemoMode } = useDemo();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed w-full z-50 border-b"
            style={{
                background: 'rgba(2,6,23,0.95)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(51,65,85,0.5)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="relative"
                        >
                            <Droplets className="h-8 w-8 text-cyan-400 drop-shadow-lg" />
                            {/* Glow effect */}
                            <div className="absolute inset-0 blur-md bg-cyan-400/30 rounded-full group-hover:bg-cyan-400/50 transition-colors" />
                        </motion.div>
                        <span className="text-2xl font-display font-bold text-white">AquaGrid AI</span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-slate-300 hover:text-cyan-400 font-medium transition-colors relative group"
                                    >
                                        Login
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 group-hover:w-full transition-all duration-300" />
                                    </Link>
                                    <Link to="/features" className="btn-primary">
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-6">
                                    {/* Demo Mode Toggle */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleDemoMode}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm border",
                                            isDemoMode
                                                ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                                                : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30"
                                        )}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isDemoMode ? (
                                                <motion.span
                                                    key="stop"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                                    </span>
                                                    Live Demo
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="start"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <Play size={12} fill="currentColor" />
                                                    Live Demo
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

                                    {/* User greeting */}
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-slate-300 font-medium font-display"
                                    >
                                        Hi, <span className="text-cyan-400">{user.username}</span>
                                    </motion.span>

                                    <motion.button
                                        whileHover={{ scale: 1.05, color: '#ef4444' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-sm font-medium">Logout</span>
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden gap-4 items-center">
                        {user && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDemoMode}
                                className={cn(
                                    "flex items-center justify-center p-2 rounded-full transition-all",
                                    isDemoMode ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"
                                )}
                            >
                                {isDemoMode ? (
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                                    </span>
                                ) : (
                                    <Play size={16} fill="currentColor" />
                                )}
                            </motion.button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-cyan-400 transition-colors"
                            style={{
                                background: 'rgba(15,23,42,0.8)',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden"
                        style={{
                            background: 'rgba(2,6,23,0.98)',
                            borderTop: '1px solid rgba(51,65,85,0.5)',
                        }}
                    >
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-4 py-3 rounded-xl text-base font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
