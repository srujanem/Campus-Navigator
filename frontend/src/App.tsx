import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StudentPortal } from './portals/StudentPortal';
import { AdminPortal } from './portals/AdminPortal';
import { LandingPage } from './pages/LandingPage';
import {
    GraduationCap, Settings2, Home, ChevronRight,
    Building2, BookOpen, Map, Camera, LayoutDashboard
} from 'lucide-react';

const TopNav: React.FC = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 z-50 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center shadow-md">
                    <Building2 size={20} className="text-white" />
                </div>
                <div>
                    <p className="text-base font-black text-slate-900 leading-tight tracking-tight">Campus 360</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-tight">Official Campus Platform</p>
                </div>
            </Link>

            {/* Portal Switcher */}
            {!isLanding && (
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                    <Link to="/student"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname.startsWith('/student')
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-white'}`}>
                        <GraduationCap size={15} /> Student Portal
                    </Link>
                    <Link to="/admin"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname.startsWith('/admin')
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-white'}`}>
                        <Settings2 size={15} /> Admin Portal
                    </Link>
                </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {isLanding ? (
                    <>
                        <Link to="/student" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-all">
                            <GraduationCap size={15} /> Student Login
                        </Link>
                        <Link to="/admin" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-all">
                            <Settings2 size={15} /> Admin Login
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                            SR
                        </div>
                        <div className="hidden md:block">
                            <p className="text-xs font-bold text-slate-800">Sruja N.</p>
                            <p className="text-[10px] text-slate-400">Student · 21CS001</p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
                <TopNav />
                <div className="flex-1 overflow-hidden">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/student/*" element={<StudentPortal />} />
                        <Route path="/admin/*" element={<AdminPortal />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
