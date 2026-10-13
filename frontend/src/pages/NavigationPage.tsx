import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGraph, calculateRoute, getTimetable, getMaintenance } from '../services/api';
import { FloorPlanMap } from '../components/FloorPlanMap';
import { LiveCameraScanner } from '../components/LiveCameraScanner';
import {
    Navigation,
    MapPin,
    Map,
    Image as ImageIcon,
    Search,
    Volume2,
    VolumeX,
    Calendar,
    AlertTriangle,
    Accessibility,
    Sparkles,
    Flame,
    Droplets,
    ArrowUpCircle,
    Check
} from 'lucide-react';

const photoMap: Record<string, string> = {
    'room_309': '/photos/WhatsApp Image 2026-09-26 at 11.35.00 PM.jpeg',
    'corridor_3_e': '/photos/WhatsApp Image 2026-09-26 at 11.35.06 PM.jpeg',
    'stairs_b_3': '/photos/WhatsApp Image 2026-09-26 at 11.35.43 PM.jpeg',
};

// Custom Autocomplete Input Component
const LocationSearchInput: React.FC<{
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (val: string) => void;
    nodes: any[];
    placeholder: string;
}> = ({ label, icon, value, onChange, nodes, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = nodes.filter(n =>
        n.name.toLowerCase().includes(value.toLowerCase()) ||
        n.id.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            {label && (
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {label}
                </label>
            )}
            <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                    {icon}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && value && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filtered.length > 0 ? (
                        filtered.map(n => (
                            <li
                                key={n.id}
                                onClick={() => {
                                    onChange(n.name);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-gray-50 last:border-0"
                            >
                                <span className="font-semibold">{n.name}</span> <span className="text-xs text-gray-400 ml-1">(Floor {n.floor})</span>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                            No locations found matching "{value}"
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export const NavigationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [nodes, setNodes] = useState<any[]>([]);
    const [rawGraph, setRawGraph] = useState<any>({ nodes: [], edges: [] });
    const [activeMapFloor, setActiveMapFloor] = useState<number>(3);

    // Locations input state
    const [startText, setStartText] = useState<string>('Room 309 (Hostel)');
    const [endText, setEndText] = useState<string>('');

    // Routing configuration
    const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
    const [routeResult, setRouteResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Live Camera Scanner modal state
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Timetable & Next Class state
    const [timetable, setTimetable] = useState<any[]>([]);
    const [nextClass, setNextClass] = useState<any | null>(null);

    // Maintenance advisory state
    const [maintenanceAlert, setMaintenanceAlert] = useState<string>('');

    // Audio / Voice Navigation state
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Fetch initial campus graph, maintenance status, timetable
    useEffect(() => {
        getGraph().then(data => {
            if (data && data.nodes) {
                setRawGraph(data);
                const locs = data.nodes.filter((n: any) =>
                    ['classroom', 'hostel_room', 'entrance', 'lab', 'stairs', 'lift', 'washroom', 'fire_extinguisher'].includes(n.type)
                );
                const sorted = locs.sort((a: any, b: any) => a.name.localeCompare(b.name));
                setNodes(sorted);

                // Check if URL contains scanned QR start parameter (e.g. ?start=room_309)
                const startParam = searchParams.get('start');
                if (startParam) {
                    const matchedNode = sorted.find((n: any) => n.id === startParam);
                    if (matchedNode) {
                        setStartText(matchedNode.name);
                        if (typeof matchedNode.floor === 'number') {
                            setActiveMapFloor(matchedNode.floor);
                        }
                    }
                }
            }
        }).catch(err => {
            console.error("Failed to load graph", err);
            setError("Failed to connect to navigation engine.");
        });

        // Load timetable
        getTimetable().then(tt => {
            if (Array.isArray(tt) && tt.length > 0) {
                setTimetable(tt);
                // Choose an upcoming class (e.g. 12:00 Machine Learning in Room 305)
                setNextClass(tt[2] || tt[0]);
            }
        }).catch(err => console.warn('Timetable load error', err));

        // Load maintenance alerts
        getMaintenance().then(m => {
            if (m && m.alert) {
                setMaintenanceAlert(m.alert);
            }
        }).catch(err => console.warn('Maintenance load error', err));

        // Clean up speech synthesis on unmount
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [searchParams]);

    // Handle Route Calculation
    const executeRoute = async (startName: string, endName: string, isAccessible: boolean = accessibleOnly) => {
        if (!startName || !endName) {
            setError("Please specify both a starting location and a destination.");
            return;
        }

        setIsLoading(true);
        setError('');
        setRouteResult(null);

        // Cancel previous speech if speaking
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        const startNode = nodes.find(n => n.name.toLowerCase() === startName.toLowerCase() || n.id.toLowerCase() === startName.toLowerCase());
        const endNode = nodes.find(n => n.name.toLowerCase() === endName.toLowerCase() || n.id.toLowerCase() === endName.toLowerCase());

        if (!startNode) {
            setError(`Could not find starting location: "${startName}". Please select from suggestions.`);
            setIsLoading(false);
            return;
        }
        if (!endNode) {
            setError(`Could not find destination: "${endName}". Please select from suggestions.`);
            setIsLoading(false);
            return;
        }

        try {
            const data = await calculateRoute(startNode.id, endNode.id, isAccessible);
            if (!data || !data.instructions || !Array.isArray(data.instructions)) {
                throw new Error("Invalid route data received from server.");
            }
            setRouteResult(data);
            if (data.maintenance_alert) {
                setMaintenanceAlert(data.maintenance_alert);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to calculate route. Ensure the backend server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    // Quick Amenities Finder: Finds closest node of given type relative to start point
    const handleFindNearest = (targetType: string) => {
        const startNode = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase() || n.id.toLowerCase() === startText.toLowerCase());
        const matching = nodes.filter(n => n.type === targetType);

        if (matching.length === 0) return;

        let bestNode = matching[0];
        if (startNode) {
            // Find closest by same floor, then euclidean distance
            const sameFloor = matching.filter(n => n.floor === startNode.floor);
            if (sameFloor.length > 0) {
                bestNode = sameFloor[0];
            }
        }

        setEndText(bestNode.name);
        executeRoute(startText, bestNode.name);
    };

    // Voice Navigation / Text-To-Speech Controller
    const handleToggleSpeech = () => {
        if (!window.speechSynthesis) {
            alert('Voice navigation not supported in this browser.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        if (!routeResult || !routeResult.instructions || routeResult.instructions.length === 0) {
            return;
        }

        // Construct complete speech text
        const totalSteps = routeResult.instructions.map((s: any, i: number) => `Step ${i + 1}: ${s.instruction}`).join('. ');
        const speechText = `Starting navigation. Total distance is ${routeResult.distance} meters. ${totalSteps}. You have arrived at your destination.`;

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50 flex flex-col items-center p-4 sm:p-6 pb-12">

            {/* Live Camera Scanner Modal */}
            <LiveCameraScanner
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onDetected={(loc) => {
                    setStartText(loc);
                    if (endText) executeRoute(loc, endText);
                }}
                availableNodes={nodes}
            />

            {/* Campus Advisory / Hazard Rerouting Alert Banner */}
            {maintenanceAlert && (
                <div className="w-full max-w-3xl mb-4 bg-amber-50 border border-amber-300 rounded-lg p-3.5 flex items-start gap-3 shadow-sm">
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                            Active Campus Advisory & Dynamic Hazard Reroute
                        </p>
                        <p className="text-xs text-amber-800 mt-0.5">{maintenanceAlert}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="max-w-3xl w-full text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Campus 360 Route Navigation</h1>
                <p className="text-xs text-gray-500 mt-1">
                    Zero-hardware indoor mapping. Point your camera at any door sign or QR tag to localize instantly.
                </p>
            </div>

            {/* 1-Click "My Next Class" Timetable Card */}
            {nextClass && (
                <div className="w-full max-w-3xl bg-blue-50 border border-blue-200 rounded-lg p-3.5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.2 rounded uppercase">
                                    Upcoming Class ({nextClass.time})
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-900 mt-0.5">
                                {nextClass.subject} · <span className="text-blue-700">{nextClass.room}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEndText(nextClass.room);
                            executeRoute(startText, nextClass.room);
                        }}
                        className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                        <Navigation size={13} /> Navigate to Class
                    </button>
                </div>
            )}

            {/* Clean Input Form */}
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* From Where */}
                    <div className="relative">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                From Where?
                            </label>
                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-medium flex items-center gap-1 hover:bg-blue-100 transition shadow-xs border border-blue-200"
                            >
                                <ImageIcon size={12} /> Live Camera / QR Scan
                            </button>
                        </div>
                        <LocationSearchInput
                            label=""
                            icon={<MapPin size={16} />}
                            value={startText}
                            onChange={setStartText}
                            nodes={nodes}
                            placeholder="e.g. Room 309 (Hostel)"
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                Destination
                            </label>
                            <span className="text-[10px] text-gray-400">Classroom, Lab or Office</span>
                        </div>
                        <LocationSearchInput
                            label=""
                            icon={<Search size={16} className="text-blue-600" />}
                            value={endText}
                            onChange={setEndText}
                            nodes={nodes}
                            placeholder="e.g. Room 104 or AI Lab"
                        />
                    </div>
                </div>

                {/* Quick Amenity / "Find Nearest" Toolbar */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Find Nearest:</span>
                        <button
                            onClick={() => handleFindNearest('washroom')}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 transition"
                        >
                            <Droplets size={12} className="text-blue-500" /> Washroom
                        </button>
                        <button
                            onClick={() => handleFindNearest('lift')}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 transition"
                        >
                            <ArrowUpCircle size={12} className="text-amber-500" /> Elevator
                        </button>
                        <button
                            onClick={() => handleFindNearest('fire_extinguisher')}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 transition"
                        >
                            <Flame size={12} className="text-red-500" /> Fire Ext.
                        </button>
                        <button
                            onClick={() => handleFindNearest('lab')}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 transition"
                        >
                            <Sparkles size={12} className="text-purple-500" /> Labs
                        </button>
                    </div>

                    {/* Step-Free / Wheelchair Accessibility Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={accessibleOnly}
                            onChange={(e) => {
                                setAccessibleOnly(e.target.checked);
                                if (startText && endText) {
                                    executeRoute(startText, endText, e.target.checked);
                                }
                            }}
                            className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="flex items-center gap-1 text-gray-600">
                            <Accessibility size={13} className="text-blue-600" /> Step-Free (Elevator Only)
                        </span>
                    </label>
                </div>

                {/* Calculate Route Button */}
                <div className="mt-5 flex justify-end">
                    <button
                        onClick={() => executeRoute(startText, endText)}
                        disabled={isLoading || !startText || !endText}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2 text-xs"
                    >
                        {isLoading ? 'Calculating Route...' : 'Get Directions'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Area */}
            {routeResult && routeResult.instructions && (
                <div className="w-full max-w-3xl space-y-5">
                    {/* Summary Card with Audio Voice Reader */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Fastest Route</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">{routeResult.distance || 0} meters</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Est. Walk Time</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">{routeResult.estimated_time_seconds || 0} seconds</p>
                            </div>
                        </div>

                        {/* Voice Text-To-Speech Button */}
                        <button
                            onClick={handleToggleSpeech}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                                isSpeaking
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                        >
                            {isSpeaking ? (
                                <>
                                    <VolumeX size={15} className="text-amber-700 animate-pulse" /> Stop Voice Guidance
                                </>
                            ) : (
                                <>
                                    <Volume2 size={15} className="text-blue-700" /> Voice Turn-by-Turn
                                </>
                            )}
                        </button>
                    </div>

                    {/* Visual 2D Map (Blue Lines restored) */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Map size={16} className="text-gray-600" />
                                <h3 className="text-xs font-bold text-gray-900">Live 2D Top-Down Path</h3>
                            </div>
                            <div className="flex items-center gap-1">
                                {[0, 1, 2, 3].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveMapFloor(f)}
                                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                                            activeMapFloor === f
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {f === 0 ? 'Ground' : `Floor ${f}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 flex justify-center bg-gray-100">
                            <FloorPlanMap
                                graphData={rawGraph}
                                currentFloor={activeMapFloor}
                                path={routeResult.path || []}
                                startNode={routeResult.path?.[0]}
                                endNode={routeResult.path?.[routeResult.path?.length - 1]}
                            />
                        </div>
                    </div>

                    {/* Step-by-Step Directions */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                            <MapPin size={16} className="text-gray-600" />
                            <h3 className="text-xs font-bold text-gray-900">Step-by-Step Directions</h3>
                        </div>
                        <div className="p-0">
                            {routeResult.instructions.map((step: any, idx: number) => {
                                const pathArray = routeResult.path || [];
                                const stepNodeId = step.node_id || pathArray[idx] || '';
                                const photoUrl = photoMap[stepNodeId];

                                return (
                                    <div key={idx} className="flex border-b border-gray-100 last:border-0 relative">
                                        {/* Step Number Column */}
                                        <div className="w-14 flex flex-col items-center py-5 relative">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold z-10">
                                                {idx + 1}
                                            </div>
                                            {idx !== routeResult.instructions.length - 1 && (
                                                <div className="absolute top-11 bottom-0 w-0.5 bg-gray-200" />
                                            )}
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1 py-5 pr-5">
                                            <p className="text-xs text-gray-800 font-medium">
                                                {step.instruction || 'Continue along designated path'}
                                            </p>

                                            {/* Render User's Uploaded Photo if available for this location */}
                                            {photoUrl && (
                                                <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 relative max-w-md shadow-xs">
                                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                                        <ImageIcon size={10} /> Real Corridor View
                                                    </div>
                                                    <img
                                                        src={photoUrl}
                                                        alt={`View of ${stepNodeId}`}
                                                        className="w-full h-auto max-h-56 object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
