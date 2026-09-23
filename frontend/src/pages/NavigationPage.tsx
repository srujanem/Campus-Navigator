import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FloorPlanMap }          from '../components/FloorPlanMap';
import { NavigationHUD }         from '../components/NavigationHUD';
import { MapStepCard }           from '../components/MapStepCard';
import { AgentChat }             from '../components/AgentChat';
import { VoiceSearch, speak, stopSpeaking } from '../components/VoiceSearch';
import { AgentThinkingLog, buildThoughts, type AgentThought } from '../components/AgentThinkingLog';
import { DemoProactiveAlert }    from '../components/ProactiveAlert';
import { ARLiveView }            from '../components/ARLiveView';
import { getGraph, calculateRoute, askAgent } from '../services/api';
import {
    Search, MapPin, Navigation, Accessibility,
    AlertTriangle, RotateCcw, ChevronRight,
    Map as MapIcon, Compass, PlayCircle,
    Volume2, VolumeX, Globe, Camera,
    Sparkles, CheckCircle
} from 'lucide-react';

/* ── helpers ── */
const DemoBadge = () => (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> DEMO
    </span>
);

const FloorSelector = ({ current, onChange }: { current: number; onChange: (f: number) => void }) => (
    <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
        {[0, 1, 2, 3].map(f => (
            <button key={f} onClick={() => onChange(f)}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${current === f ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                {f === 0 ? 'GF' : `F${f}`}
            </button>
        ))}
    </div>
);

const LANGUAGES: Record<string, string> = {
    'en-US': '🇬🇧 English',
    'hi-IN': '🇮🇳 Hindi',
    'ta-IN': '🇮🇳 Tamil',
    'te-IN': '🇮🇳 Telugu',
};

/* ════════════════════════════════════════════ */
export const NavigationPage: React.FC = () => {
    const [graph, setGraph]               = useState<any>(null);
    const [startNode, setStartNode]       = useState('entrance_main');
    const [endNode, setEndNode]           = useState('');
    const [endName, setEndName]           = useState('');
    const [route, setRoute]               = useState<any>(null);
    const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
    const [currentFloor, setCurrentFloor] = useState(0);
    const [isAccessible, setIsAccessible] = useState(false);
    const [blockedEdges, setBlockedEdges] = useState<string[][]>([]);
    const [isNavigating, setIsNavigating] = useState(false);
    const [hudStep, setHudStep]           = useState(0);
    const [error, setError]               = useState<string | null>(null);
    const [isLoading, setIsLoading]       = useState(false);
    const [searchQuery, setSearchQuery]   = useState('');
    const [showChat, setShowChat]         = useState(false);
    const [altMsg, setAltMsg]             = useState<string | null>(null);
    const [viewMode, setViewMode]         = useState<'map' | 'hud' | 'ar'>('map');
    const [autoPlay, setAutoPlay]         = useState(false);
    const [ttsEnabled, setTtsEnabled]     = useState(true);
    const [language, setLanguage]         = useState('en-US');
    const [thoughts, setThoughts]         = useState<AgentThought[]>([]);
    const [isThinking, setIsThinking]     = useState(false);
    const [showAlert, setShowAlert]       = useState(true);
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        getGraph().then(setGraph).catch(() => setError('Backend offline. Start the FastAPI server.'));
    }, []);

    /* Multi-route derivations */
    const hasAlternatives = Boolean(route?.alternatives && route.alternatives.length > 0);

    const primaryOption = route ? {
        name: route.path.some((n: string) => n.startsWith('lift')) ? 'Path A (Via Lift)' : 'Path A (Direct)',
        distance: route.distance,
        estimated_time_seconds: route.estimated_time_seconds,
        instructions: route.instructions,
        path: route.path,
        isShortest: hasAlternatives ? route.distance <= route.alternatives[0].distance : true
    } : null;

    const altOption = hasAlternatives ? {
        name: route.alternatives[0].path.some((n: string) => n.startsWith('stairs')) ? 'Path B (Via Stairs)' : 'Path B (Alternative)',
        distance: route.alternatives[0].distance,
        estimated_time_seconds: route.alternatives[0].estimated_time_seconds,
        instructions: route.alternatives[0].instructions,
        path: route.alternatives[0].path,
        isShortest: route.alternatives[0].distance < route.distance
    } : null;

    const activeRouteData = selectedRouteIdx === 1 && altOption ? altOption : primaryOption;
    const backgroundRouteData = selectedRouteIdx === 1 ? primaryOption : altOption;

    const distDiff = primaryOption && altOption ? Math.abs(primaryOption.distance - altOption.distance) : 0;
    const timeDiff = primaryOption && altOption ? Math.abs(primaryOption.estimated_time_seconds - altOption.estimated_time_seconds) : 0;

    /* Auto-advance steps */
    useEffect(() => {
        if (!autoPlay || !isNavigating || !activeRouteData) return;
        if (hudStep >= activeRouteData.instructions.length - 1) { setAutoPlay(false); return; }
        const t = setTimeout(() => advanceStep(), 2200);
        return () => clearTimeout(t);
    }, [autoPlay, hudStep, isNavigating, activeRouteData]);

    /* TTS: read aloud each new step */
    useEffect(() => {
        if (ttsEnabled && isNavigating && activeRouteData) {
            const inst = activeRouteData.instructions[Math.min(hudStep, activeRouteData.instructions.length - 1)];
            if (inst) speak(inst, language);
        }
    }, [hudStep, isNavigating, activeRouteData]);

    /* ── ROUTE ── */
    const handleRoute = useCallback(async (destId: string, destName?: string, voiceQuery?: string) => {
        if (!startNode || !destId) return;
        setIsLoading(true); setError(null); setAltMsg(null);
        setRoute(null); setSelectedRouteIdx(0); setIsNavigating(false); setHudStep(0); setAutoPlay(false);
        setEndNode(destId);
        const name = destName || graph?.nodes?.find((n: any) => n.id === destId)?.name || destId;
        setEndName(name);

        // Agent thinking log
        setIsThinking(true);
        setThoughts(buildThoughts(voiceQuery || destName || destId, destId, null));

        try {
            const res = await calculateRoute(startNode, destId, isAccessible, blockedEdges);
            setRoute(res);
            setSelectedRouteIdx(0);
            setThoughts(buildThoughts(voiceQuery || destName || destId, destId, res));
            const sNode = graph?.nodes?.find((n: any) => n.id === startNode);
            if (sNode) setCurrentFloor(sNode.floor);

            const altCount = res.alternatives?.length || 0;
            const extraMsg = altCount > 0 ? ` 2 paths calculated, recommended shortest route selected.` : '';
            if (ttsEnabled) speak(`Route found. ${res.instructions.length} steps, ${res.distance} metres.${extraMsg}`, language);
        } catch {
            try {
                const alt = await calculateRoute(startNode, destId, true, blockedEdges);
                setRoute(alt);
                setSelectedRouteIdx(0);
                setAltMsg('Standard route unavailable. Showing accessible route via lift.');
                setThoughts(buildThoughts(voiceQuery || name, destId, alt));
                const sNode = graph?.nodes?.find((n: any) => n.id === startNode);
                if (sNode) setCurrentFloor(sNode.floor);
            } catch {
                const err = 'No walkable route found.';
                setError(err);
                setThoughts(buildThoughts(voiceQuery || name, destId, null, err));
            }
        } finally {
            setIsLoading(false);
            setIsThinking(false);
        }
    }, [startNode, graph, isAccessible, blockedEdges, ttsEnabled, language]);

    /* ── VOICE + SEARCH ── */
    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        resolveTextQuery(searchQuery);
        setSearchQuery('');
    };

    const resolveTextQuery = async (query: string) => {
        setError(null);
        setIsThinking(true);
        setThoughts(buildThoughts(query, null, null));

        // Try room number first
        const numMatch = query.match(/\b(\d{3})\b/);
        if (numMatch) {
            const id = `room_${numMatch[1]}`;
            if (graph?.nodes?.find((n: any) => n.id === id)) {
                await handleRoute(id, `Room ${numMatch[1]}`, query);
                return;
            }
        }

        // Try node name match
        const q = query.toLowerCase();
        const match = graph?.nodes?.find((n: any) =>
            n.name.toLowerCase().includes(q) ||
            n.id.includes(q.replace(/\s+/g, '_'))
        );
        if (match) { await handleRoute(match.id, match.name, query); return; }

        // Ask backend agent
        try {
            const res = await askAgent(query, startNode);
            if (res.destination_id) {
                await handleRoute(res.destination_id, res.destination_id, query);
            } else {
                setError(res.message || `"${query}" not found.`);
                setThoughts(buildThoughts(query, null, null, res.message));
            }
        } catch {
            setError(`"${query}" not found. Try: Room 204, AI Lab, Room 301…`);
        } finally {
            setIsThinking(false);
        }
    };

    /* ── STEP CONTROL ── */
    const advanceStep = useCallback(() => {
        if (!activeRouteData) return;
        const next = hudStep + 1;
        if (next >= activeRouteData.instructions.length) return;
        setHudStep(next);
        const nodeId = activeRouteData.path[Math.min(next, activeRouteData.path.length - 1)];
        const node = graph?.nodes?.find((n: any) => n.id === nodeId);
        if (node) setCurrentFloor(node.floor);
    }, [hudStep, activeRouteData, graph]);

    const rewindStep = useCallback(() => {
        if (hudStep <= 0) return;
        const prev = hudStep - 1;
        setHudStep(prev);
        const nodeId = activeRouteData?.path[Math.min(prev, activeRouteData.path.length - 1)];
        const node = graph?.nodes?.find((n: any) => n.id === nodeId);
        if (node) setCurrentFloor(node.floor);
    }, [hudStep, activeRouteData, graph]);

    /* ── BLOCK DEMO ── */
    const blockStairA = async () => {
        const nb = [...blockedEdges, ['stairs_a_0', 'stairs_a_1']];
        setBlockedEdges(nb);
        setAltMsg('Staircase A blocked! Recalculating…');
        if (ttsEnabled) speak('Staircase A is blocked. Recalculating your route.', language);
        if (endNode) {
            setTimeout(async () => {
                try {
                    const res = await calculateRoute(startNode, endNode, isAccessible, nb);
                    setRoute(res); setHudStep(0); setSelectedRouteIdx(0);
                    setAltMsg('Staircase A blocked. Alternative via Staircase B used.');
                    setThoughts(prev => [...prev, {
                        step: 'REROUTE',
                        detail: 'Staircase A blocked — recalculated via Staircase B',
                        status: 'done',
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                } catch { setError('Could not find alternative route.'); }
            }, 600);
        }
    };

    /* derived */
    const currentPathNodeId = isNavigating && activeRouteData
        ? activeRouteData.path[Math.min(hudStep, activeRouteData.path.length - 1)]
        : undefined;
    const isComplete = isNavigating && activeRouteData && hudStep >= activeRouteData.instructions.length - 1;
    const distRemaining = activeRouteData
        ? Math.round(activeRouteData.distance * (1 - hudStep / Math.max(activeRouteData.instructions.length - 1, 1)))
        : 0;

    if (!graph) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm">{error || 'Loading campus map…'}</p>
            </div>
        </div>
    );

    const nonCorridor = graph.nodes.filter((n: any) => n.type !== 'corridor');

    /* ════════════════════════════════════════════ */
    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden">

            {/* ══ LEFT PANEL ══ */}
            <div className="w-[370px] flex-shrink-0 flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">

                {/* Header */}
                <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-0.5">
                        <div>
                            <h1 className="text-base font-black text-slate-900 tracking-tight">CAMPUS NAV AGENT</h1>
                            <p className="text-[10px] text-slate-400">Block A · 4 Floors · Agentic AI Navigation</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <DemoBadge />
                        </div>
                    </div>
                </div>

                {/* View + Lang + TTS toolbar */}
                <div className="px-4 pt-3 flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-1">
                        <button onClick={() => setViewMode('map')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <MapIcon size={11} /> Map
                        </button>
                        <button onClick={() => setViewMode('hud')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold transition-colors ${viewMode === 'hud' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <Compass size={11} /> HUD
                        </button>
                        <button onClick={() => setViewMode('ar')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold transition-colors ${viewMode === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <Camera size={11} /> AR
                        </button>
                    </div>

                    {/* TTS toggle */}
                    <button onClick={() => { setTtsEnabled(t => !t); stopSpeaking(); }}
                        title={ttsEnabled ? 'Mute voice' : 'Enable voice'}
                        className={`p-2 rounded-lg border text-sm transition-colors ${ttsEnabled ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>

                    {/* Language selector */}
                    <div className="relative">
                        <button onClick={() => setShowLangMenu(l => !l)}
                            className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 text-sm">
                            <Globe size={15} />
                        </button>
                        {showLangMenu && (
                            <div className="absolute right-0 top-9 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 w-36 overflow-hidden">
                                {Object.entries(LANGUAGES).map(([code, label]) => (
                                    <button key={code} onClick={() => { setLanguage(code); setShowLangMenu(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors ${language === code ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Proactive alert */}
                {showAlert && (
                    <div className="mt-3">
                        <DemoProactiveAlert onNavigate={(id, name) => {
                            handleRoute(id, name);
                            setShowAlert(false);
                        }} />
                    </div>
                )}

                {/* Location + Search */}
                <div className="px-4 pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 ring-2 ring-green-200" />
                        <select value={startNode}
                            onChange={e => { setStartNode(e.target.value); setRoute(null); setIsNavigating(false); setAutoPlay(false); setThoughts([]); }}
                            className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:border-blue-400 bg-white text-slate-700">
                            {nonCorridor.map((n: any) => (
                                <option key={n.id} value={n.id}>{n.name} (F{n.floor})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 ring-2 ring-red-200" />
                        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-1.5">
                            <input type="text" value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setError(null); }}
                                placeholder="Room 204, AI Lab, 301…"
                                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:border-blue-400 bg-white text-slate-700" />
                            <VoiceSearch
                                language={language}
                                onResult={(transcript) => {
                                    setSearchQuery(transcript);
                                    setTimeout(() => resolveTextQuery(transcript), 300);
                                }}
                            />
                            <button type="submit" disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg disabled:opacity-50 transition-colors">
                                <Search size={14} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Banners */}
                {error && (
                    <div className="mx-4 mt-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2 flex items-start gap-2">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" /> {error}
                    </div>
                )}
                {altMsg && (
                    <div className="mx-4 mt-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2 flex items-start gap-2">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" /> {altMsg}
                    </div>
                )}

                {/* Actions */}
                <div className="px-4 mt-3 space-y-2">
                    {activeRouteData && !isNavigating && (
                        <button onClick={() => {
                            setIsNavigating(true); setHudStep(0); setAutoPlay(false);
                            if (ttsEnabled && activeRouteData) speak('Navigation started on ' + activeRouteData.name + '. ' + activeRouteData.instructions[0], language);
                        }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-sm">
                            <Navigation size={16} /> Start Navigation ({activeRouteData.distance}m)
                        </button>
                    )}
                    {isNavigating && (
                        <div className="flex gap-2">
                            <button onClick={() => setAutoPlay(p => !p)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${autoPlay ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                                <PlayCircle size={13} /> {autoPlay ? 'Auto ON' : 'Auto Walk'}
                            </button>
                            <button onClick={() => { setIsNavigating(false); setHudStep(0); setAutoPlay(false); stopSpeaking(); }}
                                className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5">
                                <RotateCcw size={12} /> End
                            </button>
                        </div>
                    )}

                    <div className="flex gap-1.5">
                        <button onClick={() => { setIsAccessible(a => !a); if (endNode) handleRoute(endNode, endName); }}
                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border transition-colors ${isAccessible ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <Accessibility size={12} /> {isAccessible ? 'Lift Only ✓' : 'Accessible'}
                        </button>
                        <button onClick={blockStairA}
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                            <AlertTriangle size={12} /> Block Stair A
                        </button>
                        <button onClick={() => setShowChat(s => !s)}
                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border transition-colors ${showChat ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                            <MapPin size={12} /> AI Chat
                        </button>
                    </div>
                </div>

                {/* ── 2 PATHS COMPARISON & RECOMMENDATION WIDGET ── */}
                {route && !isNavigating && (
                    <div className="mx-4 mt-2">
                        {hasAlternatives ? (
                            <div className="bg-white border border-blue-200 rounded-2xl p-3 shadow-md space-y-2.5">
                                {/* Header with status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider">2 Paths Discovered</p>
                                    </div>
                                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                        Shortest Pre-Selected
                                    </span>
                                </div>

                                {/* AI Recommendation Banner */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Sparkles size={11} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-emerald-900 leading-tight">
                                            AI Recommendation: {primaryOption?.isShortest ? primaryOption.name : altOption?.name}
                                        </p>
                                        <p className="text-[10px] text-emerald-700 mt-0.5 leading-snug">
                                            Saves <strong className="font-extrabold text-emerald-900">{distDiff} metres</strong> and <strong className="font-extrabold text-emerald-900">~{timeDiff} seconds</strong>.
                                        </p>
                                    </div>
                                </div>

                                {/* 2 Selectable Route Cards */}
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Path A */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRouteIdx(0)}
                                        className={`text-left p-2.5 rounded-xl border-2 transition-all relative ${
                                            selectedRouteIdx === 0
                                                ? 'border-blue-600 bg-blue-50/90 shadow-sm ring-1 ring-blue-600'
                                                : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-black text-slate-800 truncate">{primaryOption?.name}</span>
                                            {selectedRouteIdx === 0 ? (
                                                <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
                                            ) : (
                                                <span className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm font-black text-blue-700">{primaryOption?.distance} m</p>
                                        <p className="text-[10px] text-slate-500 font-medium">~{primaryOption?.estimated_time_seconds}s · {primaryOption?.instructions.length} steps</p>
                                        {primaryOption?.isShortest ? (
                                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                                                ★ SHORTEST
                                            </span>
                                        ) : (
                                            <span className="inline-block mt-1 text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                                                +{distDiff}m ALT
                                            </span>
                                        )}
                                    </button>

                                    {/* Path B */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRouteIdx(1)}
                                        className={`text-left p-2.5 rounded-xl border-2 transition-all relative ${
                                            selectedRouteIdx === 1
                                                ? 'border-amber-600 bg-amber-50/90 shadow-sm ring-1 ring-amber-600'
                                                : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-black text-slate-800 truncate">{altOption?.name}</span>
                                            {selectedRouteIdx === 1 ? (
                                                <CheckCircle size={14} className="text-amber-600 flex-shrink-0" />
                                            ) : (
                                                <span className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm font-black text-amber-700">{altOption?.distance} m</p>
                                        <p className="text-[10px] text-slate-500 font-medium">~{altOption?.estimated_time_seconds}s · {altOption?.instructions.length} steps</p>
                                        {altOption?.isShortest ? (
                                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                                                ★ SHORTEST
                                            </span>
                                        ) : (
                                            <span className="inline-block mt-1 text-[9px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                                                +{distDiff}m ALT
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <p className="text-[9px] text-center text-slate-400 font-medium">Tap either card to switch path on map</p>
                            </div>
                        ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide">Route Ready</p>
                                    <p className="text-xs text-blue-900 font-bold">{route.distance}m · ~{route.estimated_time_seconds}s · {route.instructions.length} steps</p>
                                </div>
                                <ChevronRight className="text-blue-300" size={16} />
                            </div>
                        )}
                    </div>
                )}

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-3">

                    {/* ── Agent Thinking Log ── */}
                    <AgentThinkingLog thoughts={thoughts} isThinking={isThinking} />

                    {/* AI CHAT */}
                    {showChat && (
                        <div className="h-[240px]">
                            <AgentChat currentLocation={startNode} onDestinationFound={(id) => {
                                const name = graph?.nodes?.find((n: any) => n.id === id)?.name;
                                handleRoute(id, name); setShowChat(false);
                            }} />
                        </div>
                    )}

                    {/* HUD panel (hud mode only) */}
                    {viewMode === 'hud' && isNavigating && activeRouteData && (
                        <NavigationHUD
                            instructions={activeRouteData.instructions}
                            currentStep={hudStep}
                            totalSteps={activeRouteData.instructions.length}
                            distance={activeRouteData.distance}
                            estimatedTime={activeRouteData.estimated_time_seconds}
                            path={activeRouteData.path}
                            graphData={graph}
                            currentFloor={currentFloor}
                            onConfirmStep={advanceStep}
                            isComplete={!!isComplete}
                            startNode={startNode}
                            endNode={endNode}
                        />
                    )}

                    {/* Turn preview (not navigating) */}
                    {activeRouteData && !isNavigating && (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                                        Turn Preview — {activeRouteData.name}
                                    </p>
                                </div>
                                <span className="text-[10px] text-slate-400">{activeRouteData.instructions.length} steps</span>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                                {activeRouteData.instructions.map((inst: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2 px-3 py-2">
                                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <p className="text-xs text-slate-700 leading-snug">{inst}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* ── MAP VIEW ── */}
                {viewMode === 'map' && (
                    <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
                        <div className="flex items-center justify-between flex-shrink-0">
                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    {['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'][currentFloor]} — Block A
                                </h2>
                                {endName && (
                                    <p className="text-xs text-slate-500">
                                        {graph?.nodes?.find((n: any) => n.id === startNode)?.name} → {endName}
                                        {hasAlternatives && (
                                            <span className="ml-2 font-semibold text-blue-600">({activeRouteData?.name})</span>
                                        )}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {isLoading && (
                                    <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        Calculating…
                                    </div>
                                )}
                                <FloorSelector current={currentFloor} onChange={setCurrentFloor} />
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 relative">
                            <FloorPlanMap
                                graphData={graph}
                                currentFloor={currentFloor}
                                path={activeRouteData ? activeRouteData.path : []}
                                alternativePath={backgroundRouteData ? backgroundRouteData.path : undefined}
                                currentNodeId={currentPathNodeId}
                                startNode={startNode}
                                endNode={endNode}
                                animatedStep={isNavigating ? hudStep : undefined}
                                onSelectAlternative={() => {
                                    if (hasAlternatives && !isNavigating) {
                                        setSelectedRouteIdx(idx => (idx === 0 ? 1 : 0));
                                    }
                                }}
                            />

                            {/* Google-Maps step card */}
                            {isNavigating && activeRouteData && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
                                    <MapStepCard
                                        instruction={activeRouteData.instructions[Math.min(hudStep, activeRouteData.instructions.length - 1)]}
                                        stepNum={hudStep}
                                        totalSteps={activeRouteData.instructions.length}
                                        nextInstruction={activeRouteData.instructions[hudStep + 1]}
                                        distanceRemaining={distRemaining}
                                        currentFloor={currentFloor}
                                        isComplete={!!isComplete}
                                        onNext={advanceStep}
                                        onPrev={rewindStep}
                                    />
                                </div>
                            )}

                            {/* Minimap */}
                            {isNavigating && activeRouteData && (
                                <div className="absolute top-3 right-3 w-44 h-28 rounded-xl overflow-hidden border-2 border-white shadow-xl bg-white">
                                    <div className="absolute top-1 left-2 z-10 text-[9px] font-bold text-slate-400 uppercase">Overview</div>
                                    <FloorPlanMap graphData={graph} currentFloor={currentFloor} path={activeRouteData.path} currentNodeId={currentPathNodeId} startNode={startNode} endNode={endNode} mini={true} />
                                </div>
                            )}

                            {/* Legend */}
                            <div className="absolute right-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 shadow-sm"
                                style={{ bottom: isNavigating ? '156px' : '16px' }}>
                                <p className="text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Legend</p>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                                    {[
                                        { c: 'bg-green-500',  l: 'Start'      },
                                        { c: 'bg-red-500',    l: 'Destination'},
                                        { c: 'bg-blue-600',   l: 'Selected (Shortest)' },
                                        { c: 'bg-amber-500',  l: 'Alternative' },
                                        { c: 'bg-blue-200',   l: 'Classroom'  },
                                        { c: 'bg-purple-200', l: 'Lab'        },
                                        { c: 'bg-yellow-200', l: 'Stairs/Lift'},
                                        { c: 'bg-sky-100',    l: 'Corridor'   },
                                    ].map(l => (
                                        <div key={l.l} className="flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-sm ${l.c} flex-shrink-0`} />
                                            <span className="text-[9px] text-slate-600">{l.l}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── HUD VIEW ── */}
                {viewMode === 'hud' && (
                    <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                        <div className="flex flex-col gap-3 w-[55%] min-w-0">
                            <div className="flex items-center justify-between flex-shrink-0">
                                <h2 className="text-sm font-bold text-slate-800">
                                    {['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'][currentFloor]}
                                </h2>
                                <FloorSelector current={currentFloor} onChange={setCurrentFloor} />
                            </div>
                            <div className="flex-1 min-h-0">
                                <FloorPlanMap
                                    graphData={graph}
                                    currentFloor={currentFloor}
                                    path={activeRouteData ? activeRouteData.path : []}
                                    alternativePath={backgroundRouteData ? backgroundRouteData.path : undefined}
                                    currentNodeId={currentPathNodeId}
                                    startNode={startNode}
                                    endNode={endNode}
                                    animatedStep={isNavigating ? hudStep : undefined}
                                    onSelectAlternative={() => {
                                        if (hasAlternatives && !isNavigating) {
                                            setSelectedRouteIdx(idx => (idx === 0 ? 1 : 0));
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {isNavigating && activeRouteData ? (
                                <NavigationHUD
                                    instructions={activeRouteData.instructions}
                                    currentStep={hudStep}
                                    totalSteps={activeRouteData.instructions.length}
                                    distance={activeRouteData.distance}
                                    estimatedTime={activeRouteData.estimated_time_seconds}
                                    path={activeRouteData.path}
                                    graphData={graph}
                                    currentFloor={currentFloor}
                                    onConfirmStep={advanceStep}
                                    isComplete={!!isComplete}
                                    startNode={startNode}
                                    endNode={endNode}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-center px-4">
                                    <div>
                                        <Compass size={40} className="text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 text-sm font-medium">Search a destination<br />then tap <strong>Start Navigation</strong></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── AR LIVE VIEW ── */}
                {viewMode === 'ar' && (
                    <div className="flex-1 p-4 overflow-hidden">
                        {isNavigating && activeRouteData ? (
                            <ARLiveView
                                instruction={activeRouteData.instructions[Math.min(hudStep, activeRouteData.instructions.length - 1)]}
                                nextInstruction={activeRouteData.instructions[hudStep + 1]}
                                stepNum={hudStep}
                                totalSteps={activeRouteData.instructions.length}
                                distanceRemaining={distRemaining}
                                currentNodeId={currentPathNodeId}
                                onNext={advanceStep}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-center px-4 bg-slate-900 rounded-xl">
                                <div>
                                    <Camera size={48} className="text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold mb-1">AR Live View</p>
                                    <p className="text-slate-500 text-sm">Calculate a route and start navigation<br />to enable the AR camera.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
