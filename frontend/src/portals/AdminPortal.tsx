import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, QrCode, AlertTriangle } from 'lucide-react';
import { AdminDashboard } from '../pages/AdminDashboard';
import { BlueprintStudio } from '../pages/BlueprintStudio';
import { AdminPage } from '../pages/AdminPage';
import { AdminQRGenerator } from '../pages/AdminQRGenerator';
import { AdminMaintenancePage } from '../pages/AdminMaintenancePage';

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={15} />, exact: true },
        { path: '/admin/blueprint', label: 'Blueprint & Vision Studio', icon: <FileText size={15} />, exact: false },
        { path: '/admin/campus', label: 'Campus Graph Setup', icon: <Map size={15} />, exact: false },
        { path: '/admin/qr', label: 'Printable Door QRs', icon: <QrCode size={15} />, exact: false },
        { path: '/admin/maintenance', label: 'Hazard & Maintenance', icon: <AlertTriangle size={15} />, exact: false },
    ];

    return (
        <aside className="w-56 bg-gray-900 flex flex-col h-full flex-shrink-0">
            <div className="px-4 py-4 border-b border-gray-800">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Admin Portal</p>
                <p className="text-xs font-bold text-white mt-0.5">Campus 360 Admin</p>
            </div>
            <nav className="flex-1 p-2 space-y-0.5">
                {navItems.map(item => {
                    const exactActive = item.exact && location.pathname === item.path;
                    const active = exactActive || (!item.exact && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                                active
                                    ? 'bg-blue-700 text-white font-semibold'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-3 border-t border-gray-800">
                <div className="p-2.5 bg-gray-800/60 rounded">
                    <p className="text-[10px] font-semibold text-gray-400">Authenticated Admin</p>
                    <p className="text-xs font-bold text-white mt-0.5">Facilities & Operations</p>
                    <p className="text-[10px] text-green-400 font-medium mt-0.5">● System Active</p>
                </div>
            </div>
        </aside>
    );
};

export const AdminPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 overflow-hidden bg-gray-50">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/blueprint" element={<BlueprintStudio />} />
                    <Route path="/campus" element={<AdminPage />} />
                    <Route path="/qr" element={<AdminQRGenerator />} />
                    <Route path="/maintenance" element={<AdminMaintenancePage />} />
                </Routes>
            </div>
        </div>
    );
};
