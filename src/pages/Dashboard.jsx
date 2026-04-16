import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import KPIWidget from '../components/KPIWidget';
import LineChart from '../components/LineChart';
import RiskMeter from '../components/RiskMeter';
import AlertPanel from '../components/AlertPanel';
import ZoneCard from '../components/ZoneCard';
import PieChartWidget from '../components/PieChartWidget';
import TankLevelWidget from '../components/TankLevelWidget';
import {
    Droplets,
    Activity,
    AlertTriangle,
    TrendingUp,
    Shield,
    Wrench,
    Cpu,
    BarChart3,
    BellRing,
    FileText,
    Gauge
} from 'lucide-react';
import { API_URL } from '../config';
import { useDemo } from '../context/DemoContext';

const roleFeatureConfig = {
    Admin: {
        title: 'Admin Dashboard',
        subtitle: 'Manage apartments, meters, users, billing, and alerts across the complete complex.',
        features: [
            'Dashboard overview: total water usage and daily/weekly/monthly trends',
            'Apartment management: add, update, delete apartments and assign meters',
            'Meter management: register meters and map them to apartments',
            'User management: add/remove residents and assign Admin/User roles',
            'Anomaly monitoring: view all alerts and take corrective action',
            'Billing control: set price per unit and generate bills',
            'Reports and analytics: generate reports and review historical data',
            'System settings: configure alert thresholds and system parameters'
        ]
    },
    User: {
        title: 'Resident Dashboard',
        subtitle: 'Track your own apartment water usage, billing, and notifications.',
        features: [
            'Personal dashboard with individual daily/weekly/monthly usage',
            'Usage analytics with visual consumption trend comparison',
            'Alert notifications for leaks and abnormal consumption',
            'Billing information with estimated bill and payment history',
            'Usage history for previous consumption records',
            'Profile management to update personal details'
        ]
    },
    'Maintenance Staff': {
        title: 'Maintenance Dashboard',
        subtitle: 'Resolve leaks and meter issues quickly with clear service tracking.',
        features: [
            'Alert management for assigned issues and leak location details',
            'Issue resolution workflow: Pending to Resolved updates',
            'Meter monitoring for fault detection and maintenance reporting',
            'Service logs to maintain complete repair history'
        ]
    },
    System: {
        title: 'System Automation Dashboard',
        subtitle: 'Observe automated platform operations and scheduled processing.',
        features: [
            'Data processing for daily water usage logs',
            'Anomaly detection for unusual consumption patterns',
            'Automated report generation using CRON jobs',
            'Alert triggering when threshold rules are exceeded'
        ]
    }
};

const roleWidgetConfig = {
    Admin: [
        { title: 'Total Consumption', value: '128k L', icon: Droplets, color: 'text-blue-600' },
        { title: 'Open Alerts', value: '7', icon: AlertTriangle, color: 'text-red-500' },
        { title: 'Apartments', value: '96', icon: BarChart3, color: 'text-purple-600' },
        { title: 'Revenue (Est.)', value: 'Rs 2.4L', icon: TrendingUp, color: 'text-green-600' }
    ],
    User: [
        { title: 'Your Usage', value: '2.1k L', icon: Droplets, color: 'text-blue-600' },
        { title: 'Usage Trend', value: '+6%', icon: TrendingUp, color: 'text-teal-500' },
        { title: 'Leak Alerts', value: '1', icon: BellRing, color: 'text-red-500' },
        { title: 'Estimated Bill', value: 'Rs 780', icon: FileText, color: 'text-green-600' }
    ],
    'Maintenance Staff': [
        { title: 'Assigned Issues', value: '5', icon: Wrench, color: 'text-amber-600' },
        { title: 'Resolved Today', value: '3', icon: Shield, color: 'text-green-600' },
        { title: 'Faulty Meters', value: '2', icon: Gauge, color: 'text-red-500' },
        { title: 'Pending Logs', value: '4', icon: FileText, color: 'text-blue-600' }
    ],
    System: [
        { title: 'Jobs Completed', value: '24', icon: Cpu, color: 'text-indigo-600' },
        { title: 'Detected Anomalies', value: '3', icon: AlertTriangle, color: 'text-red-500' },
        { title: 'Reports Generated', value: '12', icon: FileText, color: 'text-teal-600' },
        { title: 'Health Status', value: 'Stable', icon: Activity, color: 'text-green-600' }
    ]
};

