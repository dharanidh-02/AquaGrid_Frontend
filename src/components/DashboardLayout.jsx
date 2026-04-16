import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {
    LayoutDashboard, Building2, Gauge, Users, Activity,
    AlertTriangle, FileText, BarChart3, Settings,
    History, User, ListTodo, ClipboardList, Database
} from 'lucide-react';

const roleNavConfig = {
    Admin: [
        { label: 'Dashboard', path: '/dashboard?tab=overview', icon: LayoutDashboard },
        { label: 'Apartments', path: '/dashboard?tab=apartments', icon: Building2 },
        { label: 'Meters', path: '/dashboard?tab=meters', icon: Gauge },
        { label: 'Users', path: '/dashboard?tab=users', icon: Users },
        { label: 'Usage Analytics', path: '/dashboard?tab=analytics', icon: Activity },
        { label: 'Tanks Monitor', path: '/tanks', icon: Database },
        { label: 'Alerts', path: '/dashboard?tab=alerts', icon: AlertTriangle },
        { label: 'Billing', path: '/dashboard?tab=billing', icon: FileText },
        { label: 'Reports', path: '/dashboard?tab=reports', icon: BarChart3 },
        { label: 'Settings', path: '/dashboard?tab=settings', icon: Settings },
    ],
    User: [
        { label: 'Dashboard', path: '/dashboard?tab=overview', icon: LayoutDashboard },
        { label: 'My Usage', path: '/dashboard?tab=usage', icon: Activity },
        { label: 'Alerts', path: '/dashboard?tab=alerts', icon: AlertTriangle },
        { label: 'Billing', path: '/dashboard?tab=billing', icon: FileText },
        { label: 'History', path: '/dashboard?tab=history', icon: History },
        { label: 'Profile', path: '/dashboard?tab=profile', icon: User },
    ],
    'Maintenance Staff': [
        { label: 'Dashboard', path: '/dashboard?tab=overview', icon: LayoutDashboard },
        { label: 'Alerts', path: '/dashboard?tab=alerts', icon: AlertTriangle },
        { label: 'Tasks', path: '/dashboard?tab=tasks', icon: ListTodo },
        { label: 'Meters', path: '/dashboard?tab=meters', icon: Gauge },
        { label: 'Tanks Monitor', path: '/tanks', icon: Database },
        { label: 'Logs', path: '/dashboard?tab=logs', icon: ClipboardList },
    ],
    System: [
        { label: 'Dashboard', path: '/dashboard?tab=overview', icon: LayoutDashboard },
        { label: 'Usage Analytics', path: '/dashboard?tab=analytics', icon: Activity },
        { label: 'Reports', path: '/dashboard?tab=reports', icon: BarChart3 },
        { label: 'Settings', path: '/dashboard?tab=settings', icon: Settings },
    ]
};

const DashboardLayout = ({ children, user }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Default to User if role is not mapped
    const activeRole = user?.role || 'User';
    const sidebarItems = roleNavConfig[activeRole] || roleNavConfig.User;

    // Adjust for mobile automatic collapse
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            } else {
                setIsSidebarCollapsed(false);
            }
        };
        handleResize(); // initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #e0f2fe 100%)' }}>
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(-45deg, #f0f9ff, #e0f2fe, #bae6fd, #e0f2fe, #f0f9ff)',
                backgroundSize: '400% 400%',
                animation: 'gradient-shift 12s ease infinite',
                opacity: 0.5,
            }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            {/* Soft glow effects */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
                filter: 'blur(80px)',
            }} />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{
                background: 'radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
            }} />

            <Navbar user={user} />
            <Sidebar
                items={sidebarItems}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />
            {/* Main content wrapper with margin left based on sidebar state */}
            <main
                className={`flex-1 pt-20 p-6 overflow-y-auto w-full transition-all duration-500 ease-out relative z-10 ${
                    isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-64'
                }`}
            >
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
