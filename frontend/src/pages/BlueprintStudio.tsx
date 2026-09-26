import React, { useState } from 'react';
import { Upload, FileText, Camera, CheckCircle, Search, RefreshCw, Play } from 'lucide-react';

export const BlueprintStudio: React.FC = () => {
    const [tab, setTab] = useState<'blueprint' | 'photos' | 'guide'>('blueprint');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResults, setScanResults] = useState<{
        rooms: number; corridors: number; connectors: number; nodes: number;
    } | null>(null);

    const runScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        setScanResults(null);
        const timer = setInterval(() => {
            setScanProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    setIsScanning(false);
                    setScanResults({ rooms: 12, corridors: 3, connectors: 3, nodes: 18 });
                    return 100;
                }
                return p + 20;
            });
        }, 250);
    };

    const TabButton: React.FC<{ id: typeof tab; label: string }> = ({ id, label }) => (
        <button
            onClick={() => setTab(id)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                tab === id
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-full overflow-y-auto bg-white">
            {/* Page Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <h2 className="text-base font-bold text-gray-900">Blueprint & Vision Studio</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Upload architectural floor plans and corridor photos to configure the campus navigation graph.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 bg-white">
                <TabButton id="blueprint" label="1. Upload Blueprint" />
                <TabButton id="photos" label="2. Corridor Photos (VLM)" />
                <TabButton id="guide" label="What is a Blueprint?" />
            </div>

            <div className="p-6 space-y-5">

                {/* ── TAB 1: BLUEPRINT UPLOAD ── */}
                {tab === 'blueprint' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Left: Upload */}
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-3">
                                    <Upload size={20} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">Upload Floor Plan File</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Accepts high-resolution architectural drawings — CAD raster export, PDF floor plan, or PNG/JPEG scan.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mb-5">
                                    {['PNG / JPEG', 'Architectural PDF', 'AutoCAD Raster'].map(f => (
                                        <span key={f} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">{f}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={runScan}
                                    disabled={isScanning}
                                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded mx-auto transition-colors"
                                >
                                    {isScanning ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                                    {isScanning ? 'AI Scanning Blueprint…' : 'Load Sample & Run AI Extractor'}
                                </button>
                            </div>

                            {/* Progress */}
                            {isScanning && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between text-xs font-medium mb-2">
                                        <span className="text-blue-700">Tracing corridor lines and room boundaries…</span>
                                        <span className="text-blue-700 font-bold">{scanProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-700 transition-all duration-300"
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {scanResults && (
                                <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
                                    <p className="flex items-center gap-2 text-xs font-semibold text-green-700">
                                        <CheckCircle size={14} /> Extraction Complete — Graph Ready
                                    </p>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        <div className="bg-white border border-gray-200 rounded p-2">
                                            <p className="text-lg font-bold text-gray-900">{scanResults.rooms}</p>
                                            <p className="text-[10px] text-gray-500">Rooms</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded p-2">
                                            <p className="text-lg font-bold text-gray-900">{scanResults.corridors}</p>
                                            <p className="text-[10px] text-gray-500">Corridors</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded p-2">
                                            <p className="text-lg font-bold text-gray-900">{scanResults.connectors}</p>
                                            <p className="text-[10px] text-gray-500">Stairs/Lift</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded p-2">
                                            <p className="text-lg font-bold text-gray-900">{scanResults.nodes}</p>
                                            <p className="text-[10px] text-gray-500">Graph Nodes</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Students can now navigate to all 12 detected rooms on this floor.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: Blueprint Diagram (clean SVG, no animations) */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                                Sample Floor Plan — Floor 2, Block A
                            </p>
                            <div className="bg-gray-50 rounded border border-gray-100 p-2">
                                <svg viewBox="0 0 500 280" className="w-full">
                                    {/* Blueprint grid */}
                                    <defs>
                                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="500" height="280" fill="url(#grid)" />

                                    {/* Outer Boundary */}
                                    <rect x="30" y="20" width="440" height="240" fill="none" stroke="#374151" strokeWidth="2" />

                                    {/* North Rooms */}
                                    {[
                                        { x: 40, y: 30, w: 80, h: 70, label: 'Room 201', color: '#dbeafe' },
                                        { x: 130, y: 30, w: 80, h: 70, label: 'Room 202', color: '#dbeafe' },
                                        { x: 220, y: 30, w: 70, h: 70, label: 'Lift Core', color: '#ede9fe' },
                                        { x: 300, y: 30, w: 80, h: 70, label: 'Room 203', color: '#dbeafe' },
                                        { x: 390, y: 30, w: 70, h: 70, label: 'Room 204', color: '#dbeafe' },
                                    ].map((r, i) => (
                                        <g key={i}>
                                            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} stroke="#9ca3af" strokeWidth="1" />
                                            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} fill="#374151" fontSize="9" fontWeight="600" textAnchor="middle">{r.label}</text>
                                        </g>
                                    ))}

                                    {/* Corridor */}
                                    <rect x="30" y="110" width="440" height="40" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" strokeDasharray="4 3" />
                                    <text x="250" y="133" fill="#15803d" fontSize="8" fontWeight="600" textAnchor="middle" letterSpacing="1">MAIN CORRIDOR (WALKABLE AXIS)</text>

                                    {/* South Rooms */}
                                    {[
                                        { x: 40, y: 160, w: 90, h: 90, label: 'Staircase A', color: '#fef3c7' },
                                        { x: 140, y: 160, w: 140, h: 90, label: 'AI Lab', color: '#dbeafe' },
                                        { x: 290, y: 160, w: 80, h: 90, label: 'Faculty Suite', color: '#dbeafe' },
                                        { x: 380, y: 160, w: 80, h: 90, label: 'Washrooms', color: '#f3f4f6' },
                                    ].map((r, i) => (
                                        <g key={i}>
                                            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} stroke="#9ca3af" strokeWidth="1" />
                                            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} fill="#374151" fontSize="9" fontWeight="600" textAnchor="middle">{r.label}</text>
                                        </g>
                                    ))}

                                    {/* Navigation Route */}
                                    <path d="M 85,245 L 85,130 L 460,130 L 460,65 L 425,65" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" />
                                    <circle cx="85" cy="245" r="5" fill="#16a34a" />
                                    <circle cx="425" cy="65" r="5" fill="#dc2626" />
                                    <text x="85" y="262" fill="#166534" fontSize="8" fontWeight="600" textAnchor="middle">Start</text>
                                    <text x="425" y="53" fill="#991b1b" fontSize="8" fontWeight="600" textAnchor="middle">Room 204</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: CORRIDOR PHOTOS ── */}
                {tab === 'photos' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-5 bg-white">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Walk & Snap Photo Training</h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                    The admin walks through each corridor snapping photos of door signs, room nameplates, and landmarks.
                                    The Vision Language Model (VLM) reads the text on signs via OCR and associates each photo
                                    with a map coordinate.
                                </p>
                                <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2 mb-4">
                                    <p className="text-[11px] font-semibold text-gray-700">Recommended Photo Types:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>• Door nameplates (e.g. "Room 204 — Computer Science")</li>
                                        <li>• Hallway direction signboards</li>
                                        <li>• Lift entrance and staircase doors</li>
                                        <li>• Emergency exits and fire safety points</li>
                                    </ul>
                                </div>
                                <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors">
                                    <Upload size={13} /> Upload Corridor Photos (Batch)
                                </button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-700">VLM Recognition Results (Sample)</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { photo: 'Doorway Placard', tag: 'CLASSROOM', ocr: 'ROOM 204 — CS DEPT', conf: '99.4%' },
                                    { photo: 'Lift Core Signage', tag: 'ELEVATOR', ocr: 'LIFT B2 — FLOORS 0-4', conf: '98.8%' },
                                    { photo: 'Lab Door', tag: 'LABORATORY', ocr: 'AI & ROBOTICS LAB', conf: '97.6%' },
                                    { photo: 'Stairwell Entrance', tag: 'STAIRCASE', ocr: 'STAIRCASE A — FIRE EXIT', conf: '99.1%' },
                                ].map((row, i) => (
                                    <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-gray-900 truncate">{row.photo}</p>
                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">OCR: "{row.ocr}"</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">{row.tag}</span>
                                            <span className="text-[10px] font-semibold text-green-700">{row.conf}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 3: WHAT IS A BLUEPRINT ── */}
                {tab === 'guide' && (
                    <div className="max-w-2xl space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">What is a Campus Blueprint?</h3>
                            <p className="text-xs text-gray-700 leading-relaxed">
                                A <strong>Campus Blueprint</strong> is the 2D scaled architectural drawing created by civil engineers
                                and architects during the planning and construction of a building. It shows the exact layout of
                                every floor — including wall thickness, room placement, door positions, corridor widths, staircase
                                shafts, elevator cores, and emergency exits.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <p className="text-xs font-semibold text-gray-700">How Campus 360 Converts a Blueprint into Navigation</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { step: '1', title: 'Corridor Skeletonization', desc: 'The AI finds the centerline of every walkable corridor on the floor plan.' },
                                    { step: '2', title: 'Room & Door Detection', desc: 'Room numbers, door openings, and junctions are identified from the drawing.' },
                                    { step: '3', title: 'Graph Node Placement', desc: 'A navigation node is placed at every room entrance, corridor intersection, staircase, and lift.' },
                                    { step: '4', title: 'Edge Weight Calculation', desc: 'The distance between connected nodes is measured in metres from the blueprint scale.' },
                                    { step: '5', title: 'A* Route Engine', desc: 'Students can instantly get the shortest path between any two points using the A* algorithm.' },
                                ].map(s => (
                                    <div key={s.step} className="px-4 py-3 flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {s.step}
                                        </span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900">{s.title}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
