import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    GraduationCap, Settings, Navigation, Camera,
    Map, Building2, ArrowRight, CheckCircle, Layers, Mic,
    Shield, Sparkles, Compass, AlertTriangle, Users, BookOpen,
    Utensils, BedDouble, Search, ChevronRight, Activity, Clock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [quickStart, setQuickStart] = useState('entrance_main');
    const [quickEnd, setQuickEnd] = useState('ai_lab');

    const handleQuickRoute = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/student?start=${encodeURIComponent(quickStart)}&end=${encodeURIComponent(quickEnd)}`);
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-50 text-slate-800">

            {/* ── HERO SECTION ── */}
            <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-4 sm:px-6 py-12 md:py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-700/60 text-blue-200 text-xs font-semibold px-3.5 py-1 rounded-full mb-5 shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        INSTITUTIONAL INDOOR NAVIGATION & SPATIAL TWIN SYSTEM
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                        Campus 360 — Intelligent Indoor Navigation
                    </h1>
                    
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
                        Autonomous zero-hardware campus routing, AI door-sign vision recognition, dynamic maintenance hazard avoidance, and multi-language voice guidance across academic, residential, and dining blocks.
                    </p>

                    {/* Quick Route Search Bar Component */}
                    <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200/80 text-left mb-10 text-slate-900">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                                <Compass size={14} className="text-blue-600" />
                                Instant Route Finder
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                Direct to Step-by-Step Directions
                            </span>
                        </div>

                        <form onSubmit={handleQuickRoute} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                            <div className="sm:col-span-5">
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                                    Current Location / Origin
                                </label>
                                <select
                                    value={quickStart}
                                    onChange={(e) => setQuickStart(e.target.value)}
                                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="entrance_main">Main Gate (Academic Ground)</option>
                                    <option value="room_309">Room 309 (Hostel Block F3)</option>
                                    <option value="central_library">Central Library (Reading Floor)</option>
                                    <option value="canteen">Campus Canteen (Food Court)</option>
                                    <option value="reception">Admin Reception (Ground Floor)</option>
                                </select>
                            </div>

                            <div className="sm:col-span-5">
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                                    Destination Room / POI
                                </label>
                                <select
                                    value={quickEnd}
                                    onChange={(e) => setQuickEnd(e.target.value)}
                                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ai_lab">AI Lab (Academic Block F2)</option>
                                    <option value="room_104">Room 104 (Academic Block F1)</option>
                                    <option value="room_305">Room 305 (Academic Block F3)</option>
                                    <option value="central_library">Central Library & Reading Hall</option>
                                    <option value="canteen">Campus Food Court & Canteen</option>
                                    <option value="hostel_mess">Hostel Dining Mess</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full h-[38px] bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <Navigation size={14} /> Navigate
                                </button>
                            </div>
                        </form>

                        {/* Popular Quick-Select Chips */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-[11px] text-slate-400 font-medium">Quick Routes:</span>
                            <button
                                type="button"
                                onClick={() => { setQuickStart('room_309'); setQuickEnd('ai_lab'); }}
                                className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-2.5 py-0.5 rounded-full border border-slate-200 transition"
                            >
                                Hostel 309 → AI Lab
                            </button>
                            <button
                                type="button"
                                onClick={() => { setQuickStart('entrance_main'); setQuickEnd('central_library'); }}
                                className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-2.5 py-0.5 rounded-full border border-slate-200 transition"
                            >
                                Main Gate → Library
                            </button>
                            <button
                                type="button"
                                onClick={() => { setQuickStart('canteen'); setQuickEnd('room_305'); }}
                                className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium px-2.5 py-0.5 rounded-full border border-slate-200 transition"
                            >
                                Canteen → Room 305
                            </button>
                        </div>
                    </div>

                    {/* 3 Main Action Hub Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
                        <Link
                            to="/student"
                            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 rounded-xl p-5 transition-all group flex flex-col justify-between shadow-lg"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                        <GraduationCap size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">Student Navigation</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Turn-by-turn floor plan routing, AR door camera scanner, voice guidance, and timetable synchronization.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-blue-400 group-hover:text-blue-300">
                                    Launch Student Portal →
                                </span>
                                <span className="text-[10px] bg-blue-900/60 text-blue-300 font-medium px-2 py-0.5 rounded border border-blue-700/60">
                                    4 Languages
                                </span>
                            </div>
                        </Link>

                        <Link
                            to="/admin/qr"
                            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500 rounded-xl p-5 transition-all group flex flex-col justify-between shadow-lg"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                                        <Camera size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">Printable Door QRs</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Generate high-resolution printable door placards for every classroom, lab, washroom, and staircase.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300">
                                    Print QR Cards →
                                </span>
                                <span className="text-[10px] bg-indigo-900/60 text-indigo-300 font-medium px-2 py-0.5 rounded border border-indigo-700/60">
                                    Zero-Hardware
                                </span>
                            </div>
                        </Link>

                        <Link
                            to="/admin"
                            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 rounded-xl p-5 transition-all group flex flex-col justify-between shadow-lg"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white shadow-sm">
                                        <Settings size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-200 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">Facilities & Operations</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Live campus blueprint studio, maintenance hazard rerouting, timetable sync, and traffic telemetry.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">
                                    Open Command Center →
                                </span>
                                <span className="text-[10px] bg-slate-700/80 text-slate-300 font-medium px-2 py-0.5 rounded border border-slate-600">
                                    Admin Access
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── LIVE TELEMETRY BAR ── */}
            <section className="border-b border-slate-200 bg-white shadow-xs">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="p-2">
                        <p className="text-2xl font-black text-slate-900">4 Buildings</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Academic, Library, Dining & Hostel</p>
                    </div>
                    <div className="p-2 border-l border-slate-100">
                        <p className="text-2xl font-black text-slate-900">55 Nodes</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Indexed Rooms, Labs & Walkways</p>
                    </div>
                    <div className="p-2 border-l border-slate-100">
                        <p className="text-2xl font-black text-blue-700">98.4% Acc.</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Zero-Hardware Vision / QR Engine</p>
                    </div>
                    <div className="p-2 border-l border-slate-100">
                        <p className="text-2xl font-black text-emerald-700">&lt; 100ms</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Dual-Route A* Calculation</p>
                    </div>
                </div>
            </section>

            {/* ── MULTI-BUILDING CAMPUS DIRECTORY SHOWCASE ── */}
            <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        Campus Spatial Coverage
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-3">
                        Integrated Multi-Building Navigation
                    </h2>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
                        Seamlessly navigate inside and between the primary sectors of the university campus.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Academic Block */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                            <Building2 size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Academic Block A</h4>
                        <p className="text-[11px] text-blue-700 font-semibold mb-2">4 Floors · 28 Rooms</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Lecture Halls 101–305, Advanced AI Research Lab, Reception, Staircases A/B, and Wheelchair Elevator.
                        </p>
                    </div>

                    {/* Central Library */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                            <BookOpen size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Central Library</h4>
                        <p className="text-[11px] text-indigo-700 font-semibold mb-2">Ground Level · Reading Wing</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Quiet study halls, digital periodicals stack, reference desk, and research terminal stations.
                        </p>
                    </div>

                    {/* Canteen & Dining */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                            <Utensils size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Campus Food Court</h4>
                        <p className="text-[11px] text-amber-700 font-semibold mb-2">Ground Level · Dining Plaza</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Student cafeteria, refreshment counters, social courtyard, and daily catering facilities.
                        </p>
                    </div>

                    {/* Hostel Block */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                            <BedDouble size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Student Hostels & Mess</h4>
                        <p className="text-[11px] text-emerald-700 font-semibold mb-2">Ground & 3rd Floor</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Resident dormitories (Room 309, 310), Ground Dining Mess Hall, and Chief Warden Administrative Office.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── DETAILED CAPABILITIES GRID ── */}
            <section className="py-12 px-4 sm:px-6 bg-slate-100/70 border-t border-b border-slate-200">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Enterprise Navigation Features
                        </h2>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                            Engineered for zero-hardware deployment without costly Bluetooth beacons or Wi-Fi fingerprinting.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1. Zero Hardware Vision */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                                <Camera size={16} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Zero-Hardware Vision Localizer</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Simply point any mobile phone camera at an existing room sign or corridor doorway. The AI Vision pipeline matches room plaques with 98%+ confidence.
                            </p>
                        </div>

                        {/* 2. Dynamic Hazard Rerouting */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                                <AlertTriangle size={16} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Dynamic Maintenance Rerouting</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                When facilities mark a corridor for cleaning or repair, the navigation engine automatically recalculates routes away from the blocked hallway in real-time.
                            </p>
                        </div>

                        {/* 3. Meet a Friend */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                                <Users size={16} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Meet-a-Friend Midpoint Finder</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Two students at opposite ends of campus can calculate an optimal, fair-distance meeting room (e.g. Student in 309 & Student in 101 meet at Room 204).
                            </p>
                        </div>

                        {/* 4. Multi-Language Voice */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                                <Mic size={16} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">4-Language Voice Navigation</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Native speech synthesizer directions in English, हिन्दी (Hindi), తెలుగు (Telugu), and தமிழ் (Tamil) for full student accessibility.
                            </p>
                        </div>

                        {/* 5. Emergency SOS Evacuation */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-8 h-8 rounded bg-red-50 text-red-700 flex items-center justify-center mb-3">
                                <Shield size={16} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">1-Click Emergency Evacuation</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                In case of fire or hazard, a single tap routes you immediately to the nearest safe emergency exit and staircase, avoiding elevators.
                            </p>
                        </div>

                        {/* 6. 3D Digital Twin Inspector */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                                <Layers size={16} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">3D Spatial Digital Twin</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Interactive Three.js spatial building explorer displaying all 4 building levels, vertical elevation shifts, and stair connections.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ARCHITECTURE ── */}
            <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Core Architecture
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-2">
                        How Campus 360 Maps the Physical World
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            step: '01',
                            title: 'Blueprint Ingestion',
                            desc: 'Architectural floor plans or CAD PDFs are parsed into walkable corridor axes and room polygon coordinates.'
                        },
                        {
                            step: '02',
                            title: 'Topological Extraction',
                            desc: 'The engine constructs a multi-floor network graph linking rooms, stairs, lifts, and fire exits.'
                        },
                        {
                            step: '03',
                            title: 'Zero-Hardware Vision',
                            desc: 'Corridor sign photos train the VLM model to recognize door numbers and landmarks without beacons.'
                        },
                        {
                            step: '04',
                            title: 'A* Multimodal Dispatch',
                            desc: 'Turn-by-turn guidance is delivered with 2D floor plans, voice directions, and real-time hazard rerouting.'
                        }
                    ].map(st => (
                        <div key={st.step} className="bg-white border border-slate-200 rounded-xl p-5 relative shadow-xs">
                            <span className="text-3xl font-black text-blue-600 block mb-2">{st.step}</span>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">{st.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-slate-500">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                            <Building2 size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">Campus 360 — Official Navigation Platform</p>
                            <p className="text-[10px] text-slate-400">Institutional Facilities & Campus Safety System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <Link to="/student" className="hover:text-blue-700">Student Portal</Link>
                        <Link to="/admin" className="hover:text-blue-700">Admin Operations</Link>
                        <Link to="/admin/qr" className="hover:text-blue-700">Printable QRs</Link>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">
                            v2.4 LTS
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
