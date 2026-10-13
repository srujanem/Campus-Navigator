import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navigation, Camera, Layers, Compass, GraduationCap, ShieldCheck, Flame } from 'lucide-react';
import { NavigationPage } from '../pages/NavigationPage';
import { VisionDemoPage } from '../pages/VisionDemoPage';
import { DigitalTwin3D } from '../components/DigitalTwin3D';

const StudentSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/student', icon: <Navigation size={16} />, label: 'Indoor Navigation', exact: true },
        { path: '/student/3d', icon: <Layers size={16} />, label: '3D Building Twin', exact: false },
        { path: '/student/vision', icon: <Camera size={16} />, label: 'Door Photo Localizer', exact: false },
    ];

    return (
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-blue-700" />
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Student Portal</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Campus Navigator Spatial Suite</p>
            </div>

            <nav className="flex-1 p-2.5 space-y-1">
                {navItems.map(item => {
                    const exactActive = item.exact && location.pathname === item.path;
                    const active = exactActive || (!item.exact && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                active
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Student Profile Card */}
            <div className="p-3 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold">
                            SN
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">Sruja N.</p>
                            <p className="text-[10px] text-slate-400 leading-tight">21CS001 · Computer Science</p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                        </span>
                        <span className="text-slate-400 font-mono">v2.4 LTS</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export const StudentPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden">
            <StudentSidebar />
            <div className="flex-1 overflow-hidden bg-slate-50">
                <Routes>
                    <Route path="/" element={<NavigationPage />} />
                    <Route
                        path="/3d"
                        element={
                            <div className="h-full p-5 overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-base font-bold text-slate-900">3D Building Inspector & Spatial Digital Twin</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Explore all 4 campus floors in interactive 3D with cross-floor elevation paths.</p>
                                </div>
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs" style={{ height: '520px' }}>
                                    <DigitalTwin3D highlightFloor={2} interactive={true} />
                                </div>
                            </div>
                        }
                    />
                    <Route path="/vision" element={<VisionDemoPage />} />
                </Routes>
            </div>
        </div>
    );
};
