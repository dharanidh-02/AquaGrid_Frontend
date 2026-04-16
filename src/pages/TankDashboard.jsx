import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TankLevelWidget from '../components/TankLevelWidget';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';
import { Droplets, Activity, TrendingDown, Clock, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

const TankDashboard = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_URL}/api/tank/history`);
                const data = await res.json();

                // Process for recharts
                const processed = data.map(log => ({
                    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    level: log.level
                }));
                // Decimate to max 50 points so chart isn't overcrowded
                const step = Math.ceil(processed.length / 50);
                const decimated = processed.filter((_, i) => i % step === 0);

                setHistory(decimated);
            } catch (error) {
                console.error("Failed to load tank history", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <DashboardLayout user={{ role: 'Admin' /* default bypass for view */ }}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold text-slate-800">Tank Management</h1>
                        <p className="text-slate-600 mt-1">Real-time deep level analytics and prediction systems.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tank Graphic widget spanning left side */}
                    <div className="lg:col-span-1">
                        <TankLevelWidget />
                    </div>

                    {/* Chart spanning right side */}
                    <div className="lg:col-span-2 rounded-2xl p-6 border"
                        style={{
                            background: 'rgba(241, 245, 249, 0.92)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(148,163,184,0.4)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Activity className="text-cyan-600" />
                                24H Level Tracker
                            </h3>
                        </div>

                        <div className="h-64 mt-4 text-xs font-semibold text-slate-600">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.3)" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="#475569" />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid rgba(148,163,184,0.3)',
                                            background: 'rgba(255,255,255,0.95)',
                                            color: '#1e293b'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="level"
                                        stroke="#06b6d4"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Additional Analytics Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 rounded-2xl border"
                        style={{
                            background: 'rgba(241, 245, 249, 0.92)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(148,163,184,0.4)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(249,115,22,0.2)' }}>
                                <TrendingDown className="text-orange-400" size={24} />
                            </div>
                            <h4 className="text-slate-500 font-semibold text-sm uppercase">Max Depletion Rate</h4>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">12% / hr</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 rounded-2xl border"
                        style={{
                            background: 'rgba(241, 245, 249, 0.92)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(148,163,184,0.4)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.2)' }}>
                                <Clock className="text-emerald-400" size={24} />
                            </div>
                            <h4 className="text-slate-500 font-semibold text-sm uppercase">Last Refill</h4>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">Today, 06:30 AM</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 rounded-2xl border"
                        style={{
                            background: 'rgba(241, 245, 249, 0.92)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(148,163,184,0.4)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(6,182,212,0.2)' }}>
                                <Wifi className="text-cyan-400" size={24} />
                            </div>
                            <h4 className="text-slate-500 font-semibold text-sm uppercase">System Status</h4>
                        </div>
                        <p className="text-2xl font-bold text-cyan-600">IoT Active</p>
                    </motion.div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default TankDashboard;
