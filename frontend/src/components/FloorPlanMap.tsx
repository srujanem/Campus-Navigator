import React, { useMemo, useEffect, useRef } from 'react';

interface FloorPlanMapProps {
    graphData: any;
    currentFloor: number;
    path: string[];
    alternativePath?: string[];
    currentNodeId?: string;
    startNode?: string;
    endNode?: string;
    mini?: boolean;
    animatedStep?: number; // which path index the walking person is at
    onSelectAlternative?: () => void;
}

const NODE_COLORS: Record<string, string> = {
    classroom:        '#bfdbfe',
    lab:              '#ddd6fe',
    washroom:         '#fecaca',
    stairs:           '#fde68a',
    lift:             '#fef08a',
    entrance:         '#bbf7d0',
    fire_extinguisher:'#fca5a5',
    corridor:         '#f1f5f9',
    room:             '#e2e8f0',
};

export const FloorPlanMap: React.FC<FloorPlanMapProps> = ({
    graphData, currentFloor, path, alternativePath, currentNodeId,
    startNode, endNode, mini = false, animatedStep, onSelectAlternative
}) => {
    const vW = 640, vH = 320;

    const floorNodes = useMemo(
        () => (graphData?.nodes || []).filter((n: any) => n.floor === currentFloor),
        [graphData, currentFloor]
    );

    const floorEdges = useMemo(() => {
        const all = graphData?.edges || [];
        return all.filter((e: any) => {
            const s = graphData.nodes.find((n: any) => n.id === e.source);
            const t = graphData.nodes.find((n: any) => n.id === e.target);
            return s?.floor === currentFloor && t?.floor === currentFloor;
        });
    }, [graphData, currentFloor]);

    // Build ordered path segments that exist on this floor
    const pathSegments = useMemo(() => {
        if (!path || path.length < 2) return [];
        const segs: { x1: number; y1: number; x2: number; y2: number; idx: number }[] = [];
        for (let i = 0; i < path.length - 1; i++) {
            const s = floorNodes.find((n: any) => n.id === path[i]);
            const t = floorNodes.find((n: any) => n.id === path[i + 1]);
            if (s && t) segs.push({ x1: s.x, y1: s.y, x2: t.x, y2: t.y, idx: i });
        }
        return segs;
    }, [path, floorNodes]);

    // Build alternative path segments that exist on this floor
    const altPathSegments = useMemo(() => {
        if (!alternativePath || alternativePath.length < 2) return [];
        const segs: { x1: number; y1: number; x2: number; y2: number; idx: number }[] = [];
        for (let i = 0; i < alternativePath.length - 1; i++) {
            const s = floorNodes.find((n: any) => n.id === alternativePath[i]);
            const t = floorNodes.find((n: any) => n.id === alternativePath[i + 1]);
            if (s && t) segs.push({ x1: s.x, y1: s.y, x2: t.x, y2: t.y, idx: i });
        }
        return segs;
    }, [alternativePath, floorNodes]);

    // Walking person position interpolation
    const personPos = useMemo(() => {
        if (animatedStep === undefined || !path[animatedStep]) return null;
        const node = floorNodes.find((n: any) => n.id === path[animatedStep]);
        return node ? { x: node.x, y: node.y } : null;
    }, [animatedStep, path, floorNodes]);

    if (!graphData) return (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
            Loading map…
        </div>
    );

    const inPath = (id: string) => path.includes(id);
    const isEdgeOnPath = (e: any) => path.includes(e.source) && path.includes(e.target);
    const ROOM_W = mini ? 32 : 54;
    const ROOM_H = mini ? 18 : 36;

    return (
        <div className={`w-full h-full rounded-xl overflow-hidden ${mini ? '' : 'bg-slate-50 border border-slate-200 shadow-inner'}`}>
            <svg viewBox={`0 0 ${vW} ${vH}`} className="w-full h-full" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {/* Background */}
                <rect width={vW} height={vH} fill={mini ? '#f8fafc' : '#f1f5f9'} />

                {/* Building floor slab */}
                <rect x="24" y="16" width="592" height="288" rx="8"
                    fill="#e8edf2" stroke="#cbd5e1" strokeWidth={mini ? 1 : 2} />

                {/* North rooms background */}
                <rect x="30" y="22" width="580" height="133" rx="5" fill="#edf2f7" stroke="none" />
                {/* South rooms background */}
                <rect x="30" y="163" width="580" height="133" rx="5" fill="#edf2f7" stroke="none" />

                {/* Corridor strip */}
                <rect x="30" y="156" width="580" height="26" rx="0" fill="#dbeafe" />
                {!mini && (
                    <text x="314" y="172" textAnchor="middle" fontSize="8.5" fill="#6b8bb7"
                        fontWeight="600" letterSpacing="1">
                        MAIN CORRIDOR — {['GROUND', 'FIRST', 'SECOND', 'THIRD'][currentFloor]} FLOOR
                    </text>
                )}

                {/* ── NON-PATH EDGES (faint gray lines) ── */}
                {floorEdges.map((edge: any, i: number) => {
                    if (isEdgeOnPath(edge)) return null;
                    const s = floorNodes.find((n: any) => n.id === edge.source);
                    const t = floorNodes.find((n: any) => n.id === edge.target);
                    if (!s || !t) return null;
                    return (
                        <line key={`ne-${i}`}
                            x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                            stroke="#c8d5e0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"
                        />
                    );
                })}

                {/* ── ALTERNATIVE PATH — elegant dashed amber line ── */}
                {altPathSegments.map((seg, i) => (
                    <g key={`alt-seg-${i}`} className={onSelectAlternative ? "cursor-pointer" : undefined} onClick={onSelectAlternative}>
                        {/* Underline glow */}
                        <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                            stroke="#f59e0b" strokeWidth={mini ? 4 : 8}
                            strokeLinecap="round" opacity="0.25"
                        />
                        {/* Dashed line */}
                        <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                            stroke="#d97706" strokeWidth={mini ? 2.5 : 4}
                            strokeLinecap="round" strokeDasharray={mini ? "4,4" : "7,7"}
                        />
                        {!mini && i === Math.floor(altPathSegments.length / 2) && (
                            <g transform={`translate(${(seg.x1 + seg.x2) / 2}, ${(seg.y1 + seg.y2) / 2 - 8})`}>
                                <rect x="-30" y="-8" width="60" height="15" rx="7" fill="#78350f" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="1" />
                                <text x="0" y="2" textAnchor="middle" fontSize="7.5" fill="#fef3c7" fontWeight="bold">Alt Route</text>
                            </g>
                        )}
                    </g>
                ))}

                {/* ── ACTIVE PATH — glowing animated lines ── */}
                {pathSegments.map((seg, i) => (
                    <g key={`path-seg-${i}`}>
                        {/* Glow layer */}
                        <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                            stroke="#93c5fd" strokeWidth={mini ? 6 : 12}
                            strokeLinecap="round" opacity="0.3">
                            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
                        </line>
                        {/* Main path */}
                        <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                            stroke="#2563eb" strokeWidth={mini ? 3 : 5}
                            strokeLinecap="round"
                            strokeDasharray={mini ? undefined : '0'}
                        />
                        {/* Flowing animation dashes */}
                        {!mini && (
                            <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                                stroke="white" strokeWidth="2" strokeLinecap="round"
                                strokeDasharray="6,18" opacity="0.7">
                                <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite" />
                            </line>
                        )}
                        {/* Directional arrowhead at midpoint */}
                        {!mini && (() => {
                            const mx = (seg.x1 + seg.x2) / 2;
                            const my = (seg.y1 + seg.y2) / 2;
                            const angle = Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1) * 180 / Math.PI;
                            return (
                                <g transform={`translate(${mx},${my}) rotate(${angle})`}>
                                    <polygon points="-5,-4 5,0 -5,4" fill="white" opacity="0.9" />
                                </g>
                            );
                        })()}
                    </g>
                ))}

                {/* ── NODES (architectural shapes) ── */}
                {floorNodes.map((node: any) => {
                    const nx = node.x, ny = node.y;
                    const isStart  = node.id === startNode;
                    const isEnd    = node.id === endNode;
                    const onPath   = inPath(node.id);
                    const fill     = isStart ? '#22c55e' : isEnd ? '#ef4444' : (NODE_COLORS[node.type] || '#e2e8f0');
                    const strokeC  = isStart ? '#14532d' : isEnd ? '#7f1d1d' : onPath ? '#1d4ed8' : '#94a3b8';
                    const sw       = isStart || isEnd ? 2.5 : onPath ? 2 : 1;

                    if (node.type === 'corridor') return null;

                    // ── Stairs ──
                    if (node.type === 'stairs') {
                        const hw = mini ? 9 : 14;
                        return (
                            <g key={node.id}>
                                <rect x={nx - hw} y={ny - hw} width={hw * 2} height={hw * 2} rx="2"
                                    fill={fill} stroke={strokeC} strokeWidth={sw} />
                                {[0, 1, 2].map(s => (
                                    <line key={s}
                                        x1={nx - hw + s * ((hw * 2) / 3)} y1={ny + hw}
                                        x2={nx + hw} y2={ny - hw + s * ((hw * 2) / 3)}
                                        stroke={strokeC} strokeWidth="1" opacity="0.45" />
                                ))}
                                {!mini && (
                                    <text x={nx} y={ny + hw + 13} textAnchor="middle" fontSize="8" fill="#475569" fontWeight="600">
                                        {node.name.replace(' (F' + currentFloor + ')', '')}
                                    </text>
                                )}
                            </g>
                        );
                    }

                    // ── Lift ──
                    if (node.type === 'lift') {
                        const hw = mini ? 8 : 13;
                        return (
                            <g key={node.id}>
                                <rect x={nx - hw} y={ny - hw} width={hw * 2} height={hw * 2} rx="3"
                                    fill="#fef9c3" stroke="#ca8a04" strokeWidth={sw} />
                                {!mini && (
                                    <>
                                        <text x={nx} y={ny + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#92400e">↑↓</text>
                                        <text x={nx} y={ny + hw + 13} textAnchor="middle" fontSize="8" fill="#475569">Lift</text>
                                    </>
                                )}
                            </g>
                        );
                    }

                    // ── Fire Extinguisher ──
                    if (node.type === 'fire_extinguisher') {
                        return (
                            <g key={node.id}>
                                <circle cx={nx} cy={ny} r={mini ? 4 : 6} fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                                {!mini && <text x={nx} y={ny + 4} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">F</text>}
                            </g>
                        );
                    }

                    // ── Rooms, Labs, Entrances, Washrooms ──
                    const rw = ROOM_W, rh = ROOM_H;
                    const isNorth = ny < 156;
                    const ry = ny - rh / 2;
                    const shortName = node.name
                        .replace('Room ', '')
                        .replace('Washroom GF', 'WC')
                        .replace('Washroom F1', 'WC')
                        .replace('Washroom F2', 'WC')
                        .replace('Washroom F3', 'WC')
                        .replace(' GF', '').replace(' F1', '').replace(' F2', '').replace(' F3', '');

                    return (
                        <g key={node.id}>
                            {/* Room rectangle */}
                            <rect x={nx - rw / 2} y={ry} width={rw} height={rh} rx="4"
                                fill={fill} stroke={strokeC} strokeWidth={sw}
                                opacity={onPath || isStart || isEnd ? 1 : 0.88}
                            />
                            {/* Door indicator */}
                            {!mini && (
                                <line
                                    x1={nx - 5} y1={isNorth ? ry + rh : ry}
                                    x2={nx + 5} y2={isNorth ? ry + rh : ry}
                                    stroke="#2563eb" strokeWidth="2.5"
                                />
                            )}
                            {/* Label */}
                            {!mini && (
                                <text x={nx} y={ry + rh / 2 + 4} textAnchor="middle"
                                    fontSize={shortName.length > 5 ? '8' : '9.5'}
                                    fontWeight="700" fill="#1e293b">
                                    {shortName}
                                </text>
                            )}
                            {/* Type label */}
                            {!mini && node.type === 'lab' && (
                                <text x={nx} y={ry + rh - 4} textAnchor="middle" fontSize="7" fill="#7c3aed">LAB</text>
                            )}
                            {/* Start / Dest badge */}
                            {(isStart || isEnd) && !mini && (
                                <g>
                                    <circle cx={nx} cy={ry - 8} r="8" fill={isStart ? '#22c55e' : '#ef4444'} />
                                    <text x={nx} y={ry - 4} textAnchor="middle" fontSize="8" fill="white" fontWeight="900">
                                        {isStart ? 'A' : 'B'}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* ── WALKING PERSON ICON (animated) ── */}
                {personPos && !mini && (
                    <g transform={`translate(${personPos.x}, ${personPos.y - 20})`}>
                        {/* Shadow */}
                        <ellipse cx="0" cy="18" rx="8" ry="3" fill="black" opacity="0.15" />
                        {/* Body */}
                        <circle cx="0" cy="0" r="9" fill="#2563eb" stroke="white" strokeWidth="2" />
                        {/* Person emoji-style */}
                        <circle cx="0" cy="-3" r="3.5" fill="white" />
                        <path d="M -4 4 Q 0 8 4 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        {/* Pulse ring */}
                        <circle cx="0" cy="0" r="9" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.4">
                            <animate attributeName="r" values="9;18;9" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                    </g>
                )}

                {/* Destination pin */}
                {endNode && (() => {
                    const node = floorNodes.find((n: any) => n.id === endNode);
                    if (!node) return null;
                    return (
                        <g key="dest-pin" transform={`translate(${node.x}, ${node.y - 28})`}>
                            <ellipse cx="0" cy="22" rx="5" ry="2" fill="black" opacity="0.12" />
                            <path d="M 0 22 L 0 0" stroke="#dc2626" strokeWidth="2" />
                            <circle cx="0" cy="0" r="8" fill="#dc2626" stroke="white" strokeWidth="2" />
                            <circle cx="0" cy="0" r="3" fill="white" />
                            {!mini && (
                                <text x="10" y="4" fontSize="8" fill="#dc2626" fontWeight="700">DEST</text>
                            )}
                        </g>
                    );
                })()}

                {/* Start pin */}
                {startNode && (() => {
                    const node = floorNodes.find((n: any) => n.id === startNode);
                    if (!node || node.id === endNode) return null;
                    return (
                        <g key="start-pin" transform={`translate(${node.x}, ${node.y - 28})`}>
                            <ellipse cx="0" cy="22" rx="5" ry="2" fill="black" opacity="0.12" />
                            <path d="M 0 22 L 0 0" stroke="#16a34a" strokeWidth="2" />
                            <circle cx="0" cy="0" r="8" fill="#16a34a" stroke="white" strokeWidth="2" />
                            <text x="0" y="4" textAnchor="middle" fontSize="9" fill="white" fontWeight="900">A</text>
                        </g>
                    );
                })()}

                {/* Floor label badge */}
                {!mini && (
                    <g>
                        <rect x="24" y="16" width="82" height="20" rx="4" fill="#1e293b" opacity="0.75" />
                        <text x="65" y="30" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
                            {['GROUND', 'FLOOR 1', 'FLOOR 2', 'FLOOR 3'][currentFloor]}
                        </text>
                    </g>
                )}

                {/* Entrance arrow */}
                {currentFloor === 0 && !mini && (
                    <g>
                        <text x="314" y="312" textAnchor="middle" fontSize="9" fill="#94a3b8">▲ ENTRANCE</text>
                    </g>
                )}
            </svg>
        </div>
    );
};
