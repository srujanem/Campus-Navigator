import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Map, BookOpen, Camera, Home, ChevronRight } from 'lucide-react';
import { NavigationPage } from '../pages/NavigationPage';
import { StudentLibrary } from '../pages/StudentLibrary';
import { VisionDemoPage } from '../pages/VisionDemoPage';

const StudentSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/student', icon: <Map size={18} />, label: 'Campus Navigator', exact: true },
        { path: '/student/library', icon: <BookOpen size={18} />, label: 'Library', exact: false },
        { path: '/student/vision', icon: <Camera size={18} />, label: 'Localize (VLM)', exact: false },
    ];

    return (
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
            {/* Portal Header */}
            <div className="px-5 pt-5 pb-3">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Student Portal</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map(item => {
                    const isActive = item.exact
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path) && !item.exact
                            ? location.pathname !== '/student'
                            : false;
                    const exactActive = item.exact && location.pathname === item.path;
                    const active = exactActive || (!item.exact && location.pathname.startsWith(item.path));

                    return (
                        <Link key={item.path} to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Student Card */}
            <div className="m-3 p-3 bg-blue-600 rounded-xl">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black">SR</div>
                    <div>
                        <p className="text-white text-xs font-bold">Sruja Nem</p>
                        <p className="text-blue-200 text-[10px]">21CS001 · CSE</p>
                    </div>
                </div>
                <p className="text-blue-100 text-[10px]">Semester 5 · Section A</p>
            </div>
        </aside>
    );
};

export const StudentPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden">
            <StudentSidebar />
            <div className="flex-1 overflow-hidden">
                <Routes>
                    <Route path="/" element={<NavigationPage />} />
                    <Route path="/library" element={<StudentLibrary />} />
                    <Route path="/vision" element={<VisionDemoPage />} />
                </Routes>
            </div>
        </div>
    );
};
