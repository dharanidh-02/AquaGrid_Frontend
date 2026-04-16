import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, ArrowRight, Lock, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const raw = await response.text();
            let data = {};
            try { data = raw ? JSON.parse(raw) : {}; } 
            catch { data = { message: 'Unexpected server response.' }; }

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/dashboard');
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Cannot connect to backend server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 text-white font-sans overflow-hidden">
            {/* Left Side - Visual/Branding */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-slate-950 border-r border-slate-800">
                <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-brand-blue/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-brand-cyan/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
                
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-xl"
                >
                    <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                            <Droplets className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-4xl font-display font-bold text-white tracking-tight">AquaGrid AI</span>
                    </Link>
                    <h1 className="text-4xl font-display font-bold mb-6 leading-tight">
                        Welcome back to the <br/>
                        <span className="text-gradient">future of water intelligence.</span>
                    </h1>
                    <p className="text-lg text-slate-400">
                        Sign in to access your intelligent dashboards, monitor predictive insights, and stay ahead of critical alerts.
                    </p>
                </motion.div>
                
                {/* Floating Wave Decor */}
                <svg className="absolute bottom-0 w-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#06b6d4" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,133.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-slate-900 relative">
                <Link to="/" className="absolute top-8 right-8 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-xl flex items-center justify-center">
                            <Droplets className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-3xl font-display font-bold text-white tracking-tight">AquaGrid AI</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Sign In</h2>
                        <p className="text-slate-400">Enter your credentials to access your account.</p>
                    </div>

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="username" className="text-sm font-medium text-slate-300">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User size={18} className="text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={onChange}
                                    className="block w-full pl-11 pr-3 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan focus:bg-slate-800 transition-all text-white placeholder:text-slate-500"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={onChange}
                                    className="block w-full pl-11 pr-3 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan focus:bg-slate-800 transition-all text-white placeholder:text-slate-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="relative flex items-center">
                                    <input type="checkbox" id="remember-me" className="peer sr-only" />
                                    <div className="w-5 h-5 rounded border border-slate-600 bg-slate-800 peer-checked:bg-brand-cyan peer-checked:border-brand-cyan transition-colors flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <label htmlFor="remember-me" className="text-sm text-slate-400 cursor-pointer select-none">Remember me</label>
                            </div>

                            <a href="#" className="text-sm font-medium text-brand-cyan hover:text-cyan-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-8 py-4 text-center justify-center"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-slate-800 pt-8">
                        <p className="text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-brand-cyan hover:text-cyan-300 inline-flex items-center transition-colors">
                                Apply for access <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
