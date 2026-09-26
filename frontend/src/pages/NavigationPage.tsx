import React, { useState, useEffect } from 'react';
import { getGraph, calculateRoute } from '../services/api';
import { Navigation, MapPin, Map, Image as ImageIcon } from 'lucide-react';

// Hardcoded photo mappings linking the user's real images to the graph nodes
const photoMap: Record<string, string> = {
    'room_309': '/photos/WhatsApp Image 2026-09-26 at 11.35.00 PM.jpeg',
    'corridor_3_e': '/photos/WhatsApp Image 2026-09-26 at 11.35.06 PM.jpeg',
    'stairs_b_3': '/photos/WhatsApp Image 2026-09-26 at 11.35.43 PM.jpeg', // Using a corridor/stair-like image as fallback
};

export const NavigationPage: React.FC = () => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [startNode, setStartNode] = useState<string>('entrance_main');
    const [endNode, setEndNode] = useState<string>('room_309');
    
    const [routeResult, setRouteResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch available locations for the dropdowns
        getGraph().then(data => {
            if (data && data.nodes) {
                // Filter out just the rooms and entrances to keep the dropdown clean
                const locs = data.nodes.filter((n: any) => 
                    n.type === 'classroom' || 
                    n.type === 'hostel_room' || 
                    n.type === 'entrance' || 
                    n.type === 'lab'
                );
                setNodes(locs.sort((a: any, b: any) => a.name.localeCompare(b.name)));
            }
        }).catch(err => {
            console.error("Failed to load graph", err);
            setError("Failed to connect to navigation engine.");
        });
    }, []);

    const handleSearch = async () => {
        if (!startNode || !endNode) return;
        setIsLoading(true);
        setError('');
        setRouteResult(null);

        try {
            const data = await calculateRoute(startNode, endNode);
            setRouteResult(data);
        } catch (err) {
            setError("Failed to calculate route.");
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
                    Select your start location and destination. The system will map the route and show your uploaded photos.
                </p>
            </div>

            {/* Clean Input Form */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                            From Where?
                        </label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                            <select
                                value={startNode}
                                onChange={(e) => setStartNode(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Starting Point</option>
                                {nodes.map(n => (
                                    <option key={n.id} value={n.id}>{n.name} (Floor {n.floor})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* To */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Destination
                        </label>
                        <div className="relative">
                            <Navigation size={16} className="absolute left-3 top-3 text-blue-600" />
                            <select
                                value={endNode}
                                onChange={(e) => setEndNode(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Destination</option>
                                {nodes.map(n => (
                                    <option key={n.id} value={n.id}>{n.name} (Floor {n.floor})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={isLoading || !startNode || !endNode}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded shadow-sm disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Calculating Route...' : 'Get Directions'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Area */}
            {routeResult && (
                <div className="w-full max-w-2xl space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Fastest Route Found</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{routeResult.distance} meters</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Est. Walking Time</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{routeResult.estimated_time_seconds} seconds</p>
                        </div>
                    </div>

                    {/* Step-by-Step Directions */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                            <Map size={16} className="text-gray-600" />
                            <h3 className="text-sm font-bold text-gray-900">Step-by-Step Directions</h3>
                        </div>
                        <div className="p-0">
                            {routeResult.instructions.map((step: any, idx: number) => {
                                // Check if this step mentions a node we have a photo for
                                const nodeMatch = routeResult.path.find((nId: string) => step.node_id === nId || step.instruction.includes(nId));
                                const stepNodeId = step.node_id || (routeResult.path[idx]);
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
                                            <p className="text-sm text-gray-800 font-medium">{step.instruction}</p>
                                            
                                            {/* Render User's Uploaded Photo if available for this location */}
                                            {photoUrl && (
                                                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 relative">
                                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
                                                        <ImageIcon size={10} /> Real Environment
                                                    </div>
                                                    <img 
                                                        src={photoUrl} 
                                                        alt="Location View" 
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
