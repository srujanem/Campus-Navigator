import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap, ShieldCheck, Camera,
    Building2, ArrowRight, Shield, CheckCircle2,
    Zap, Navigation, Layers, Compass, Sparkles, Cpu,
    Crosshair
} from 'lucide-react';
import { DigitalTwin3D } from '../components/DigitalTwin3D';

export const LandingPage: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden pt-12 pb-20 px-6 border-b border-cyan-500/10">
                {/* Cyber Grid & Radial Glow Background */}
                <div className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
                        backgroundSize: '48px 48px'
                    }}
                />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto">
                    {/* Top Pill */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider shadow-lg shadow-cyan-500/20">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            OFFICIAL CAMPUS SPATIAL TWIN & AI NAVIGATION
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
                            Autonomous Campus{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                                Digital Twin
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                            Convert architectural blueprints and hallway photos into hyper-accurate 3D indoor navigation,
                            dual-route shortest path guidance, and AR live camera tracking.
                        </p>
                    </div>

                    {/* ── TWO-COLUMN HERO INTERACTIVE GRID ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
                        {/* Left: 2 Dedicated Portal Launchpads */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Portal 1: Student Navigator */}
                            <Link
                                to="/student"
                                className="group block bg-gradient-to-br from-slate-900/90 to-blue-950/70 border border-cyan-500/30 hover:border-cyan-400 p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/20 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                                        <GraduationCap size={26} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                                        Launch App <ArrowRight size={14} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-white mb-1.5 font-mono">1. Student Navigator Portal</h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    Turn-by-turn indoor routing, dual-route comparison (Fastest vs Accessible),
                                    multilingual voice search, and real-time AR Camera guidance.
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['A* Dual Route', 'AR Live View', 'Voice AI (4 Languages)', 'Turn HUD'].map(badge => (
                                        <span key={badge} className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </Link>

                            {/* Portal 2: Admin Blueprint & Vision Studio */}
                            <Link
                                to="/admin"
                                className="group block bg-gradient-to-br from-slate-900/90 to-indigo-950/70 border border-indigo-500/30 hover:border-indigo-400 p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                                        <ShieldCheck size={26} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                                        Enter Studio <ArrowRight size={14} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-white mb-1.5 font-mono">2. Admin Blueprint & Mapping Portal</h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    Upload construction CAD floorplans & corridor photos. AI extracts room labels,
                                    traces walkways, and generates navigable multi-floor graphs.
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['CAD Blueprint Ingestion', 'VLM Photo OCR', 'Graph Synthesizer', 'Schedule Sync'].map(badge => (
                                        <span key={badge} className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        </div>

                        {/* Right: Embedded Interactive 3D Digital Twin Component */}
                        <div className="lg:col-span-7">
                            <DigitalTwin3D highlightFloor={2} interactive={true} />
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                            <div>
                                <p className="text-3xl font-black text-cyan-400 font-mono">4 FLOORS</p>
                                <p className="text-xs text-slate-400 font-semibold mt-1">Full 3D Elevation Mapped</p>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <p className="text-3xl font-black text-blue-400 font-mono">30 FPS</p>
                                <p className="text-xs text-slate-400 font-semibold mt-1">Simulated Visual SLAM</p>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <p className="text-3xl font-black text-purple-400 font-mono">2 ROUTES</p>
                                <p className="text-xs text-slate-400 font-semibold mt-1">Shortest Path AI Optimizer</p>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <p className="text-3xl font-black text-emerald-400 font-mono">&lt; 0.5 SEC</p>
                                <p className="text-xs text-slate-400 font-semibold mt-1">Voice Query Resolution</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CORE CAPABILITIES ── */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded-full">
                        ENGINEERING CAPABILITIES
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                        Built for Massive Multi-Floor Facilities
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        How Campus 360 solves GPS-denied indoor localization using computer vision and graph theory.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl transition-all">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                            <Layers size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Architectural Blueprint Ingestion</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Upload 2D architectural CAD schematics or floor plan drawings. The system automatically detects
                            walkable corridor axes, room coordinates, and staircase shafts.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl transition-all">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                            <Compass size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Dual-Route AI Recommendation</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Always calculates 2 distinct paths (e.g. Lift vs Staircase) and explicitly recommends
                            the shortest route, calculating exact saved metres and seconds.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl transition-all">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                            <Crosshair size={22} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Visual SLAM AR Tracking</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Overlay directional cyber arrows directly on real-time smartphone camera feeds,
                            simulating 30 FPS Visual SLAM pose estimation and landmark matching.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-slate-800/80 py-8 px-6 bg-slate-950">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <Building2 size={18} className="text-cyan-400" />
                        <span className="font-mono text-xs font-bold text-slate-300">CAMPUS 360 · SPATIAL AI ENGINE</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                        Designed for Universities, Hospitals & Large Indoor Infrastructure.
                    </p>
                </div>
            </footer>
        </div>
    );
};
