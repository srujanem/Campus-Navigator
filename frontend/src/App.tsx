import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StudentPortal } from './portals/StudentPortal';
import { AdminPortal } from './portals/AdminPortal';
import { LandingPage } from './pages/LandingPage';
import { GraduationCap, Settings, Building } from 'lucide-react';

const TopNav: React.FC = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center">
                    <Building size={16} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">Campus 360</p>
                    <p className="text-[10px] text-gray-400 leading-none mt-0.5">Indoor Navigation System</p>
                </div>
            </Link>

            {/* Center: Portal Switcher (only when inside a portal) */}
            {!isLanding && (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <Link
                        to="/student"
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${
                            location.pathname.startsWith('/student')
                                ? 'bg-blue-700 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <GraduationCap size={14} /> Student Portal
                    </Link>
                    <Link
                        to="/admin"
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-l border-gray-200 transition-colors ${
                            location.pathname.startsWith('/admin')
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Settings size={14} /> Admin Portal
                    </Link>
                </div>
            )}

            {/* Right */}
            <div className="flex items-center gap-2">
                {isLanding ? (
                    <>
                        <Link to="/student" className="text-xs font-semibold text-blue-700 border border-blue-700 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors">
                            Student Login
                        </Link>
                        <Link to="/admin" className="text-xs font-semibold bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-colors">
                            Admin Login
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-[10px] font-bold">
                            SR
                        </div>
                        <p className="text-xs text-gray-600 hidden sm:block">Sruja N.</p>
                    </div>
                )}
            </div>
        </header>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
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
