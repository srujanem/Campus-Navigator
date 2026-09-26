import React from 'react';
import { Link } from 'react-router-dom';
import {
    Map, FileText, Building2, CheckCircle2,
    ArrowRight, Activity, Layers, Sparkles,
    Eye, ShieldCheck, Compass, Upload
} from 'lucide-react';
import { DigitalTwin3D } from '../components/DigitalTwin3D';

export const AdminDashboard: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
                        <Activity size={22} className="text-cyan-400" /> CAMPUS COMMAND CENTER
                    </h1>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                        Block A Main Academic Complex · Real-time spatial telemetry & blueprint index.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-400 font-bold">GRAPH ENGINE: ACTIVE</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'FLOOR BLUEPRINTS', value: '4 / 4', sub: 'Ground to Floor 3', color: 'text-cyan-400', border: 'border-cyan-500/20' },
                    { label: 'ROOMS & LABS', value: '40', sub: 'Indexed & Named', color: 'text-blue-400', border: 'border-blue-500/20' },
                    { label: 'WALKABLE EDGES', value: '52', sub: 'Dual Path Enabled', color: 'text-purple-400', border: 'border-purple-500/20' },
                    { label: 'VLM ACCURACY', value: '99.2%', sub: 'Visual Pose Conf.', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-slate-900/70 border ${stat.border} p-4 rounded-xl shadow-lg`}>
                        <p className="text-[10px] font-mono text-slate-400 font-bold uppercase">{stat.label}</p>
                        <p className={`text-2xl font-black font-mono mt-1 ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Two Main Admin Action Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module 1: Blueprint & Vision Studio */}
                <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-400 transition-all shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-black text-white font-mono mb-2">1. Blueprint & Vision Studio</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Upload architectural CAD drawings, floor plans, and corridor photos. The AI computer vision engine
                        automatically detects walls, corridors, and door signs.
                    </p>
                    <ul className="text-xs text-slate-300 space-y-2 mb-6 font-mono">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-cyan-400" /> AutoCAD / PDF Floorplan Scanner
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-cyan-400" /> VLM Hallway Photo Extractor
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-cyan-400" /> Automated Graph Synthesizer
                        </li>
                    </ul>
                    <Link
                        to="/admin/blueprint"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                    >
                        Launch Blueprint Studio <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Module 2: Campus Graph & Timetable Manager */}
                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-400 transition-all shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                        <Map size={24} />
                    </div>
                    <h3 className="text-lg font-black text-white font-mono mb-2">2. Campus Graph & Node Manager</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Manage rooms, labs, stairs, and elevator connections across 4 floors. Upload class timetables
                        for autonomous departure alerts.
                    </p>
                    <ul className="text-xs text-slate-300 space-y-2 mb-6 font-mono">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-indigo-400" /> Interactive Node & Edge Coordinate Editor
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-indigo-400" /> Wheelchair / Accessible Route Overrides
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-indigo-400" /> Student Timetable CSV Parser
                        </li>
                    </ul>
                    <Link
                        to="/admin/campus"
                        className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-all"
                    >
                        Open Graph Setup <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Embedded 3D Digital Twin Visualizer */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-base font-black text-white font-mono flex items-center gap-2">
                            <Layers size={18} className="text-cyan-400" /> Live 3D Building Digital Twin Telemetry
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Multi-floor topological connectivity status across all 4 building levels.
                        </p>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-1 rounded-full">
                        ACTIVE VOLUMETRIC VIEW
                    </span>
                </div>
                <div className="h-[460px]">
                    <DigitalTwin3D highlightFloor={1} interactive={true} />
                </div>
            </div>
        </div>
    );
};
