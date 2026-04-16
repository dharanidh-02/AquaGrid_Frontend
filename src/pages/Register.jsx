import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, ArrowRight, Lock, User, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'User',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { username, password, role } = formData;

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
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const raw = await response.text();
            let data = {};
            try { data = raw ? JSON.parse(raw) : {}; } 
            catch { data = { message: 'Unexpected server response' }; }

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/dashboard'); 
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register error:', error);
            alert('Server error. Ensure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 text-white font-sans overflow-hidden">
            {/* Left Side - Visual/Branding */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 bg-slate-950 border-r border-slate-800">
                <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
                <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-brand-cyan/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[10%] right-[30%] w-[300px] h-[300px] bg-brand-purple/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
                
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
                        Power your community with <br/>
                        <span className="text-gradient">smart utilities.</span>
                    </h1>
                    <p className="text-lg text-slate-400">
                        Register your complex, assign roles to maintenance staff, and let algorithms optimize your water resources seamlessly.
                    </p>
                </motion.div>
                
                {/* Floating Decor SVG */}
                <svg className="absolute bottom-0 w-full opacity-10 rotate-180 scale-x-[-1]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#a855f7" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,133.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
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

                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">Apply for platform access and assign a role.</p>
                    </div>

                    <form className="space-y-5" onSubmit={onSubmit}>
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
                                    className="block w-full pl-11 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan focus:bg-slate-800 transition-all text-white placeholder:text-slate-600"
                                    placeholder="Choose a username"
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
                                    className="block w-full pl-11 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan focus:bg-slate-800 transition-all text-white placeholder:text-slate-600"
                                    placeholder="Create a hard-to-guess password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="role" className="text-sm font-medium text-slate-300">System Role</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Shield size={18} className="text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                                </div>
                                <select
                                    name="role"
                                    id="role"
                                    value={role}
                                    onChange={onChange}
                                    className="block w-full pl-11 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan focus:bg-slate-800 transition-all text-white appearance-none outline-none"
                                >
                                    <option value="User" className="bg-slate-800">Resident / User</option>
                                    <option value="Admin" className="bg-slate-800">Admin</option>
                                    <option value="Maintenance Staff" className="bg-slate-800">Maintenance Staff</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full mt-6 py-4 text-center justify-center"
                        >
                            {isLoading ? 'Creating account...' : 'Create Account & Continue'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-800 pt-6">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-brand-cyan hover:text-cyan-300 inline-flex items-center transition-colors">
                                Sign in instead <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
