import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Map, Camera, Layers } from 'lucide-react';
import { NavigationPage } from '../pages/NavigationPage';
import { VisionDemoPage } from '../pages/VisionDemoPage';
import { DigitalTwin3D } from '../components/DigitalTwin3D';

const StudentSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/student', icon: <Map size={15} />, label: 'Navigate', exact: true },
        { path: '/student/3d', icon: <Layers size={15} />, label: '3D Building View', exact: false },
        { path: '/student/vision', icon: <Camera size={15} />, label: 'Photo Localize', exact: false },
    ];

    return (
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
            <div className="px-4 py-4 border-b border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Student Portal</p>
            </div>
            <nav className="flex-1 p-2 space-y-0.5">
                {navItems.map(item => {
                    const exactActive = item.exact && location.pathname === item.path;
                    const active = exactActive || (!item.exact && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                                active
                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className={active ? 'text-blue-700' : 'text-gray-400'}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-3 border-t border-gray-100">
                <div className="bg-gray-50 rounded p-2.5">
                    <p className="text-[10px] font-semibold text-gray-500">Logged in as</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">Sruja N.</p>
                    <p className="text-[10px] text-gray-400">21CS001 · CSE</p>
                </div>
            </div>
        </aside>
    );
};

export const StudentPortal: React.FC = () => {
    return (
        <div className="flex h-full overflow-hidden">
            <StudentSidebar />
            <div className="flex-1 overflow-hidden bg-gray-50">
                <Routes>
                    <Route path="/" element={<NavigationPage />} />
                    <Route
                        path="/3d"
                        element={
                            <div className="h-full p-5 overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-base font-bold text-gray-900">3D Building Inspector</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">View all 4 floors with cross-floor route visualization.</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '480px' }}>
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
