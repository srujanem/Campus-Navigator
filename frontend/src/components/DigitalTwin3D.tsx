import React, { useState, useEffect } from 'react';
import { Layers, Compass, Eye, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface DigitalTwinProps {
    highlightFloor?: number;
    activeRoute?: string[];
    onSelectFloor?: (floor: number) => void;
    interactive?: boolean;
}

export const DigitalTwin3D: React.FC<DigitalTwinProps> = ({
    highlightFloor = 2,
    activeRoute,
    onSelectFloor,
    interactive = true
}) => {
    const [selectedFloor, setSelectedFloor] = useState(highlightFloor);
    const [viewAngle, setViewAngle] = useState<'iso' | 'top' | 'front'>('iso');
    const [glowPulse, setGlowPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlowPulse(p => (p + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const floors = [
        { id: 3, name: 'Floor 3', sub: 'Research Labs & Dean Suite', color: '#818cf8', stroke: '#6366f1', rooms: ['Lab 301', 'Dean Office', 'AI Lab'] },
        { id: 2, name: 'Floor 2', sub: 'CS Classrooms & Robotics', color: '#38bdf8', stroke: '#0284c7', rooms: ['Room 201', 'Room 202', 'Room 204'] },
        { id: 1, name: 'Floor 1', sub: 'Lecture Theatres & Faculty', color: '#34d399', stroke: '#059669', rooms: ['Hall 101', 'Hall 102', 'Staff Room'] },
        { id: 0, name: 'Ground Floor', sub: 'Main Entrance & Lobby', color: '#f59e0b', stroke: '#d97706', rooms: ['Main Gate', 'Reception', 'Auditorium'] },
    ];

    return (
        <div className="relative w-full h-full min-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl flex flex-col items-center justify-center p-6 select-none">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Glowing Hologram Radial Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* HUD Status Bar Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-black tracking-wider text-cyan-300 font-mono">DIGITAL TWIN · 3D ISOMETRIC</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-900/70 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] text-slate-400 font-mono">
                    <span>LOD: ULTRA-HIGH</span>
                    <span className="text-slate-600">|</span>
                    <span>MESH: 4 FLOORS</span>
                </div>
            </div>

            {/* Interactive View Controls */}
            {interactive && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-1 rounded-xl">
                    {(['iso', 'top', 'front'] as const).map(angle => (
                        <button
                            key={angle}
                            onClick={() => setViewAngle(angle)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                viewAngle === angle
                                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {angle === 'iso' ? '3D Isometric' : angle === 'top' ? 'Floor Plan' : 'Elevation'}
                        </button>
                    ))}
                </div>
            )}

            {/* ── 3D ISOMETRIC SVG CANVAS ── */}
            <div className="relative w-full max-w-[620px] aspect-[4/3] flex items-center justify-center">
                <svg
                    viewBox="0 0 600 480"
                    className="w-full h-full drop-shadow-[0_20px_50px_rgba(8,145,178,0.25)] transition-all duration-700 ease-out"
                    style={{
                        transform: viewAngle === 'top'
                            ? 'rotateX(0deg) scale(0.95)'
                            : viewAngle === 'front'
                            ? 'rotateX(70deg) scale(1.1)'
                            : 'perspective(1000px) rotateX(25deg) rotateZ(-18deg) scale(1.05)'
                    }}
                >
                    <defs>
                        {/* Glow filters */}
                        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00f0ff" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>

                    {/* Vertical Lift & Stair Shafts (Translucent columns) */}
                    <g opacity="0.6">
                        {/* Lift Pillar */}
                        <line x1="420" y1="90" x2="420" y2="400" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                        <line x1="435" y1="95" x2="435" y2="405" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                        <text x="445" y="240" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">LIFT CORE</text>

                        {/* Stairs Pillar */}
                        <line x1="180" y1="130" x2="180" y2="440" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                        <text x="120" y="280" fill="#c084fc" fontSize="9" fontWeight="bold" fontFamily="monospace">STAIRS A</text>
                    </g>

                    {/* 4 Multi-Floor Slabs (Stacked in 3D Space) */}
                    {floors.map((floor, idx) => {
                        const baseY = 80 + idx * 85;
                        const isHovered = selectedFloor === floor.id;
                        const slabY = isHovered ? baseY - 12 : baseY;

                        return (
                            <g
                                key={floor.id}
                                className="cursor-pointer transition-transform duration-300"
                                onClick={() => {
                                    setSelectedFloor(floor.id);
                                    if (onSelectFloor) onSelectFloor(floor.id);
                                }}
                            >
                                {/* Floor Base Shadow */}
                                <polygon
                                    points={`300,${slabY + 50} 490,${slabY + 115} 300,${slabY + 180} 110,${slabY + 115}`}
                                    fill="black"
                                    opacity="0.35"
                                />

                                {/* Floor Extrusion Side Wall Left */}
                                <polygon
                                    points={`110,${slabY + 115} 300,${slabY + 180} 300,${slabY + 195} 110,${slabY + 130}`}
                                    fill="#090d16"
                                    stroke={isHovered ? floor.color : '#1e293b'}
                                    strokeWidth="1.5"
                                />

                                {/* Floor Extrusion Side Wall Right */}
                                <polygon
                                    points={`300,${slabY + 180} 490,${slabY + 115} 490,${slabY + 130} 300,${slabY + 195}`}
                                    fill="#0b1120"
                                    stroke={isHovered ? floor.color : '#1e293b'}
                                    strokeWidth="1.5"
                                />

                                {/* Floor Top Surface (Isometric Diamond) */}
                                <polygon
                                    points={`300,${slabY + 45} 490,${slabY + 110} 300,${slabY + 175} 110,${slabY + 110}`}
                                    fill="url(#floorGrad)"
                                    stroke={isHovered ? floor.color : '#334155'}
                                    strokeWidth={isHovered ? '2.5' : '1.5'}
                                    filter={isHovered ? 'url(#neon-glow)' : undefined}
                                />

                                {/* Floor Internal Grid Overlay */}
                                <line x1="300" y1={slabY + 45} x2="300" y2={slabY + 175} stroke={floor.color} strokeWidth="0.7" opacity="0.3" />
                                <line x1="110" y1={slabY + 110} x2="490" y2={slabY + 110} stroke={floor.color} strokeWidth="0.7" opacity="0.3" />

                                {/* Architectural Room Blocks (Extruded transparent glass boxes) */}
                                {/* West Wing Room */}
                                <polygon
                                    points={`180,${slabY + 95} 240,${slabY + 115} 200,${slabY + 130} 140,${slabY + 110}`}
                                    fill={floor.color}
                                    fillOpacity={isHovered ? '0.25' : '0.12'}
                                    stroke={floor.color}
                                    strokeWidth="1"
                                />
                                <text x="180" y={slabY + 115} fill="white" fontSize="8" fontWeight="bold" opacity="0.85">
                                    {floor.rooms[0]}
                                </text>

                                {/* Central Corridor */}
                                <line
                                    x1="220" y1={slabY + 120} x2="380" y2={slabY + 120}
                                    stroke={floor.color} strokeWidth="3" strokeDasharray="3 3" opacity="0.6"
                                />

                                {/* East Wing Room */}
                                <polygon
                                    points={`360,${slabY + 95} 440,${slabY + 115} 400,${slabY + 130} 320,${slabY + 110}`}
                                    fill={floor.color}
                                    fillOpacity={isHovered ? '0.25' : '0.12'}
                                    stroke={floor.color}
                                    strokeWidth="1"
                                />
                                <text x="360" y={slabY + 115} fill="white" fontSize="8" fontWeight="bold" opacity="0.85">
                                    {floor.rooms[2]}
                                </text>

                                {/* Floor Tag Pill */}
                                <g transform={`translate(70, ${slabY + 105})`}>
                                    <rect
                                        x="-4" y="-12" width="85" height="24" rx="12"
                                        fill={isHovered ? floor.color : '#0f172a'}
                                        stroke={floor.color} strokeWidth="1.5"
                                    />
                                    <text
                                        x="38" y="3" textAnchor="middle"
                                        fill={isHovered ? '#020617' : '#f8fafc'}
                                        fontSize="9" fontWeight="900" fontFamily="monospace"
                                    >
                                        {floor.name}
                                    </text>
                                </g>
                            </g>
                        );
                    })}

                    {/* ── ACTIVE LASER NAVIGATION ROUTE (Cross-floor route simulation) ── */}
                    <g filter="url(#neon-glow)">
                        {/* Route: Ground Floor Main Entrance -> Lift Core -> Floor 2 -> Room 204 */}
                        <path
                            d="M 230,420 L 300,390 L 420,380 L 420,230 L 350,240 L 260,250"
                            fill="none"
                            stroke="#00f0ff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="8 6"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="50"
                                to="0"
                                dur="1.2s"
                                repeatCount="indefinite"
                            />
                        </path>

                        {/* Start Pulse Marker (Ground Floor) */}
                        <circle cx="230" cy="420" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="230" cy="420" r="14" fill="#10b981" opacity="0.3">
                            <animate attributeName="r" values="8;18;8" dur="1.8s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.4;0.0;0.4" dur="1.8s" repeatCount="indefinite" />
                        </circle>

                        {/* Destination Pulse Marker (Floor 2 - Room 204) */}
                        <circle cx="260" cy="250" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="260" cy="250" r="16" fill="#ef4444" opacity="0.4">
                            <animate attributeName="r" values="10;24;10" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0.0;0.5" dur="1.5s" repeatCount="indefinite" />
                        </circle>

                        {/* Target Callout Box */}
                        <g transform="translate(260, 215)">
                            <rect x="-40" y="-18" width="80" height="20" rx="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                            <text x="0" y="-4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="monospace">
                                DEST: 204
                            </text>
                        </g>
                    </g>
                </svg>
            </div>

            {/* Bottom Floor Selector Strip */}
            <div className="w-full max-w-xl flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80 z-20">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers size={13} className="text-cyan-400" /> Switch Active Floor:
                </span>
                <div className="flex gap-1.5">
                    {floors.map(f => (
                        <button
                            key={f.id}
                            onClick={() => {
                                setSelectedFloor(f.id);
                                if (onSelectFloor) onSelectFloor(f.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                selectedFloor === f.id
                                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                        >
                            {f.name.replace('Floor ', 'F')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
