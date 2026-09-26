import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap, Settings2, Map, BookOpen, Camera,
    Building2, ArrowRight, Shield, Users, CheckCircle,
    Zap, Globe, ChevronRight, Star, Award, BarChart2,
    Navigation, Library, QrCode
} from 'lucide-react';

const StatCard: React.FC<{ number: string; label: string }> = ({ number, label }) => (
    <div className="text-center">
        <p className="text-4xl font-black text-white">{number}</p>
        <p className="text-sm text-blue-200 font-medium mt-1">{label}</p>
    </div>
);

const FeatureCard: React.FC<{
    icon: React.ReactNode; title: string; desc: string; color: string;
}> = ({ icon, title, desc, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
            {icon}
        </div>
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export const LandingPage: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto">
            {/* ── HERO SECTION ── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
                {/* Background decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-6 py-20">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Official Campus Digital Platform
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 max-w-3xl">
                            Your Campus,{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                Fully Connected
                            </span>
                        </h1>
                        <p className="text-lg text-blue-200 max-w-2xl leading-relaxed mb-12">
                            Campus 360 is the official digital platform of your institution — combining
                            AI-powered indoor navigation, a smart library management system, and an
                            administrative portal, all in one secure web application.
                        </p>

                        {/* CTA Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl mb-16">
                            {/* Student CTA */}
                            <Link to="/student" className="group bg-blue-600 hover:bg-blue-500 transition-all rounded-2xl p-6 text-left shadow-2xl shadow-blue-900/50 border border-blue-500/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <GraduationCap size={24} className="text-white" />
                                    </div>
                                    <ArrowRight size={20} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h2 className="text-white font-black text-xl mb-1">Student Portal</h2>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    Navigate the campus, find your classroom, check book availability and reserve from the library.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {['Indoor Navigation', 'Library Search', 'Class Finder'].map(tag => (
                                        <span key={tag} className="bg-white/10 text-blue-100 text-[10px] font-bold px-2 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </Link>

                            {/* Admin CTA */}
                            <Link to="/admin" className="group bg-slate-800 hover:bg-slate-700 transition-all rounded-2xl p-6 text-left shadow-2xl shadow-slate-900/50 border border-slate-700/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                        <Settings2 size={24} className="text-white" />
                                    </div>
                                    <ArrowRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h2 className="text-white font-black text-xl mb-1">Admin Portal</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Manage campus maps, upload building photos, configure library inventory and track circulation.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {['Campus Mapping', 'Library Admin', 'Photo Upload'].map(tag => (
                                        <span key={tag} className="bg-white/5 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700">{tag}</span>
                                    ))}
                                </div>
                            </Link>
                        </div>

                        {/* Stats Row */}
                        <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-8 py-6">
                            <div className="grid grid-cols-4 gap-8 divide-x divide-white/10">
                                <StatCard number="4" label="Floors Mapped" />
                                <StatCard number="40+" label="Rooms & Labs" />
                                <StatCard number="500+" label="Books Catalogued" />
                                <StatCard number="99%" label="Uptime" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES SECTION ── */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-blue-600 text-sm font-black uppercase tracking-widest mb-3">Platform Capabilities</p>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Everything Your Campus Needs</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">A single platform built for institutions that want to modernize, digitize, and empower their campus community.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FeatureCard
                            icon={<Navigation size={22} className="text-white" />}
                            title="AI Indoor Navigation"
                            desc="Turn-by-turn directions inside any building using floor plan graphs. Supports accessible routes via lifts and dual-path shortest route recommendations."
                            color="bg-blue-600"
                        />
                        <FeatureCard
                            icon={<Camera size={22} className="text-white" />}
                            title="Photo-to-Map Generation"
                            desc='Admins walk the corridors snapping photos. The AI engine automatically identifies rooms, signs and corridors, then builds the navigation graph.'
                            color="bg-indigo-600"
                        />
                        <FeatureCard
                            icon={<Library size={22} className="text-white" />}
                            title="Smart Library System"
                            desc="Full-cycle book lifecycle: ISBN auto-fill, rack/shelf tracking, borrow & return circulation, overdue alerts, and 'Walk to Shelf' navigation."
                            color="bg-emerald-600"
                        />
                        <FeatureCard
                            icon={<Zap size={22} className="text-white" />}
                            title="Voice Search & Multilingual"
                            desc="Students speak their destination in English, Hindi, Tamil, or Telugu. The AI agent parses, resolves, and navigates them in under a second."
                            color="bg-amber-600"
                        />
                        <FeatureCard
                            icon={<QrCode size={22} className="text-white" />}
                            title="AR Live Camera View"
                            desc="Point the device camera at any corridor and see AR directional arrows overlaid in real-time, powered by a Visual SLAM processing engine."
                            color="bg-rose-600"
                        />
                        <FeatureCard
                            icon={<Shield size={22} className="text-white" />}
                            title="College-Grade Security"
                            desc="Role-based access control, SSO-ready with college email domains. Students, Faculty, Librarians, and Admins each have scoped access."
                            color="bg-slate-700"
                        />
                    </div>
                </div>
            </section>

            {/* ── TWO PORTALS SECTION ── */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-blue-600 text-sm font-black uppercase tracking-widest mb-3">Two Purpose-Built Portals</p>
                        <h2 className="text-3xl font-black text-slate-900">Designed for Every Role</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Student Portal Details */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <GraduationCap size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-xl">Student Portal</h3>
                                    <p className="text-blue-600 text-xs font-bold">For students, visitors, and faculty</p>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Navigate to any room, lab, or facility by name or room number',
                                    'Compare 2 routes with AI-recommended shortest path',
                                    'Search library books by title, author, ISBN, or course subject',
                                    'Check real-time availability (copies on shelf)',
                                    '"Walk to Book Shelf" — navigate directly to the physical rack',
                                    'Reserve books and view due dates',
                                    'Voice search in 4 Indian languages',
                                    'AR camera overlay with live directional arrows',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/student" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all w-full">
                                Open Student Portal <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Admin Portal Details */}
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Settings2 size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-xl">Admin Portal</h3>
                                    <p className="text-slate-500 text-xs font-bold">For campus staff, librarians, and IT admins</p>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Upload building floor plan photos for automatic map generation',
                                    'Add and configure rooms, labs, and facilities on each floor',
                                    'Add books via ISBN scan — auto-fills title, author and edition',
                                    'Assign books to physical racks and shelves on the map',
                                    'Issue and return books with one-click circulation',
                                    'View all active borrows, overdue records and fine management',
                                    'Manage campus timetable for schedule-based alerts',
                                    'Multi-campus management for large universities',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/admin" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all w-full">
                                Open Admin Portal <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-slate-900 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Building2 size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm">Campus 360</p>
                            <p className="text-slate-500 text-[10px]">Official Campus Digital Platform</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs">© 2026 Campus 360. All rights reserved. Built for educational institutions.</p>
                </div>
            </footer>
        </div>
    );
};