const Dashboard = () => {
    const location = useLocation();
    const { 
        isDemoMode, demoConsumptionData, demoTankLevel,
        demoApartments, demoUsers, demoMeters, demoAlerts,
        demoBills, demoReportsDaily, demoReportsMonthly, demoSystemSettings
    } = useDemo();
    const [user, setUser] = useState(null);
    const [adminTab, setAdminTab] = useState('overview');
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        username: '',
        password: '',
        email: '',
        dateOfBirth: '',
        role: 'User',
    });
    const [showApartmentModal, setShowApartmentModal] = useState(false);
    const [apartmentForm, setApartmentForm] = useState({
        apartmentNumber: '',
        residentName: '',
        email: '',
        block: 'A',
    });
    const [meterForm, setMeterForm] = useState({
        apartmentId: '',
        meterType: 'Water',
        status: 'Active',
    });
    const [billingRate, setBillingRate] = useState(0.05);
    const [userCreationMessage, setUserCreationMessage] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [editUserModal, setEditUserModal] = useState({ show: false, user: null, email: '', dateOfBirth: '' });
    const [editSettingModal, setEditSettingModal] = useState({ show: false, settingKey: '', value: '' });
    const [roleData, setRoleData] = useState({
        users: [],
        usage: [],
        apartmentConsumption: [],
        alerts: [],
        apartments: [],
        meters: [],
        faultyMeters: [],
        billing: null,
        reportsDaily: [],
        reportsMonthly: [],
        systemSettings: [],
        automationStatus: null,
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (!tab) {
            setAdminTab('overview');
            return;
        }
        switch (tab) {
            case 'profile':
            case 'history':
            case 'usage':
            case 'tasks':
            case 'logs':
            case 'users':
            case 'apartments':
            case 'meters':
            case 'billing':
            case 'reports':
            case 'settings':
            case 'alerts':
            case 'overview':
            case 'analytics':
                setAdminTab(tab);
                break;
            default:
                setAdminTab('overview');
        }
    }, [location.search]);

    useEffect(() => {
        const loadRoleData = async () => {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (!userData?.token || !userData?.role) return;

            const authHeaders = {
                Authorization: `Bearer ${userData.token}`,
            };

            const fetchJSON = async (url) => {
                const response = await fetch(`${API_URL}${url}`, { headers: authHeaders });
                if (!response.ok) return null;
                const raw = await response.text();
                try {
                    return raw ? JSON.parse(raw) : null;
                } catch {
                    return null;
                }
            };

            const nextData = {};
            if (userData.role === 'Admin') {
                nextData.users = (await fetchJSON('/api/auth/users')) || [];
                nextData.usage = (await fetchJSON('/api/dashboard/usage?period=monthly')) || [];
                nextData.apartmentConsumption = (await fetchJSON('/api/dashboard/apartments')) || [];
                nextData.alerts = (await fetchJSON('/api/alerts')) || [];
                nextData.apartments = (await fetchJSON('/api/apartments')) || [];
                nextData.meters = (await fetchJSON('/api/meters')) || [];
                nextData.billing = await fetchJSON('/api/billing/generate-all');
                nextData.reportsDaily = (await fetchJSON('/api/reports/daily')) || [];
                nextData.reportsMonthly = (await fetchJSON('/api/reports/monthly')) || [];
                nextData.systemSettings = (await fetchJSON('/api/system/settings')) || [];
            }

            if (userData.role === 'User') {
                nextData.billing = await fetchJSON('/api/billing/my-summary');
                nextData.reportsMonthly = (await fetchJSON('/api/reports/history')) || [];
            }

            if (userData.role === 'Maintenance Staff') {
                nextData.alerts = (await fetchJSON('/api/alerts')) || [];
                nextData.faultyMeters = (await fetchJSON('/api/meters/faulty/list')) || [];
                nextData.meters = (await fetchJSON('/api/meters')) || [];
            }

            if (userData.role === 'System') {
                nextData.usage = (await fetchJSON('/api/dashboard/usage?period=monthly')) || [];
                nextData.reportsDaily = (await fetchJSON('/api/reports/daily')) || [];
                nextData.automationStatus = await fetchJSON('/api/system/automation-status');
            }

            setRoleData((prev) => ({ ...prev, ...nextData }));
        };

        loadRoleData();
    }, [user]);

    const zones = [
        { id: 1, zoneName: 'North Sector', zoneType: 'Residential', currentLevel: 7500, tankCapacity: 10000, population: 1200 },
        { id: 2, zoneName: 'Industrial Park', zoneType: 'Industrial', currentLevel: 2000, tankCapacity: 15000, population: 50 },
        { id: 3, zoneName: 'Green Valley', zoneType: 'Residential', currentLevel: 4500, tankCapacity: 5000, population: 800 },
    ];

    const activeRole = user?.role || 'User';
    const isAdmin = activeRole === 'Admin';
    const showSharedOverview = adminTab === 'overview';
    const roleInfo = roleFeatureConfig[activeRole] || roleFeatureConfig.User;
    
    // Array Merges
    const usersToShow = isDemoMode ? [...(roleData.users || []), ...demoUsers].filter((v,i,a)=>a.findIndex(t=>(t._id === v._id))===i) : (roleData.users || []);
    const apartmentsToShow = isDemoMode ? [...(roleData.apartments || []), ...demoApartments].filter((v,i,a)=>a.findIndex(t=>(t._id === v._id))===i) : (roleData.apartments || []);
    const metersToShow = isDemoMode ? [...(roleData.meters || []), ...demoMeters].filter((v,i,a)=>a.findIndex(t=>(t._id === v._id))===i) : (roleData.meters || []);
    const alertsToShow = isDemoMode ? [...demoAlerts, ...(roleData.alerts || [])].filter((v,i,a)=>a.findIndex(t=>(t._id === v._id))===i) : (roleData.alerts || []);
    const billsToShow = isDemoMode ? [...(roleData.billing?.bills || []), ...demoBills].filter((v,i,a)=>a.findIndex(t=>(t.apartmentId === v.apartmentId))===i) : (roleData.billing?.bills || []);
    const reportsDailyToShow = isDemoMode ? [...(roleData.reportsDaily || []), ...demoReportsDaily].filter((v,i,a)=>a.findIndex(t=>(t._id === v._id))===i) : (roleData.reportsDaily || []);
    const reportsMonthlyToShow = isDemoMode ? [...(roleData.reportsMonthly || []), ...demoReportsMonthly].filter((v,i,a)=>a.findIndex(t=>(t._id === v._id))===i) : (roleData.reportsMonthly || []);
    const settingsToShow = isDemoMode && (roleData.systemSettings?.length === 0) ? demoSystemSettings : (roleData.systemSettings || []);
    
    // DEMO DATA OVERRIDES
    const demoTotalUsage = demoConsumptionData?.reduce((s, d) => s + d.current, 0) || 12800;
    
    const totalComplexUsage = isDemoMode ? demoTotalUsage : (roleData.usage || []).reduce(
        (sum, item) => sum + (item.totalUsage || 0),
        0
    );
    const derivedAdminWidgets = [
        { title: 'Total Consumption', value: `${isDemoMode ? '1.4M L' : Math.round(totalComplexUsage) + ' L'}`, icon: Droplets, color: 'text-brand-blue' },
        { title: 'Open Alerts', value: String(alertsToShow.length), icon: AlertTriangle, color: 'text-brand-red' },
        { title: 'Apartments', value: String(apartmentsToShow.length), icon: BarChart3, color: 'text-brand-purple' },
        {
            title: 'Revenue (Est.)',
            value: `Rs ${Math.round(billsToShow.reduce((sum, bill) => sum + (bill.estimatedCost || 0), 0))}`,
            icon: TrendingUp,
            color: 'text-brand-cyan'
        }
    ];

    const mappedWidgets = (roleWidgetConfig[activeRole] || roleWidgetConfig.User).map(w => {
        if (!isDemoMode) return w;
        if (w.title === 'Your Usage') return { ...w, value: '840 L' };
        if (w.title === 'Usage Trend') return { ...w, value: '-4%' };
        return w;
    });

    const roleWidgets = isAdmin ? derivedAdminWidgets : mappedWidgets;

    const lineChartData = isDemoMode
        ? (isAdmin ? demoConsumptionData.map(d => ({ name: d.time, value: d.current })) : demoConsumptionData.map(d => ({ name: d.time, value: d.current / 10 })))
        : isAdmin
            ? (roleData.usage || []).map((u) => ({
                  name: new Date(u.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                  value: u.totalUsage || 0,
              }))
            : [
                  { name: 'Mon', value: 400 },
                  { name: 'Tue', value: 300 },
                  { name: 'Wed', value: 200 },
                  { name: 'Thu', value: 278 },
                  { name: 'Fri', value: 189 },
                  { name: 'Sat', value: 239 },
                  { name: 'Sun', value: 349 },
              ];

    const alertPanelData = isDemoMode
        ? [
              { title: 'Pressure Anomaly', message: 'Detected leak in main line B', type: 'Critical', time: 'Just now' },
              { title: 'Tank Low', message: 'North sector tank below 20%', type: 'Warning', time: '1 hr ago' },
          ]
        : isAdmin
            ? alertsToShow.slice(0, 5).map((alert) => ({
                  title: alert.severity || 'Alert',
                  message: alert.message || 'No message',
                  type: alert.status || 'Unresolved',
                  time: alert.detectedAt ? new Date(alert.detectedAt).toLocaleString() : 'Recently',
              }))
            : [
                  { title: 'Critical Low Level', message: 'Industrial Park tank below 20%', type: 'Critical', time: '10 mins ago' },
                  { title: 'Abnormal Usage', message: 'North Sector usage spike detected', type: 'Warning', time: '2 hours ago' },
              ];

    const pieChartData = isDemoMode 
        ? [ { name: 'Apt 201', value: 1200 }, { name: 'Apt 304', value: 1150 }, { name: 'Apt 102', value: 900 }, { name: 'Apt 405', value: 850 } ]
        : isAdmin 
            ? (roleData.apartmentConsumption || [])
                .filter(u => u.totalUsage > 0)
                .slice(0, 5)
                .map((u, i) => ({ name: `Apt ${u.apartmentNumber || i}`, value: Math.round(u.totalUsage || 0) }))
            : [];

    const handleUserCreate = async (e) => {
        e.preventDefault();
        setUserCreationMessage('');

        try {
            const authUser = JSON.parse(localStorage.getItem('user') || '{}');
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authUser?.token ? { Authorization: `Bearer ${authUser.token}` } : {}),
                },
                body: JSON.stringify(newUserForm),
            });

            const raw = await response.text();
            let data = {};
            try {
                data = raw ? JSON.parse(raw) : {};
            } catch {
                data = { message: 'Unexpected server response while creating user' };
            }

            if (!response.ok) {
                setUserCreationMessage(data.message || 'User creation failed');
                return;
            }

            setUserCreationMessage(`User "${data.username}" created successfully.`);
            setRoleData((prev) => ({ ...prev, users: [data, ...(prev.users || [])] }));
            setNewUserForm({
                username: '',
                password: '',
                email: '',
                dateOfBirth: '',
                role: 'User',
            });
            setShowUserModal(false);
        } catch (error) {
            setUserCreationMessage('Cannot create user now. Please try again.');
        }
    };

    const getAuthHeaders = () => {
        const authUser = JSON.parse(localStorage.getItem('user') || '{}');
        return {
            'Content-Type': 'application/json',
            ...(authUser?.token ? { Authorization: `Bearer ${authUser.token}` } : {}),
        };
    };

    const apiCall = async (url, options = {}) => {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...(options.headers || {}),
            },
        });
        const raw = await response.text();
        let data = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch {
            data = {};
        }
        if (!response.ok) throw new Error(data.message || 'Request failed');
        return data;
    };

    const refreshAdminData = async () => {
        try {
            const [users, usage, apartmentConsumption, alertsData, apartments, meters, billing, reportsDaily, reportsMonthly, systemSettings] = await Promise.all([
                apiCall('/api/auth/users', { method: 'GET' }),
                apiCall('/api/dashboard/usage?period=monthly', { method: 'GET' }),
                apiCall('/api/dashboard/apartments', { method: 'GET' }),
                apiCall('/api/alerts', { method: 'GET' }),
                apiCall('/api/apartments', { method: 'GET' }),
                apiCall('/api/meters', { method: 'GET' }),
                apiCall(`/api/billing/generate-all?ratePerUnit=${billingRate}`, { method: 'GET' }),
                apiCall('/api/reports/daily', { method: 'GET' }),
                apiCall('/api/reports/monthly', { method: 'GET' }),
                apiCall('/api/system/settings', { method: 'GET' }),
            ]);

            setRoleData((prev) => ({
                ...prev,
                users: users || [],
                usage: usage || [],
                apartmentConsumption: apartmentConsumption || [],
                alerts: alertsData || [],
                apartments: apartments || [],
                meters: meters || [],
                billing: billing || { bills: [] },
                reportsDaily: reportsDaily || [],
                reportsMonthly: reportsMonthly || [],
                systemSettings: systemSettings || [],
            }));
        } catch (error) {
            setAdminMessage(error.message || 'Failed to refresh admin data');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await apiCall(`/api/auth/users/${id}`, { method: 'DELETE' });
            await refreshAdminData();
            setAdminMessage('User deleted successfully.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleUpdateUserRole = async (id, role) => {
        try {
            await apiCall(`/api/auth/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ role }),
            });
            await refreshAdminData();
            setAdminMessage('User role updated successfully.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleUpdateUserDetails = (u) => {
        const currentDob = u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().slice(0, 10) : '';
        setEditUserModal({ show: true, user: u, email: u.email || '', dateOfBirth: currentDob });
    };

    const submitUpdateUserDetails = async (e) => {
        e.preventDefault();
        try {
            setEditingUserId(editUserModal.user._id);
            await apiCall(`/api/auth/users/${editUserModal.user._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    email: editUserModal.email,
                    dateOfBirth: editUserModal.dateOfBirth || null,
                }),
            });
            await refreshAdminData();
            setAdminMessage('User updated successfully.');
            setEditUserModal({ show: false, user: null, email: '', dateOfBirth: '' });
        } catch (error) {
            setAdminMessage(error.message);
        } finally {
            setEditingUserId(null);
        }
    };

    const submitUpdateSettingDetails = async (e) => {
        e.preventDefault();
        try {
            await handleUpdateSetting(editSettingModal.settingKey, editSettingModal.value);
            setEditSettingModal({ show: false, settingKey: '', value: '' });
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleCreateApartment = async (e) => {
        e.preventDefault();
        try {
            const created = await apiCall('/api/apartments', {
                method: 'POST',
                body: JSON.stringify(apartmentForm),
            });
            await refreshAdminData();
            setApartmentForm({ apartmentNumber: '', residentName: '', email: '', block: 'A' });
            setShowApartmentModal(false);
            setAdminMessage('Apartment created successfully.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleDeleteApartment = async (id) => {
        try {
            await apiCall(`/api/apartments/${id}`, { method: 'DELETE' });
            await refreshAdminData();
            setAdminMessage('Apartment deleted successfully.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleCreateMeter = async (e) => {
        e.preventDefault();
        try {
            const created = await apiCall('/api/meters', {
                method: 'POST',
                body: JSON.stringify(meterForm),
            });
            await refreshAdminData();
            setMeterForm({ apartmentId: '', meterType: 'Water', status: 'Active' });
            setAdminMessage('Meter created successfully.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleDeleteMeter = async (id) => {
        try {
            await apiCall(`/api/meters/${id}`, { method: 'DELETE' });
            await refreshAdminData();
            setAdminMessage('Meter deleted successfully.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleGenerateBills = async () => {
        try {
            const billing = await apiCall(`/api/billing/generate-all?ratePerUnit=${billingRate}`, {
                method: 'GET',
            });
            if (typeof billing?.ratePerUnit === 'number') {
                setBillingRate(billing.ratePerUnit);
            }
            setRoleData((prev) => ({ ...prev, billing }));
            setAdminMessage((billing?.bills || []).length ? 'Bills generated successfully.' : 'No apartments found to generate bills.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    
    const triggerAction = (msg) => {
        setAdminMessage(msg);
        setTimeout(() => setAdminMessage(''), 3000);
    };

    const downloadCSV = () => {
        triggerAction('Downloading CSV...');
        const blob = new Blob(["Date,Usage\n2023-10-01,100"], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "reports.csv";
        a.click();
    };
const handleUpdateSetting = async (key, value) => {
        try {
            const updated = await apiCall(`/api/system/settings/${key}`, {
                method: 'PATCH',
                body: JSON.stringify({ value }),
            });
            await refreshAdminData();
            setAdminMessage('Setting updated.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    const handleResolveAlert = async (id) => {
        try {
            const updated = await apiCall(`/api/alerts/${id}/resolve`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Resolved' }),
            });
            await refreshAdminData();
            setAdminMessage('Alert marked as resolved.');
        } catch (error) {
            setAdminMessage(error.message);
        }
    };

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto space-y-8 bg-grid rounded-3xl p-6">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-2">
                        <div className="text-left">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-glow-cyan-sm">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800">{roleInfo.title}</h1>
                                    <p className="text-sm text-slate-500">{roleInfo.subtitle}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-slate-600 hidden sm:block flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    {showSharedOverview && (
                        <>
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {roleWidgets.map((widget, idx) => (
                                    <KPIWidget
                                        key={widget.title}
                                        title={widget.title}
                                        value={widget.value}
                                        icon={widget.icon}
                                        color={widget.color}
                                        delay={idx * 0.1}
                                    />
                                ))}
                            </div>

                            {/* Charts & Alerts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                                    <h3 className="font-bold text-slate-800 mb-2 text-lg">Weekly Usage Trends</h3>
                                    <p className="text-xs text-slate-400 mb-6">Real-time consumption data across all zones</p>
                                    <LineChart data={lineChartData} />
                                </div>
                                <div className="space-y-6">
                                    <AlertPanel alerts={alertPanelData} />
                                    {isAdmin ? (
                                        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                                            <h3 className="font-bold text-slate-800 mb-2 text-lg">Top Consumers</h3>
                                            <p className="text-xs text-slate-400 mb-4">Highest usage apartments today</p>
                                            <PieChartWidget data={pieChartData} />
                                        </div>
                                    ) : (
                                        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                                            <h3 className="font-bold text-slate-800 mb-4 text-lg">System Risk</h3>
                                            <RiskMeter riskLevel="Low" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Admin section selectors are controlled from sidebar tabs */}

                    {activeRole === 'Admin' && adminTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                                    <h3 className="font-bold text-slate-800 mb-2 text-lg">Dashboard Overview</h3>
                                    <p className="text-xs text-slate-400 mb-4">Real-time metrics snapshot</p>
                                    <p className="text-sm text-slate-600">Total complex usage: <span className="font-bold text-slate-800">{Math.round(totalComplexUsage).toLocaleString()} L</span></p>
                                    <p className="text-sm text-slate-600 mt-2">Usage trend points: <span className="font-bold text-slate-800">{roleData.usage.length}</span></p>
                                </div>
                                <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                                    <h3 className="font-bold text-slate-800 mb-2 text-lg">Complex Snapshot</h3>
                                    <p className="text-xs text-slate-400 mb-4">Current infrastructure status</p>
                                    <p className="text-sm text-slate-600">Apartments: <span className="font-bold text-slate-800">{roleData.apartments.length}</span></p>
                                    <p className="text-sm text-slate-600 mt-2">Meters: <span className="font-bold text-slate-800">{metersToShow.length}</span></p>
                                    <p className="text-sm text-slate-600 mt-2">Open alerts: <span className="font-bold text-slate-800">{alertsToShow.length}</span></p>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-800 text-lg">Real-Time Tank Monitor</h3>
                            {isDemoMode ? (
                                <TankLevelWidget overrideLevel={demoTankLevel} />
                            ) : (
                                <TankLevelWidget />
                            )}
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'users' && (
                        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 text-lg">User Management</h3>
                                <button
                                    onClick={() => setShowUserModal(true)}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Create User
                                </button>
                            </div>
                            {userCreationMessage && (
                                <p className="text-sm text-gray-700 mt-3">{userCreationMessage}</p>
                            )}
                            <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr className="text-left border-b border-slate-200">
                                            <th className="py-3 px-4 font-semibold">Username</th>
                                            <th className="py-3 px-4 font-semibold">Email</th>
                                            <th className="py-3 px-4 font-semibold">Date of Birth</th>
                                            <th className="py-3 px-4 font-semibold">Role</th>
                                            <th className="py-3 px-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersToShow.map((u) => (
                                            <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-slate-800">{u.username}</td>
                                                <td className="py-3 px-4 text-slate-600">{u.email || '-'}</td>
                                                <td className="py-3 px-4 text-slate-600">{u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : '-'}</td>
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={u.role || 'User'}
                                                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                                        className="px-2 py-1 rounded-lg border border-gray-200 bg-white"
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="User">User</option>
                                                        <option value="Maintenance Staff">Maintenance Staff</option>
                                                        <option value="System">System</option>
                                                    </select>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleUpdateUserDetails(u)}
                                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                                            disabled={editingUserId === u._id}
                                                        >
                                                            {editingUserId === u._id ? 'Updating...' : 'Update'}
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'apartments' && (
                        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                                <h3 className="font-bold text-gray-800 text-lg w-full md:w-auto">Apartment Management</h3>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <input type="text" placeholder="Search apartments..." className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 w-full md:w-64" />
                                    <button
                                        onClick={() => setShowApartmentModal(true)}
                                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
                                    >
                                        Create Apartment
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-100 mb-4 bg-white/50">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600"><tr className="text-left border-b border-slate-100"><th className="py-3 px-4">No</th><th className="py-3 px-4">Resident</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">Block</th><th className="py-3 px-4">Action</th></tr></thead>
                                <tbody>
                                    {apartmentsToShow.map((a) => (
                                        <tr key={a._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">{a.apartmentNumber}</td><td className="py-3 px-4 font-medium">{a.residentName}</td><td className="py-3 px-4 text-slate-500">{a.email}</td><td className="py-3 px-4">{a.block}</td>
                                            <td className="py-3 px-4"><button onClick={() => handleDeleteApartment(a._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'meters' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Meter Management</h3>
                            <form onSubmit={handleCreateMeter} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                                <select className="px-3 py-2 rounded-xl border border-gray-200" value={meterForm.apartmentId} onChange={(e) => setMeterForm((p) => ({ ...p, apartmentId: e.target.value }))} required>
                                    <option value="">Select Apartment</option>
                                    {apartmentsToShow.map((a) => <option key={a._id} value={a._id}>{a.apartmentNumber}</option>)}
                                </select>
                                <select className="px-3 py-2 rounded-xl border border-gray-200" value={meterForm.meterType} onChange={(e) => setMeterForm((p) => ({ ...p, meterType: e.target.value }))}>
                                    <option value="Water">Water</option>
                                    <option value="Electricity">Electricity</option>
                                </select>
                                <select className="px-3 py-2 rounded-xl border border-gray-200" value={meterForm.status} onChange={(e) => setMeterForm((p) => ({ ...p, status: e.target.value }))}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">Add</button>
                            </form>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600"><tr className="text-left border-b border-slate-200"><th className="py-3 px-4 font-semibold">Apartment</th><th className="py-3 px-4 font-semibold">Type</th><th className="py-3 px-4 font-semibold">Status</th><th className="py-3 px-4 font-semibold">Action</th></tr></thead>
                                    <tbody>
                                        {metersToShow.map((m) => (
                                            <tr key={m._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-slate-800">{m.apartmentId?.apartmentNumber || 'NA'}</td><td className="py-3 px-4 text-slate-600">{m.meterType}</td><td className="py-3 px-4 text-slate-600">{m.status}</td>
                                                <td className="py-3 px-4"><button onClick={() => handleDeleteMeter(m._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'billing' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Billing Control</h3>
                            <div className="flex gap-3 mb-4">
                                <input type="number" min="0" step="0.01" value={billingRate} onChange={(e) => setBillingRate(Number(e.target.value))} className="px-3 py-2 rounded-xl border border-gray-200 w-44" />
                                <button type="button" onClick={handleGenerateBills} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Generate Bills</button>
                            </div>
                            <table className="min-w-full text-sm">
                                <thead><tr className="text-left border-b"><th className="py-2">Apartment</th><th className="py-2">Resident</th><th className="py-2">Usage</th><th className="py-2">Estimated Cost</th></tr></thead>
                                <tbody>
                                    {billsToShow.map((b, idx) => (
                                        <tr key={`${b.apartmentId}-${idx}`} className="border-b">
                                            <td className="py-2">{b.apartmentNumber}</td><td className="py-2">{b.residentName}</td><td className="py-2">{Number(b.totalUsage || 0).toFixed(2)} L</td><td className="py-2">Rs {Number(b.estimatedCost || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {billsToShow.length > 0 && (
                                <div className="mt-3 text-sm text-gray-700">
                                    Total Bill Amount: Rs {Number(billsToShow.reduce((sum, row) => sum + Number(row.estimatedCost || 0), 0)).toFixed(2)}
                                </div>
                            )}
                            {billsToShow.length === 0 && (
                                <p className="text-sm text-gray-600 mt-3">No billing rows yet. Create apartments and click Generate Bills.</p>
                            )}
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'analytics' && (
                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Usage Analytics</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Trend analysis and top apartment consumption for the selected period.
                                </p>
                                <LineChart data={lineChartData} />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="glass-card p-6 rounded-2xl shadow-sm">
                                    <h4 className="font-semibold mb-4 text-slate-700">Top Consumers</h4>
                                    <PieChartWidget data={pieChartData} />
                                </div>
                                <div className="glass-card p-6 rounded-2xl shadow-sm">
                                    <h4 className="font-semibold mb-4 text-slate-700">Consumption Snapshot</h4>
                                    <p className="text-sm text-gray-600">Total usage: {Math.round(totalComplexUsage)} L</p>
                                    <p className="text-sm text-gray-600 mt-2">Data points: {roleData.usage.length}</p>
                                    <p className="text-sm text-gray-600 mt-2">Apartments tracked: {roleData.apartmentConsumption.length}</p>
                                    <p className="text-sm text-gray-600 mt-2">Open alerts: {alertsToShow.length}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'reports' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                <h3 className="font-bold text-gray-800 text-lg w-full sm:w-auto">Reports & Analytics</h3>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={() => window.print()} className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors shadow-sm">Export PDF</button>
                                    <button onClick={downloadCSV} className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors shadow-sm">Export CSV</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white/50 border border-slate-100 rounded-xl p-4">
                                    <h4 className="font-semibold mb-4 text-slate-700">Daily Report</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-600"><tr className="text-left border-b border-slate-100"><th className="py-3 px-4">Date</th><th className="py-3 px-4">Usage (L)</th></tr></thead>
                                            <tbody>{reportsDailyToShow.map((r) => <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="py-3 px-4">{r._id}</td><td className="py-3 px-4 font-medium">{Math.round(r.totalUsage || 0)}</td></tr>)}</tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-white/50 border border-slate-100 rounded-xl p-4">
                                    <h4 className="font-semibold mb-4 text-slate-700">Monthly Report</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-600"><tr className="text-left border-b border-slate-100"><th className="py-3 px-4">Month</th><th className="py-3 px-4">Usage (L)</th></tr></thead>
                                            <tbody>{reportsMonthlyToShow.map((r) => <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="py-3 px-4">{r._id}</td><td className="py-3 px-4 font-medium">{Math.round(r.totalUsage || 0)}</td></tr>)}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'settings' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">System Settings</h3>
                            <table className="min-w-full text-sm">
                                <thead><tr className="text-left border-b"><th className="py-2">Key</th><th className="py-2">Value</th><th className="py-2">Action</th></tr></thead>
                                <tbody>
                                    {settingsToShow.map((s) => (
                                        <tr key={s._id} className="border-b">
                                            <td className="py-2">{s.key}</td>
                                            <td className="py-2">{typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}</td>
                                            <td className="py-2"><button onClick={() => setEditSettingModal({ show: true, settingKey: s.key, value: typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value) })} className="text-blue-600">Edit</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeRole === 'Admin' && adminTab === 'alerts' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Anomaly & Alert Monitoring</h3>
                            <table className="min-w-full text-sm">
                                <thead><tr className="text-left border-b"><th className="py-2">Message</th><th className="py-2">Severity</th><th className="py-2">Status</th><th className="py-2">Action</th></tr></thead>
                                <tbody>
                                    {roleData.alerts.map((a) => (
                                        <tr key={a._id} className="border-b">
                                            <td className="py-2">{a.message}</td><td className="py-2">{a.severity}</td><td className="py-2">{a.status}</td>
                                            <td className="py-2">
                                                {a.status !== 'Resolved' && <button onClick={() => handleResolveAlert(a._id)} className="text-green-600">Resolve</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {adminMessage && <p className="text-sm text-gray-700">{adminMessage}</p>}

                    {activeRole === 'User' && adminTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Resident Quick Summary</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Current estimated bill: <span className="font-semibold text-green-600">Rs {Math.round(roleData.billing?.estimatedCost || 0)}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Monthly records available: <strong>{reportsMonthlyToShow.length}</strong>
                                </p>
                            </div>
                            <div className="glass-card p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Quick Actions</h3>
                                <div className="flex gap-3">
                                    <button onClick={() => triggerAction('Redirecting to secure payment gateway...')} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors">Pay Bill</button>
                                    <button onClick={() => triggerAction('Issue reported successfully. Maintenance notified.')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Report Issue</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeRole === 'User' && adminTab === 'alerts' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 text-lg mb-6">My Alerts</h3>
                            {alertsToShow?.length > 0 ? (
                                <div className="space-y-3">
                                    {alertsToShow.map((a) => (
                                        <div key={a._id} className="p-4 rounded-xl border border-red-100 bg-red-50/30">
                                            <p className="font-semibold text-slate-800">{a.message || 'Consumption alert'}</p>
                                            <p className="text-sm text-slate-600 mt-1">Severity: {a.severity || 'Medium'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No active alerts for your account.</p>
                            )}
                        </div>
                    )}

                    {activeRole === 'User' && adminTab === 'usage' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="font-bold text-gray-800 text-lg w-full sm:w-auto">Detailed Usage Analytics</h3>
                                <select className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                                    <option>Last 7 Days</option>
                                    <option>This Month</option>
                                    <option>Last Month</option>
                                </select>
                            </div>
                            <LineChart data={lineChartData} />
                        </div>
                    )}

                    {activeRole === 'User' && adminTab === 'billing' && (
                        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800 text-lg">Current Bill & History</h3>
                                <button onClick={() => triggerAction('Generating receipt PDF...')} className="px-4 py-2 border border-white/50 bg-white/50 backdrop-blur-sm rounded-xl text-slate-700 hover:bg-white/80 font-medium transition-all text-sm shadow-sm">Download Receipt</button>
                            </div>
                            <div className="bg-gradient-to-r from-ocean-700 via-ocean-600 to-cyan-500 rounded-2xl p-6 text-white mb-6 shadow-glow-cyan relative overflow-hidden">
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                                <div className="absolute -inset-full h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-[shimmer_4s_ease-in-out_infinite]" />
                                <p className="text-ocean-100 mb-1 relative z-10">Amount Due</p>
                                <h2 className="text-4xl font-bold mb-4 relative z-10">{roleData.billing?.estimatedCost ? `Rs ${Math.round(roleData.billing.estimatedCost).toLocaleString()}` : (isDemoMode ? 'Rs 225' : 'Rs 0')}</h2>
                                <button onClick={() => triggerAction('Payment processing via mock gateway... Success!')} className="bg-white text-ocean-700 px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all relative z-10">Pay Now</button>
                            </div>
                            <h4 className="font-semibold mb-4 text-slate-700">Past Payments</h4>
                            <p className="text-sm text-slate-500 mt-2">Payment history records: {(roleData.billing?.paymentHistory || []).length > 0 ? roleData.billing.paymentHistory.length : (isDemoMode ? 2 : 0)}</p>
                        </div>
                    )}

                    {activeRole === 'User' && adminTab === 'history' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-800 text-lg">Usage History</h3>
                                <input type="month" className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl" />
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white/50">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600"><tr className="text-left border-b border-slate-100"><th className="py-3 px-4">Period</th><th className="py-3 px-4">Consumption (L)</th></tr></thead>
                                    <tbody>{reportsMonthlyToShow.map((r, i) => <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="py-3 px-4">{r._id}</td><td className="py-3 px-4 font-medium">{Math.round(r.totalUsage || 0)}</td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeRole === 'User' && adminTab === 'profile' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm max-w-2xl mx-auto">
                            <h3 className="font-bold text-gray-800 mb-6 text-lg border-b pb-4">Profile Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Full Name</label>
                                    <input type="text" defaultValue={user?.username || ''} className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Email</label>
                                    <input type="email" defaultValue={user?.email || 'user@example.com'} className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Apartment Unit</label>
                                    <input type="text" readOnly defaultValue="A-402" className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button onClick={() => triggerAction('Profile settings saved successfully.')} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Save Changes</button>
                                    <button onClick={() => triggerAction('Password reset link sent to your email.')} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200">Change Password</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Maintenance Staff' && adminTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl border-l-4 border-l-amber-400 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent" />
                                <h3 className="font-bold text-slate-800 mb-2 text-lg relative z-10">Pending Issues</h3>
                                <p className="text-3xl font-bold text-slate-800 mb-2 relative z-10">5 <span className="text-sm font-normal text-slate-500">Tasks assigned</span></p>
                                <p className="text-sm text-slate-600 relative z-10">2 HIGH Priority Leaks</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-lg p-6 rounded-2xl border-l-4 border-l-green-400 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-transparent" />
                                <h3 className="font-bold text-slate-800 mb-2 text-lg relative z-10">Quick Stats</h3>
                                <p className="text-3xl font-bold text-slate-800 mb-2 relative z-10">3 <span className="text-sm font-normal text-slate-500">Resolved Today</span></p>
                                <p className="text-sm text-slate-600 relative z-10">Avg resolution time: 1.2 hrs</p>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Maintenance Staff' && adminTab === 'alerts' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                <h3 className="font-bold text-gray-800 text-lg">Leak & System Alerts</h3>
                            </div>
                            <div className="space-y-4">
                                {alertsToShow?.length > 0 ? alertsToShow.map((a, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md uppercase tracking-wider">{a.severity || 'HIGH'}</span>
                                                <h4 className="font-bold text-slate-800">{a.message || 'Main Line Pressure Drop'}</h4>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium">Location: <span className="text-slate-800">{a.location || 'Block A - Basement'}</span></p>
                                            <p className="text-xs text-slate-500 mt-1">Detected: {a.time || '10 mins ago'}</p>
                                        </div>
                                        <div className="sm:self-center">
                                            <button onClick={() => triggerAction('Work order initiated.')} className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors">Start Work</button>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-500">No active alerts.</p>}
                            </div>
                        </div>
                    )}

                    {activeRole === 'Maintenance Staff' && adminTab === 'tasks' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 text-lg mb-6">Assigned Work Orders</h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white/50">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600"><tr className="text-left border-b border-slate-100"><th className="py-3 px-4">Task ID</th><th className="py-3 px-4">Description</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Action</th></tr></thead>
                                    <tbody>
                                        <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="py-3 px-4 font-medium">WRK-001</td><td className="py-3 px-4">Fix leaky pipe</td><td className="py-3 px-4"><span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-medium text-xs">Pending</span></td>
                                            <td className="py-3 px-4"><select className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs"><option>Pending</option><option>In Progress</option><option>Completed</option></select></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeRole === 'Maintenance Staff' && adminTab === 'meters' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 text-lg mb-6">Faulty Meters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {metersToShow?.filter(m => m.status === 'Maintenance').length > 0 ? metersToShow.filter(m => m.status === 'Maintenance').map((m, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-orange-100 bg-orange-50/30 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-slate-800">Meter #{m._id.slice(-4)}</h4>
                                            <p className="text-sm text-slate-600">Apt: {m.apartmentId?.apartmentNumber || 'Unknown'}</p>
                                        </div>
                                        <button onClick={() => triggerAction('Meter status updated to Active.')} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg">Update Status</button>
                                    </div>
                                )) : <p className="text-slate-500">No faulty meters tracked currently.</p>}
                            </div>
                        </div>
                    )}

                    {activeRole === 'Maintenance Staff' && adminTab === 'logs' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-800 text-lg">Maintenance History & Logs</h3>
                                <button onClick={() => triggerAction('Manual log recorded.')} className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl hover:bg-slate-50 font-medium">Add Manual Log</button>
                            </div>
                            <div className="space-y-3">
                                <div className="p-4 rounded-xl border border-slate-100 bg-white/50 text-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800">Replaced Valve - Apt 204</h4>
                                        <span className="text-slate-500 text-xs">Oct 24, 2023 - 14:30</span>
                                    </div>
                                    <p className="text-slate-600">Replaced the pressure valve successfully. System pressure restored to normal.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeRole === 'System' && adminTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Automation Health</h3>
                                <p className="text-sm text-gray-600">
                                    Pipeline status: {roleData.automationStatus?.pipelineStatus || 'Healthy'}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Last anomaly scan: {roleData.automationStatus?.lastAnomalyScan ? new Date(roleData.automationStatus.lastAnomalyScan).toLocaleString() : 'NA'}
                                </p>
                            </div>
                            <div className="glass-card p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Automated Reports</h3>
                                <p className="text-sm text-gray-600">Daily report rows: {reportsDailyToShow.length}</p>
                                <p className="text-sm text-gray-600 mt-2">Usage trend points: {isDemoMode ? demoConsumptionData.length : (roleData.usage || []).length}</p>
                            </div>
                        </div>
                    )}

                    {activeRole === 'System' && adminTab === 'analytics' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">System Usage Analytics</h3>
                            <p className="text-sm text-gray-600 mb-4">Automated monthly trend data generated by the processing pipeline.</p>
                            <LineChart data={lineChartData} />
                        </div>
                    )}

                    {activeRole === 'System' && adminTab === 'reports' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Automated Daily Reports</h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white/50">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr className="text-left border-b border-slate-100">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Usage (L)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportsDailyToShow.map((r) => (
                                            <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                <td className="py-3 px-4">{r._id}</td>
                                                <td className="py-3 px-4 font-medium">{Math.round(r.totalUsage || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeRole === 'System' && adminTab === 'settings' && (
                        <div className="glass-card p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Automation Settings</h3>
                            <p className="text-sm text-gray-600">Pipeline status: {roleData.automationStatus?.pipelineStatus || 'Healthy'}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                Last anomaly scan: {roleData.automationStatus?.lastAnomalyScan ? new Date(roleData.automationStatus.lastAnomalyScan).toLocaleString() : 'NA'}
                            </p>
                        </div>
                    )}

                    {showSharedOverview && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Zone Status</h3>
                                <button className="text-blue-600 font-medium hover:text-blue-700 text-sm transition-colors">View All Zones</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {zones.map(zone => (
                                    <ZoneCard key={zone.id} zone={zone} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals placed outside glass-card containers to avoid containing-block z-index issues */}
                {editUserModal.show && (
                    <div className="fixed inset-0 z-[100] bg-black/50">
                        <div className="min-h-screen w-full flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-gray-800">Update User Details</h4>
                                    <button onClick={() => setEditUserModal({ show: false, user: null, email: '', dateOfBirth: '' })} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                                </div>
                                <form onSubmit={submitUpdateUserDetails} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                                        <input type="email" value={editUserModal.email} onChange={(e) => setEditUserModal(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Date of Birth</label>
                                        <input type="date" value={editUserModal.dateOfBirth} onChange={(e) => setEditUserModal(p => ({ ...p, dateOfBirth: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => setEditUserModal({ show: false, user: null, email: '', dateOfBirth: '' })} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700">Cancel</button>
                                        <button type="submit" disabled={editingUserId} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">{editingUserId ? 'Saving...' : 'Save Changes'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {editSettingModal.show && (
                    <div className="fixed inset-0 z-[100] bg-black/50">
                        <div className="min-h-screen w-full flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-gray-800">Update Setting</h4>
                                    <button onClick={() => setEditSettingModal({ show: false, settingKey: '', value: '' })} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                                </div>
                                <form onSubmit={submitUpdateSettingDetails} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">{editSettingModal.settingKey}</label>
                                        <input type="text" value={editSettingModal.value} onChange={(e) => setEditSettingModal(p => ({ ...p, value: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => setEditSettingModal({ show: false, settingKey: '', value: '' })} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700">Cancel</button>
                                        <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showUserModal && (
                    <div className="fixed inset-0 z-[100] bg-black/50">
                        <div className="min-h-screen w-full flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">Create User</h4>
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleUserCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Username</label>
                                    <input type="text" value={newUserForm.username} onChange={(e) => setNewUserForm((prev) => ({ ...prev, username: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Password</label>
                                    <input type="password" value={newUserForm.password} onChange={(e) => setNewUserForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                                    <input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Date of Birth</label>
                                    <input type="date" value={newUserForm.dateOfBirth} onChange={(e) => setNewUserForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowUserModal(false)}
                                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                )}
                {showApartmentModal && (
                    <div className="fixed inset-0 z-[100] bg-black/50">
                        <div className="min-h-screen w-full flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-gray-800">Create Apartment</h4>
                                    <button
                                        type="button"
                                        onClick={() => setShowApartmentModal(false)}
                                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>
                                <form onSubmit={handleCreateApartment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Apartment Number</label>
                                        <input type="text" value={apartmentForm.apartmentNumber} onChange={(e) => setApartmentForm((p) => ({ ...p, apartmentNumber: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Resident Name</label>
                                        <input type="text" value={apartmentForm.residentName} onChange={(e) => setApartmentForm((p) => ({ ...p, residentName: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                                        <input type="email" value={apartmentForm.email} onChange={(e) => setApartmentForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Block</label>
                                        <input type="text" value={apartmentForm.block} onChange={(e) => setApartmentForm((p) => ({ ...p, block: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowApartmentModal(false)}
                                            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </DashboardLayout>
    );
};

export default Dashboard;
