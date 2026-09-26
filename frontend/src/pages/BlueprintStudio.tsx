import React, { useState } from 'react';
import {
    Upload, FileText, Camera, CheckCircle2, AlertCircle,
    Cpu, Scan, Eye, Layers, ArrowRight, ShieldCheck, Sparkles,
    RefreshCw, Zap, Play
} from 'lucide-react';

export const BlueprintStudio: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'blueprint' | 'photos' | 'specs'>('blueprint');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResults, setScanResults] = useState<{
        roomsDetected: number;
        corridorsTraced: number;
        verticalConnectors: number;
        graphNodesGenerated: number;
    } | null>(null);

    const handleSimulateScan = () => {
        setIsScanning(true);
        setScanProgress(10);
        setScanResults(null);

        const timer = setInterval(() => {
            setScanProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    setIsScanning(false);
                    setScanResults({
                        roomsDetected: 12,
                        corridorsTraced: 3,
                        verticalConnectors: 3,
                        graphNodesGenerated: 18
                    });
                    return 100;
                }
                return p + 18;
            });
        }, 250);
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <Scan size={18} />
                        </span>
                        <h1 className="text-2xl font-black text-white font-mono tracking-tight">
                            BLUEPRINT & VISION STUDIO
                        </h1>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Upload CAD construction schematics & corridor photos to autonomously synthesize spatial graphs.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                    <button
                        onClick={() => setSelectedTab('blueprint')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            selectedTab === 'blueprint'
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <FileText size={14} /> 1. Construction Blueprint
                    </button>
                    <button
                        onClick={() => setSelectedTab('photos')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            selectedTab === 'photos'
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Camera size={14} /> 2. Corridor Photos (VLM)
                    </button>
                    <button
                        onClick={() => setSelectedTab('specs')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            selectedTab === 'specs'
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Cpu size={14} /> Blueprint Guide & Specs
                    </button>
                </div>
            </div>

            {/* TAB 1: BLUEPRINT UPLOAD & SCANNER */}
            {selectedTab === 'blueprint' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Upload Dropzone */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="bg-slate-900/80 border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 text-center hover:border-cyan-400 transition-all group relative overflow-hidden">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={28} />
                            </div>
                            <h3 className="font-black text-white text-base mb-1">Upload Campus Blueprint File</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                                Supports AutoCAD export (DWG/DXF rasterized), architectural PDF floor plans, or high-res PNG/JPG schematics.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">PNG / JPEG</span>
                                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">Vector PDF</span>
                                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">AutoCAD Raster</span>
                            </div>
                            <button
                                onClick={handleSimulateScan}
                                disabled={isScanning}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 mx-auto active:scale-95 disabled:opacity-50"
                            >
                                {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                                {isScanning ? 'Neural Engine Scanning…' : 'Load Sample Blueprint & Run AI Extractor'}
                            </button>
                        </div>

                        {/* Scanning Progress Bar */}
                        {isScanning && (
                            <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-cyan-400 flex items-center gap-1.5">
                                        <Sparkles size={13} className="animate-pulse" /> Tracing Wall Geometries & Corridor Lines…
                                    </span>
                                    <span className="text-white font-bold">{scanProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                                        style={{ width: `${scanProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Extraction Results Card */}
                        {scanResults && (
                            <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 rounded-2xl p-5 space-y-3">
                                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                                    <CheckCircle2 size={16} /> Autonomous Graph Extraction Complete!
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
                                        <p className="text-xl font-black text-cyan-400 font-mono">{scanResults.roomsDetected}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Rooms Tagged</p>
                                    </div>
                                    <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
                                        <p className="text-xl font-black text-blue-400 font-mono">{scanResults.corridorsTraced}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Corridor Spines</p>
                                    </div>
                                    <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
                                        <p className="text-xl font-black text-purple-400 font-mono">{scanResults.verticalConnectors}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Stairs & Lifts</p>
                                    </div>
                                    <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-center">
                                        <p className="text-xl font-black text-emerald-400 font-mono">{scanResults.graphNodesGenerated}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">A* Graph Nodes</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                    Graph automatically integrated into navigation engine. Students can now immediately route to all 12 rooms on this floor!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Interactive Scanner Visualizer */}
                    <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                                <Eye size={14} /> LIVE AI SCANNER OVERLAY
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">FLOOR 2 BLUEPRINT (BLOCK A)</span>
                        </div>

                        {/* Interactive Blueprint Canvas Simulation */}
                        <div className="relative flex-1 min-h-[320px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                            {/* Blueprint grid */}
                            <div className="absolute inset-0 opacity-15"
                                style={{
                                    backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            {/* Architectural Blueprint Drawing */}
                            <svg viewBox="0 0 500 280" className="w-full h-full">
                                {/* Outer Wall Boundary */}
                                <rect x="30" y="20" width="440" height="240" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
                                
                                {/* North Rooms */}
                                <rect x="40" y="30" width="80" height="75" fill="#0284c7" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
                                <text x="80" y="70" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">Room 201</text>

                                <rect x="130" y="30" width="80" height="75" fill="#0284c7" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
                                <text x="170" y="70" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">Room 202</text>

                                <rect x="220" y="30" width="70" height="75" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" strokeWidth="1.2" />
                                <text x="255" y="70" fill="#e9d5ff" fontSize="9" fontWeight="bold" textAnchor="middle">Lift Core</text>

                                <rect x="300" y="30" width="80" height="75" fill="#0284c7" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
                                <text x="340" y="70" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">Room 203</text>

                                <rect x="390" y="30" width="70" height="75" fill="#0284c7" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
                                <text x="425" y="70" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">Room 204</text>

                                {/* Main Corridor Spine */}
                                <rect x="40" y="115" width="420" height="40" fill="#06b6d4" fillOpacity="0.08" stroke="#06b6d4" strokeWidth="1.5" />
                                <line x1="45" y1="135" x2="455" y2="135" stroke="#00f0ff" strokeWidth="2" strokeDasharray="6 4" />
                                <text x="250" y="139" fill="#67e8f9" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                                    MAIN CENTRAL CORRIDOR (AXIS X)
                                </text>

                                {/* South Rooms */}
                                <rect x="40" y="165" width="90" height="85" fill="#10b981" fillOpacity="0.1" stroke="#34d399" strokeWidth="1.2" />
                                <text x="85" y="210" fill="#6ee7b7" fontSize="9" fontWeight="bold" textAnchor="middle">Stairs A</text>

                                <rect x="140" y="165" width="140" height="85" fill="#0284c7" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1.2" />
                                <text x="210" y="210" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">Advanced AI Lab</text>

                                <rect x="290" y="165" width="80" height="85" fill="#f59e0b" fillOpacity="0.1" stroke="#fbbf24" strokeWidth="1.2" />
                                <text x="330" y="210" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">Faculty Suite</text>

                                <rect x="380" y="165" width="80" height="85" fill="#ef4444" fillOpacity="0.1" stroke="#f87171" strokeWidth="1.2" />
                                <text x="420" y="210" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">Washrooms</text>

                                {/* Laser Scanner Sweep Line */}
                                {isScanning && (
                                    <line x1="30" y1="20" x2="30" y2="260" stroke="#00f0ff" strokeWidth="3" filter="drop-shadow(0 0 8px #00f0ff)">
                                        <animate attributeName="x1" from="30" to="470" dur="2s" repeatCount="indefinite" />
                                        <animate attributeName="x2" from="30" to="470" dur="2s" repeatCount="indefinite" />
                                    </line>
                                )}
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: CORRIDOR PHOTOS & VLM LOCALIZATION */}
            {selectedTab === 'photos' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="font-black text-white text-base mb-2 flex items-center gap-2">
                                <Camera size={18} className="text-cyan-400" /> Walk & Snap Photo Training
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Admins walk the hallways snapping photos of doors, signboards, and landmarks.
                                The **Vision Language Model (Gemini Vision / Florence-2)** reads room numbers via OCR and computes visual feature embeddings.
                            </p>
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 mb-4">
                                <p className="text-[11px] font-bold text-cyan-300 font-mono">RECOMMENDED PHOTO TYPES:</p>
                                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                                    <li>Door nameplates (e.g. "Room 204 — Dr. Ramesh")</li>
                                    <li>Hallway intersections & direction signs</li>
                                    <li>Elevator entrances & staircase doorways</li>
                                    <li>Emergency exits & safety equipment</li>
                                </ul>
                            </div>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                                <Upload size={14} /> Batch Upload 20 Corridor Photos
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
                            Sample VLM Landmark Recognition Feed
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { title: 'Doorway 204 Placard', tag: 'CLASSROOM', ocr: 'ROOM 204 - CS DEPT', conf: '99.4%' },
                                { title: 'Lift Core F2 Sign', tag: 'ELEVATOR', ocr: 'LIFT B2 - FLOORS 0-4', conf: '98.8%' },
                                { title: 'Robotics Lab Junction', tag: 'LABORATORY', ocr: 'AI & ROBOTICS LAB', conf: '97.6%' },
                                { title: 'Stairwell A Entrance', tag: 'STAIRCASE', ocr: 'STAIRCASE A - FIRE EXIT', conf: '99.1%' },
                            ].map((card, idx) => (
                                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                            {card.tag}
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{card.conf}</span>
                                    </div>
                                    <p className="text-xs font-bold text-white">{card.title}</p>
                                    <div className="bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-300">
                                        OCR: "{card.ocr}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: SPECIFICATIONS & BLUEPRINT TERMINOLOGY GUIDE */}
            {selectedTab === 'specs' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-black text-white font-mono mb-1">
                            CAMPUS BLUEPRINT: DEFINITION & ENGINEERING SPECIFICATIONS
                        </h3>
                        <p className="text-xs text-slate-400">
                            Understanding construction schematics, architectural CAD formats, and automated graph generation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                            <h4 className="text-xs font-bold text-cyan-400 font-mono">1. What is a Campus Blueprint?</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                A **Campus Blueprint** is the 2D scaled architectural layout created during the construction of an academic facility.
                                It specifies wall thicknesses, doors, structural pillars, room numbering, stairways, and corridors.
                            </p>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                            <h4 className="text-xs font-bold text-blue-400 font-mono">2. Supported Formats</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                • **CAD Vector:** DWG / DXF / SVG<br />
                                • **Architectural PDF:** Multi-page floor plan books<br />
                                • **High-Res Raster:** PNG / JPG scanned construction sheets (&gt;300 DPI)
                            </p>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                            <h4 className="text-xs font-bold text-emerald-400 font-mono">3. How AI Converts It to Routes</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Our computer vision pipeline performs **Corridor Skeletonization** (finding walkable centerlines),
                                places **Graph Nodes** at doors & junctions, and links them with Euclidean distance **A* Edges**.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
