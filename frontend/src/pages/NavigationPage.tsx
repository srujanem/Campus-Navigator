import React, { useState, useEffect, useRef } from 'react';
import { getGraph, calculateRoute } from '../services/api';
import { Navigation, MapPin, Map, Image as ImageIcon, Search } from 'lucide-react';

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
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                {label}
            </label>
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
    const [nodes, setNodes] = useState<any[]>([]);
    
    // Using string text for the inputs
    const [startText, setStartText] = useState<string>('');
    const [endText, setEndText] = useState<string>('');
    
    const [routeResult, setRouteResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getGraph().then(data => {
            if (data && data.nodes) {
                // Get all routable locations
                const locs = data.nodes.filter((n: any) => 
                    ['classroom', 'hostel_room', 'entrance', 'lab', 'stairs', 'lift'].includes(n.type)
                );
                setNodes(locs.sort((a: any, b: any) => a.name.localeCompare(b.name)));
            }
        }).catch(err => {
            console.error("Failed to load graph", err);
            setError("Failed to connect to navigation engine.");
        });
    }, []);

    const handleSearch = async () => {
        if (!startText || !endText) {
            setError("Please enter both a starting location and a destination.");
            return;
        }

        setIsLoading(true);
        setError('');
        setRouteResult(null);

        // Find the actual node IDs from the typed text
        const startNode = nodes.find(n => n.name.toLowerCase() === startText.toLowerCase());
        const endNode = nodes.find(n => n.name.toLowerCase() === endText.toLowerCase());

        if (!startNode) {
            setError(`Could not find starting location: "${startText}". Please select from the dropdown suggestions.`);
            setIsLoading(false);
            return;
        }
        if (!endNode) {
            setError(`Could not find destination: "${endText}". Please select from the dropdown suggestions.`);
            setIsLoading(false);
            return;
        }

        try {
            const data = await calculateRoute(startNode.id, endNode.id);
            
            // Safety check to prevent white screen crashes
            if (!data || !data.instructions || !Array.isArray(data.instructions)) {
                throw new Error("Invalid route data received from server.");
            }
            
            setRouteResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to calculate route. Ensure the backend server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50 flex flex-col items-center p-6">
            
            {/* Header */}
            <div className="max-w-2xl w-full text-center mb-8 mt-4">
                <h1 className="text-2xl font-bold text-gray-900">Campus Route Finder</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Type your locations below. Select the exact room from the popup suggestions.
                </p>
            </div>

            {/* Custom Type-to-Search Form */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LocationSearchInput
                        label="From Where?"
                        icon={<MapPin size={16} />}
                        value={startText}
                        onChange={setStartText}
                        nodes={nodes}
                        placeholder="e.g. Main Gate"
                    />

                    <LocationSearchInput
                        label="Destination"
                        icon={<Search size={16} className="text-blue-600" />}
                        value={endText}
                        onChange={setEndText}
                        nodes={nodes}
                        placeholder="e.g. Room 309"
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={isLoading || !startText || !endText}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {isLoading ? 'Calculating Route...' : 'Get Directions'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-medium">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Area (Safely rendered to prevent crashes) */}
            {routeResult && routeResult.instructions && (
                <div className="w-full max-w-2xl space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Fastest Route Found</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{routeResult.distance || 0} meters</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Est. Walking Time</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{routeResult.estimated_time_seconds || 0} seconds</p>
                        </div>
                    </div>

                    {/* Step-by-Step Directions */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                            <Map size={16} className="text-gray-600" />
                            <h3 className="text-sm font-bold text-gray-900">Step-by-Step Directions</h3>
                        </div>
                        <div className="p-0">
                            {routeResult.instructions.map((step: any, idx: number) => {
                                // Extremely safe rendering logic
                                const pathArray = routeResult.path || [];
                                const stepNodeId = step.node_id || pathArray[idx] || '';
                                const photoUrl = photoMap[stepNodeId];

                                return (
                                    <div key={idx} className="flex border-b border-gray-100 last:border-0 relative">
                                        {/* Step Number Column */}
                                        <div className="w-16 flex flex-col items-center py-5 relative">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold z-10">
                                                {idx + 1}
                                            </div>
                                            {idx !== routeResult.instructions.length - 1 && (
                                                <div className="absolute top-11 bottom-0 w-0.5 bg-gray-200" />
                                            )}
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1 py-5 pr-5">
                                            <p className="text-sm text-gray-800 font-medium">{step.instruction || 'Continue along path'}</p>
                                            
                                            {/* Render User's Uploaded Photo if available for this location */}
                                            {photoUrl && (
                                                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 relative">
                                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
                                                        <ImageIcon size={10} /> Real Environment
                                                    </div>
                                                    <img 
                                                        src={photoUrl} 
                                                        alt={`View of ${stepNodeId}`} 
                                                        className="w-full h-auto max-h-64 object-cover"
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
