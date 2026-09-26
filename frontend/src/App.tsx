import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StudentPortal } from './portals/StudentPortal';
import { AdminPortal } from './portals/AdminPortal';
import { LandingPage } from './pages/LandingPage';
import { NavigationPage } from './pages/NavigationPage';
import { GraduationCap, ShieldCheck, Building2, Sparkles } from 'lucide-react';

const TopNav: React.FC = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl flex items-center justify-between px-6 z-50 flex-shrink-0">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                        <Building2 size={20} className="text-cyan-400 animate-pulse" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-base font-black text-white tracking-tight font-mono">CAMPUS <span className="text-cyan-400">360</span></p>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            Digital Twin AI
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Next-Gen Autonomous Spatial System</p>
                </div>
            </Link>

            {/* Portal Switcher when not on landing */}
            {!isLanding && (
                <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-inner">
                    <Link to="/student"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            location.pathname.startsWith('/student')
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}>
                        <GraduationCap size={15} /> Student Navigator
                    </Link>
                    <Link to="/admin"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            location.pathname.startsWith('/admin')
                                ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-cyan-400 shadow-lg border border-cyan-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}>
                        <ShieldCheck size={15} /> Admin Blueprint Portal
                    </Link>
                </div>
            )}

            {/* Right Status / Quick Actions */}
            <div className="flex items-center gap-3">
                {isLanding ? (
                    <div className="flex items-center gap-3">
                        <Link to="/student" className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95">
                            <Sparkles size={14} /> Launch Student App
                        </Link>
                        <Link to="/admin" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-all hover:border-cyan-500/50">
                            <ShieldCheck size={14} className="text-cyan-400" /> Admin Studio
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <div>
                            <p className="text-[11px] font-bold text-slate-200 font-mono">CAMPUS ONLINE</p>
                            <p className="text-[9px] text-slate-500 font-mono">Block A · 4 Floors Active</p>
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
            <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
                <TopNav />
                <div className="flex-1 overflow-hidden relative">
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
