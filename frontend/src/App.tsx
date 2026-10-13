import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StudentPortal } from './portals/StudentPortal';
import { AdminPortal } from './portals/AdminPortal';
import { LandingPage } from './pages/LandingPage';
import { GraduationCap, Settings, Building2, ShieldCheck, Compass, Flame } from 'lucide-react';

const TopNav: React.FC = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const isStudent = location.pathname.startsWith('/student');
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-50 text-white shadow-md">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-400/30 group-hover:bg-blue-500 transition-colors">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                                CAMPUS NAVIGATOR
                            </span>
                            <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-semibold bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Multi-Building Live
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal leading-tight hidden sm:block">
                            Official Institutional Indoor Navigation & Spatial Twin
                        </p>
                    </div>
                </Link>
            </div>

            {/* Center: Segmented Portal Switcher */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 shadow-inner">
                <Link
                    to="/student"
                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        isStudent
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <GraduationCap size={15} />
                    <span>Student Portal</span>
                </Link>
                <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        isAdmin
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <Settings size={15} />
                    <span>Admin Operations</span>
                </Link>
            </div>

            {/* Right: User / Campus Status */}
            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>4 Buildings · 55 Nodes Active</span>
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800">
                        SN
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-xs font-semibold text-slate-200 leading-tight">Sruja N.</p>
                        <p className="text-[10px] text-slate-400 leading-tight">21CS001 · CSE</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
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
