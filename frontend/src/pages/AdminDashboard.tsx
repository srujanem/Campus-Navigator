import React from 'react';
import { Link } from 'react-router-dom';
import { Map, FileText, Building, CheckCircle, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

const StatCard: React.FC<{ label: string; value: string; sub: string }> = ({ label, value, sub }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
);

export const AdminDashboard: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Campus 360 — Block A Academic Complex</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Navigation System Online
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Floors Mapped" value="4" sub="Ground to Floor 3" />
                <StatCard label="Rooms & Labs" value="40" sub="Indexed and named" />
                <StatCard label="Navigation Edges" value="52" sub="Walkable connections" />
                <StatCard label="VLM Accuracy" value="99.2%" sub="Photo recognition" />
            </div>

            {/* Two Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-700">
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Blueprint & Vision Studio</p>
                            <p className="text-xs text-gray-500">Upload floor plans and corridor photos</p>
                        </div>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                        {[
                            'Upload CAD / PDF floor plan drawings',
                            'Walk-and-snap corridor photo training',
                            'AI auto-extracts rooms and corridors',
                        ].map(t => (
                            <li key={t} className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> {t}
                            </li>
                        ))}
                    </ul>
                    <Link
                        to="/admin/blueprint"
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors w-fit"
                    >
                        Open Blueprint Studio <ArrowRight size={13} />
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-700">
                            <Map size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Campus Graph Manager</p>
                            <p className="text-xs text-gray-500">Rooms, routes, and timetable</p>
                        </div>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                        {[
                            'Add and configure rooms, labs, staircases',
                            'Set accessible routes via lift or stairs',
                            'Upload class timetable for departure alerts',
                        ].map(t => (
                            <li key={t} className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> {t}
                            </li>
                        ))}
                    </ul>
                    <Link
                        to="/admin/campus"
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded transition-colors w-fit"
                    >
                        Open Graph Setup <ArrowRight size={13} />
                    </Link>
                </div>
            </div>

            {/* System Status Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">System Status</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {[
                        { name: 'Navigation Graph Engine', status: 'Online', detail: 'A* pathfinding active — 52 nodes loaded', ok: true },
                        { name: 'VLM Photo Recognition', status: 'Online', detail: 'Gemini Vision pipeline ready', ok: true },
                        { name: 'Voice Search API', status: 'Online', detail: 'Web Speech API — 4 language models active', ok: true },
                        { name: 'Timetable Sync', status: 'Pending Upload', detail: 'No timetable CSV uploaded yet', ok: false },
                    ].map(row => (
                        <div key={row.name} className="px-5 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-900">{row.name}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{row.detail}</p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                row.ok
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                {row.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
