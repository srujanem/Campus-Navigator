import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { NavigationPage } from './pages/NavigationPage';
import { VisionDemoPage } from './pages/VisionDemoPage';
import { AdminPage } from './pages/AdminPage';
import { Map, Camera, Settings } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    
    return (
        <div className="w-16 bg-gray-900 flex flex-col items-center py-6 space-y-8 h-screen z-50">
            <Link to="/" className={`p-3 rounded-xl transition-colors ${location.pathname === '/' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title="Navigation">
                <Map size={24} />
            </Link>
            <Link to="/vision" className={`p-3 rounded-xl transition-colors ${location.pathname === '/vision' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title="VLM Photo Demo">
                <Camera size={24} />
            </Link>
            <div className="flex-1" />
            <Link to="/admin" className={`p-3 rounded-xl transition-colors ${location.pathname === '/admin' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title="Admin Portal">
                <Settings size={24} />
            </Link>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-hidden relative">
                    <Routes>
                        <Route path="/" element={<NavigationPage />} />
                        <Route path="/vision" element={<VisionDemoPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
