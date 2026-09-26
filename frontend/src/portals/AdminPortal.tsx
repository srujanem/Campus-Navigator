import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Map, Library, BookOpen, Camera,
    Settings, BarChart2, Users, Package
} from 'lucide-react';
import { AdminPage } from '../pages/AdminPage';
import { LibrarianDashboard } from '../pages/LibrarianDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    const navSections = [
        {
            title: 'Overview',
            items: [
                { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={17} />, exact: true },
            ]
        },
        {
            title: 'Campus',
            items: [
                { path: '/admin/campus', label: 'Campus Setup', icon: <Map size={17} />, exact: false },
            ]
        },
        {
            title: 'Library',
            items: [
                { path: '/admin/library', label: 'Library Management', icon: <Library size={17} />, exact: false },
            ]
        },
    ];

    return (
        <aside className="w-56 bg-slate-900 flex flex-col h-full flex-shrink-0">
            {/* Portal Header */}
            <div className="px-5 pt-5 pb-3">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Admin Portal</p>
            </div>

            {/* Nav Sections */}
            <nav className="flex-1 px-3 space-y-5 overflow-y-auto">
                {navSections.map(section => (
                    <div key={section.title}>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-3 mb-1.5">{section.title}</p>
                        <div className="space-y-0.5">
                            {section.items.map(item => {
                                const active = item.exact
                                    ? location.pathname === item.path
                                    : location.pathname.startsWith(item.path);
                                return (
                                    <Link key={item.path} to={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Admin Identity Card */}
            <div className="m-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-white text-[10px] font-black">AD</div>
                    <div>
                        <p className="text-white text-xs font-bold">Admin</p>
                        <p className="text-slate-400 text-[10px]">Super Administrator</p>
                    </div>
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
                    <Route path="/campus" element={<AdminPage />} />
                    <Route path="/library" element={<LibrarianDashboard />} />
                </Routes>
            </div>
        </div>
    );
};
