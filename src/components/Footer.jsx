import { Droplets, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = ({ isDark = true }) => {
    return (
        <footer className={`relative overflow-hidden ${isDark ? 'bg-ocean-950 text-white' : 'bg-white text-slate-800'}`}>
            {/* Top wave */}
            <div className="absolute top-0 left-0 w-full -mt-1">
                <svg viewBox="0 0 1440 30" className="w-full h-8" preserveAspectRatio="none">
                    <path
                        d="M0,15 C360,30 720,0 1080,15 C1260,22.5 1350,22.5 1440,15 L1440,30 L0,30 Z"
                        fill={isDark ? '#0f172a' : '#f8fafc'}
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="relative"
                            >
                                <Droplets className="h-7 w-7 text-cyan-400" />
                                <div className="absolute inset-0 blur-md bg-cyan-400/30 rounded-full" />
                            </motion.div>
                            <span className="text-xl font-bold text-gradient-cyan">AquaGrid AI</span>
                        </Link>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Next-generation water resource management platform powered by artificial intelligence.
                        </p>
                        {/* Social links */}
                        <div className="flex space-x-4 pt-2">
                            {[
                                { icon: Github, href: '#', label: 'GitHub' },
                                { icon: Twitter, href: '#', label: 'Twitter' },
                                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                            ].map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-cyan-400' : 'hover:bg-slate-100 text-slate-400 hover:text-cyan-600'}`}
                                    aria-label={label}
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className={`font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Product</h3>
                        <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                                <li key={item}>
                                    <Link to="/features" className={`hover:text-cyan-400 transition-colors flex items-center gap-1 group`}>
                                        {item}
                                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className={`font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Company</h3>
                        <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-cyan-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className={`font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Legal</h3>
                        <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-cyan-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} pt-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        © {new Date().getFullYear()} AquaGrid AI. All rights reserved.
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        Built for a sustainable future
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
