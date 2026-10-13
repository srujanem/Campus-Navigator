import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap, Settings, Navigation, Camera,
    Map, Building, ArrowRight, CheckCircle, Layers, Mic
} from 'lucide-react';

const FeatureRow: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export const LandingPage: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto bg-white">

            {/* ── HERO SECTION ── */}
            <section className="bg-blue-700 px-6 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                        Official Campus Digital Platform
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                        Campus 360 — Indoor Navigation System
                    </h1>
                    <p className="text-blue-100 text-base max-w-xl mx-auto mb-10 leading-relaxed">
                        An AI-powered campus navigation platform that guides students and staff through
                        any building using floor plan maps, voice search, and real-time route planning.
                    </p>

                    {/* Combined Portal Action Hub */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <Link
                            to="/student"
                            className="bg-white rounded-lg p-5 text-left hover:shadow-lg transition-all border border-blue-100 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center text-white">
                                        <GraduationCap size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <p className="font-bold text-gray-900 mb-1">Student Navigation</p>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Turn-by-turn routes, camera door scanner, voice navigation, and timetable.
                                </p>
                            </div>
                            <span className="text-[11px] font-bold text-blue-700 mt-4 inline-flex items-center gap-1">
                                Launch Portal →
                            </span>
                        </Link>

                        <Link
                            to="/admin/qr"
                            className="bg-white rounded-lg p-5 text-left hover:shadow-lg transition-all border border-blue-100 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded bg-indigo-700 flex items-center justify-center text-white">
                                        <Camera size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <p className="font-bold text-gray-900 mb-1">Printable Door QRs</p>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Generate and print physical door QR tags for Room 309, 310, labs, and washrooms.
                                </p>
                            </div>
                            <span className="text-[11px] font-bold text-indigo-700 mt-4 inline-flex items-center gap-1">
                                Print QR Cards →
                            </span>
                        </Link>

                        <Link
                            to="/admin"
                            className="bg-white rounded-lg p-5 text-left hover:shadow-lg transition-all border border-blue-100 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-white">
                                        <Settings size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-800 group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <p className="font-bold text-gray-900 mb-1">Admin Portal</p>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Manage blueprint, graph setup, and dynamic corridor hazard rerouting.
                                </p>
                            </div>
                            <span className="text-[11px] font-bold text-gray-900 mt-4 inline-flex items-center gap-1">
                                Open Dashboard →
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="border-b border-gray-100 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {[
                        { value: '4 Floors', label: 'Active Map Levels' },
                        { value: '51 Nodes', label: 'Indexed Rooms & Corridors' },
                        { value: '98%+ Accuracy', label: 'Zero-Hardware Camera/QR' },
                        { value: 'Voice & PWA', label: 'Mobile Offline Enabled' },
                    ].map(s => (
                        <div key={s.label}>
                            <p className="text-lg font-bold text-gray-900">{s.value}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TWO COLUMN: STUDENT vs ADMIN FEATURES ── */}
            <section className="py-14 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-10">
                        What Each Portal Offers
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Student Portal */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-blue-700 px-5 py-3 flex items-center gap-2">
                                <GraduationCap size={16} className="text-white" />
                                <p className="text-sm font-semibold text-white">Student Portal</p>
                            </div>
                            <div className="px-5 py-4">
                                <FeatureRow
                                    icon={<Navigation size={15} />}
                                    title="Indoor Navigation (2D Map)"
                                    desc="Step-by-step directions using a live floor plan map with room labels."
                                />
                                <FeatureRow
                                    icon={<Map size={15} />}
                                    title="Dual-Route Comparison"
                                    desc="AI calculates 2 routes and recommends the shortest path with time saved."
                                />
                                <FeatureRow
                                    icon={<Mic size={15} />}
                                    title="Voice Search"
                                    desc="Speak a room number or name in English, Hindi, Tamil, or Telugu."
                                />
                                <FeatureRow
                                    icon={<Camera size={15} />}
                                    title="AR Camera Guidance"
                                    desc="Point your phone camera down a corridor to see directional arrows overlaid."
                                />
                                <FeatureRow
                                    icon={<Layers size={15} />}
                                    title="3D Building Inspector"
                                    desc="Interactive floor-by-floor view showing the entire building layout."
                                />
                            </div>
                            <div className="px-5 pb-5">
                                <Link
                                    to="/student"
                                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 rounded transition-colors"
                                >
                                    Open Student Portal <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Admin Portal */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-800 px-5 py-3 flex items-center gap-2">
                                <Settings size={16} className="text-white" />
                                <p className="text-sm font-semibold text-white">Admin Portal</p>
                            </div>
                            <div className="px-5 py-4">
                                <FeatureRow
                                    icon={<Building size={15} />}
                                    title="Blueprint & Floor Plan Upload"
                                    desc="Upload CAD drawings or architectural PDFs to auto-generate the navigation graph."
                                />
                                <FeatureRow
                                    icon={<Camera size={15} />}
                                    title="Corridor Photo Training (VLM)"
                                    desc="Snap photos of door signs and corridors. AI reads room numbers automatically."
                                />
                                <FeatureRow
                                    icon={<Map size={15} />}
                                    title="Room & Node Manager"
                                    desc="Add, edit, or remove rooms, staircases, lifts, and walkway connections."
                                />
                                <FeatureRow
                                    icon={<Navigation size={15} />}
                                    title="Accessible Route Config"
                                    desc="Mark wheelchair-friendly paths and define lift priority rules."
                                />
                                <FeatureRow
                                    icon={<CheckCircle size={15} />}
                                    title="Timetable CSV Upload"
                                    desc="Import class schedules so students get proactive departure alerts."
                                />
                            </div>
                            <div className="px-5 pb-5">
                                <Link
                                    to="/admin"
                                    className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-2.5 rounded transition-colors"
                                >
                                    Open Admin Portal <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">How the Admin Maps the Campus</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                step: '01',
                                title: 'Upload a Blueprint',
                                desc: 'The admin uploads an architectural floor plan — a 2D drawing created during building construction that shows walls, corridors, rooms, staircases, and lifts.',
                            },
                            {
                                step: '02',
                                title: 'AI Extracts the Graph',
                                desc: 'Our computer vision engine scans the blueprint, detects walkable corridors, identifies room coordinates, and automatically places navigation nodes.',
                            },
                            {
                                step: '03',
                                title: 'Students Navigate Instantly',
                                desc: 'Once published, students can enter any room number to get turn-by-turn directions, shortest path comparison, and voice-guided navigation.',
                            },
                        ].map(s => (
                            <div key={s.step} className="bg-white border border-gray-200 rounded-lg p-5">
                                <p className="text-2xl font-bold text-blue-700 mb-3">{s.step}</p>
                                <p className="text-sm font-semibold text-gray-900 mb-2">{s.title}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-gray-200 bg-white py-6 px-6">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-700 flex items-center justify-center">
                            <Building size={12} className="text-white" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">Campus 360</p>
                    </div>
                    <p className="text-xs text-gray-400">© 2026 Campus 360. Official Campus Navigation Platform.</p>
                </div>
            </footer>
        </div>
    );
};
