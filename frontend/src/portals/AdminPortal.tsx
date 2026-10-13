import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, QrCode, AlertTriangle, BarChart3, ShieldCheck, Building2 } from 'lucide-react';
import { AdminDashboard } from '../pages/AdminDashboard';
import { BlueprintStudio } from '../pages/BlueprintStudio';
import { AdminPage } from '../pages/AdminPage';
import { AdminQRGenerator } from '../pages/AdminQRGenerator';
import { AdminMaintenancePage } from '../pages/AdminMaintenancePage';
import { AdminAnalyticsPage } from '../pages/AdminAnalyticsPage';

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard & Directory', icon: <LayoutDashboard size={15} />, exact: true },
        { path: '/admin/analytics', label: 'Analytics & Events', icon: <BarChart3 size={15} />, exact: false },
        { path: '/admin/blueprint', label: 'Blueprint & Vision Studio', icon: <FileText size={15} />, exact: false },
        { path: '/admin/campus', label: 'Campus Graph Setup', icon: <Map size={15} />, exact: false },
        { path: '/admin/qr', label: 'Printable Door QRs', icon: <QrCode size={15} />, exact: false },
        { path: '/admin/maintenance', label: 'Hazard & Maintenance', icon: <AlertTriangle size={15} />, exact: false },
    ];

    return (
        <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 text-slate-300 shadow-md">
            <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-blue-400" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Facilities Admin</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Campus Operations Center</p>
            </div>

            <nav className="flex-1 p-3 space-y-1">
                {navItems.map(item => {
                    const exactActive = item.exact && location.pathname === item.path;
                    const active = exactActive || (!item.exact && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                active
                                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-800">
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Officer Role</span>
                        <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                            Active
                        </span>
                    </div>
                    <p className="text-xs font-bold text-white">Facilities & Estates</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Admin Level 1 · Root Access</p>
                </div>
            </div>
        </aside>
    );
};

export const AdminPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 overflow-hidden bg-slate-50">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/analytics" element={<AdminAnalyticsPage />} />
                    <Route path="/blueprint" element={<BlueprintStudio />} />
                    <Route path="/campus" element={<AdminPage />} />
                    <Route path="/qr" element={<AdminQRGenerator />} />
                    <Route path="/maintenance" element={<AdminMaintenancePage />} />
                </Routes>
            </div>
        </div>
    );
};
