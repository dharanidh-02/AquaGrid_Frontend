import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '../lib/utils';
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
    const location = useLocation();

    // Default to User if role is not mapped
    const activeRole = user?.role || 'User';
    const sidebarItems = roleNavConfig[activeRole] || roleNavConfig.User;
    const currentTab = new URLSearchParams(location.search).get('tab');
    const effectiveCurrentTab = location.pathname === '/dashboard' ? currentTab || 'overview' : currentTab;

    const isItemActive = (path) => {
        const [pathname, query = ''] = path.split('?');
        const targetTab = new URLSearchParams(query).get('tab');

        if (pathname !== location.pathname) return false;
        if (!targetTab) return !effectiveCurrentTab;
        return effectiveCurrentTab === targetTab;
    };

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
        <div className="min-h-screen flex flex-col md:flex-row relative aqua-natural-bg overflow-hidden">
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 aqua-field-bg opacity-90" />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.035]" style={{
                backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            {/* Soft glow effects */}
            <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{
                background: 'linear-gradient(0deg, rgba(20,184,166,0.12), transparent)',
            }} />

            <Navbar user={user} />
            <Sidebar
                items={sidebarItems}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />
            <div className="fixed left-0 right-0 top-16 z-40 border-b border-cyan-100/70 bg-white/85 px-3 py-2 backdrop-blur-xl md:hidden">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {sidebarItems.map((item) => {
                        const active = isItemActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    'inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all',
                                    active
                                        ? 'border-teal-200 bg-teal-50 text-teal-800 shadow-sm'
                                        : 'border-slate-200 bg-white/70 text-slate-600 hover:border-cyan-200 hover:text-teal-700'
                                )}
                            >
                                <item.icon size={15} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Main content wrapper with margin left based on sidebar state */}
            <main
                className={`flex-1 pt-36 md:pt-20 p-4 sm:p-6 overflow-y-auto w-full transition-all duration-500 ease-out relative z-10 ${
                    isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-64'
                }`}
            >
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
