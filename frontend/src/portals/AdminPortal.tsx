import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, ShieldCheck } from 'lucide-react';
import { AdminDashboard } from '../pages/AdminDashboard';
import { BlueprintStudio } from '../pages/BlueprintStudio';
import { AdminPage } from '../pages/AdminPage';

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Admin Command Center', icon: <LayoutDashboard size={17} />, exact: true },
        { path: '/admin/blueprint', label: 'Blueprint & Vision Studio', icon: <FileText size={17} />, exact: false },
        { path: '/admin/campus', label: 'Campus Graph Manager', icon: <Map size={17} />, exact: false },
    ];

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full flex-shrink-0 select-none">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-900">
                <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                        <ShieldCheck size={14} />
                    </span>
                    <p className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest">Admin Studio</p>
                </div>
                <p className="text-sm font-black text-white font-mono mt-0.5">FACILITY MANAGEMENT</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1.5">
                {navItems.map(item => {
                    const exactActive = item.exact && location.pathname === item.path;
                    const active = exactActive || (!item.exact && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                                active
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-lg'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span className={active ? 'text-indigo-400' : 'text-slate-500'}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Admin Badge */}
            <div className="m-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
                <p className="text-[10px] font-mono text-slate-400">SESSION AUTHENTICATED</p>
                <p className="text-xs font-bold text-white font-mono">Chief Campus Architect</p>
                <p className="text-[9px] text-slate-500 font-mono">Role: Super Admin (Read/Write)</p>
            </div>
        </aside>
    );
};

export const AdminPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden bg-slate-950">
            <AdminSidebar />
            <div className="flex-1 overflow-hidden relative">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/blueprint" element={<BlueprintStudio />} />
                    <Route path="/campus" element={<AdminPage />} />
                </Routes>
            </div>
        </div>
    );
};
