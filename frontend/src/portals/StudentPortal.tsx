import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Map, Camera, Layers, Compass, Sparkles } from 'lucide-react';
import { NavigationPage } from '../pages/NavigationPage';
import { VisionDemoPage } from '../pages/VisionDemoPage';
import { DigitalTwin3D } from '../components/DigitalTwin3D';

const StudentSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/student', icon: <Map size={17} />, label: '2D & AR Navigator', exact: true },
        { path: '/student/3d', icon: <Layers size={17} />, label: '3D Digital Twin', exact: false },
        { path: '/student/vision', icon: <Camera size={17} />, label: 'Photo Localization', exact: false },
    ];

    return (
        <aside className="w-60 bg-slate-950 border-r border-cyan-500/20 flex flex-col h-full flex-shrink-0 select-none">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-900">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest">Student Portal</p>
                </div>
                <p className="text-sm font-black text-white font-mono mt-0.5">NAVIGATION HUB</p>
            </div>

            {/* Nav Links */}
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
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span className={active ? 'text-cyan-400' : 'text-slate-500'}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Live GPS Status Pill */}
            <div className="m-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">INDOOR POSITION:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
                    </span>
                </div>
                <p className="text-xs font-bold text-white font-mono truncate">Main Gate (Floor 0)</p>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>ACCURACY: ±1.2M</span>
                    <span>BEACON: VLM+A*</span>
                </div>
            </div>
        </aside>
    );
};

export const StudentPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden bg-slate-950">
            <StudentSidebar />
            <div className="flex-1 overflow-hidden relative">
                <Routes>
                    <Route path="/" element={<NavigationPage />} />
                    <Route
                        path="/3d"
                        element={
                            <div className="h-full p-6 flex flex-col gap-4 overflow-y-auto">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-white font-mono flex items-center gap-2">
                                            <Layers size={20} className="text-cyan-400" /> 3D Digital Twin Building Inspector
                                        </h2>
                                        <p className="text-xs text-slate-400 font-mono">
                                            Interactive multi-tier volumetric model with cross-floor route projection.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-3 py-1 rounded-full">
                                        BLOCK A · 4 ELEVATIONS
                                    </span>
                                </div>
                                <div className="flex-1 min-h-[500px]">
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
