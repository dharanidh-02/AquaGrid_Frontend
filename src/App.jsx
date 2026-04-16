import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Features from './pages/Features';
import TankDashboard from './pages/TankDashboard';
import { DemoProvider } from './context/DemoContext';

function App() {
    return (
        <DemoProvider>
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tanks" element={<TankDashboard />} />
                </Routes>
            </div>
        </DemoProvider>
    );
}

export default App;
