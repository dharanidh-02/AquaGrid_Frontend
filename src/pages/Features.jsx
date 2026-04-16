import { Activity, Droplets, ShieldCheck, BarChart3, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

const Features = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 relative overflow-hidden">
            <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow cursor-pointer">
                <ArrowLeft size={18} />
                <span className="font-medium">Home</span>
            </Link>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Platform Capabilities</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">Explore Our Smart Features</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        AquaGrid AI provides state-of-the-art anomaly detection, predictive analysis, and intelligent automated monitoring for modern water infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={BarChart3}
                        title="AI Demand Forecasting"
                        description="Predict future water usage with 95% accuracy using advanced machine learning models built over time-series data."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Leak Detection"
                        description="Real-time anomaly detection identifying leaks, pipe bursts, and highly irregular consumption patterns immediately as they happen."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Risk Scoring"
                        description="Dynamic stress risk calculation for every connected zone, automatically ranking areas that are vulnerable to shortages."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={Droplets}
                        title="Smart Optimization"
                        description="Automated intelligence recommendations mapping resource allocation to perfectly prevent critical supply gaps."
                        delay={0.4}
                    />
                </div>
                
                <div className="mt-20 flex justify-center">
                    <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-200">
                        Create Your Account Now
                    </Link>
                </div>
            </div>
            
            {/* Ambient Backgrounds */}
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0"></div>
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0"></div>
        </div>
    );
};

export default Features;
