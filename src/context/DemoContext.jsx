import React, { createContext, useState, useEffect, useContext } from 'react';

const DemoContext = createContext();

export const useDemo = () => useContext(DemoContext);

export const DemoProvider = ({ children }) => {
    const [isDemoMode, setIsDemoMode] = useState(false);
    
    // Fake Data Generators
    const [demoTankLevel, setDemoTankLevel] = useState(65);
    const [demoConsumptionData, setDemoConsumptionData] = useState([]);
    
    // Static Pervasive Demo Arrays
    const demoApartments = [
        { _id: 'a1', apartmentNumber: 'A-101', residentName: 'Ashok Kumar', email: 'ashok@demo.com', block: 'A' },
        { _id: 'a2', apartmentNumber: 'A-102', residentName: 'Priya Sharma', email: 'priya@demo.com', block: 'A' },
        { _id: 'b1', apartmentNumber: 'B-201', residentName: 'Rahul Verma', email: 'rahul@demo.com', block: 'B' },
        { _id: 'b2', apartmentNumber: 'B-205', residentName: 'Sneha Patel', email: 'sneha@demo.com', block: 'B' },
    ];

    const demoUsers = [
        { _id: 'u1', username: 'Ashok_A101', email: 'ashok@demo.com', role: 'User', dateOfBirth: '1985-04-12' },
        { _id: 'u2', username: 'Admin_Demo', email: 'admin@demo.com', role: 'Admin', dateOfBirth: '1990-01-01' },
        { _id: 'u3', username: 'Maintenance_Demo', email: 'staff@demo.com', role: 'Maintenance Staff', dateOfBirth: '1988-11-20' },
    ];

    const demoMeters = [
        { _id: 'm1', apartmentId: { apartmentNumber: 'A-101' }, meterType: 'Water', status: 'Active' },
        { _id: 'm2', apartmentId: { apartmentNumber: 'A-102' }, meterType: 'Water', status: 'Maintenance' },
        { _id: 'm3', apartmentId: { apartmentNumber: 'B-201' }, meterType: 'Electricity', status: 'Active' },
    ];

    const demoAlerts = [
        { _id: 'alt1', message: 'Leak detected in Block A basement line.', severity: 'Critical', status: 'Unresolved', detectedAt: new Date().toISOString() },
        { _id: 'alt2', message: 'Pressure drop in Tank 2', severity: 'Warning', status: 'Unresolved', detectedAt: new Date(Date.now() - 3600000).toISOString() },
    ];

    const demoBills = [
        { apartmentId: 'a1', apartmentNumber: 'A-101', residentName: 'Ashok Kumar', totalUsage: 4500, estimatedCost: 225 },
        { apartmentId: 'a2', apartmentNumber: 'A-102', residentName: 'Priya Sharma', totalUsage: 3800, estimatedCost: 190 },
        { apartmentId: 'b1', apartmentNumber: 'B-201', residentName: 'Rahul Verma', totalUsage: 5100, estimatedCost: 255 },
    ];

    const demoReportsDaily = [
        { _id: '2023-10-21', totalUsage: 12500 },
        { _id: '2023-10-22', totalUsage: 13100 },
        { _id: '2023-10-23', totalUsage: 11800 },
        { _id: '2023-10-24', totalUsage: 12200 },
        { _id: '2023-10-25', totalUsage: 14000 },
    ];

    const demoReportsMonthly = [
        { _id: '2023-06', totalUsage: 385000 },
        { _id: '2023-07', totalUsage: 395000 },
        { _id: '2023-08', totalUsage: 410000 },
        { _id: '2023-09', totalUsage: 375000 },
        { _id: '2023-10', totalUsage: 360000 },
    ];

    const demoSystemSettings = [
        { _id: 's1', key: 'BaseBillingRate', value: '0.05' },
        { _id: 's2', key: 'AnomalyThresholdLiters', value: '500' },
        { _id: 's3', key: 'AutoValvesEnabled', value: 'true' },
    ];

    // Auto-changing simulation when Demo Mode is active
    useEffect(() => {
        if (!isDemoMode) return;
        
        // Setup initial chart data
        const hours = Array.from({length: 12}, (_, i) => `${i*2}:00`);
        setDemoConsumptionData(hours.map(h => ({ time: h, current: Math.floor(Math.random() * 50) + 10, previous: Math.floor(Math.random() * 60) + 10 })));

        // Interval to auto change tank level slightly
        const interval = setInterval(() => {
            setDemoTankLevel(prev => {
                const change = (Math.random() * 4) - 2; // -2 to +2
                let next = prev + change;
                if (next > 100) next = 100;
                if (next < 5) next = 5;
                return next;
            });
            
            // Randomly update the latest chart node to look active
            setDemoConsumptionData(prevData => {
                const newData = [...prevData];
                const last = newData[newData.length - 1];
                last.current += Math.floor((Math.random() * 4) - 2);
                if (last.current < 0) last.current = 0;
                return newData;
            });

        }, 3000);

        return () => clearInterval(interval);
    }, [isDemoMode]);

    const toggleDemoMode = () => {
        setIsDemoMode(prev => !prev);
    };

    return (
        <DemoContext.Provider value={{ 
            isDemoMode, 
            toggleDemoMode, 
            demoTankLevel, 
            demoConsumptionData,
            demoApartments,
            demoUsers,
            demoMeters,
            demoAlerts,
            demoBills,
            demoReportsDaily,
            demoReportsMonthly,
            demoSystemSettings
        }}>
            {children}
        </DemoContext.Provider>
    );
};
