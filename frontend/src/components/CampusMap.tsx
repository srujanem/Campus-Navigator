import React, { useMemo } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface CampusMapProps {
    graphData: any;
    currentFloor: number;
    path: string[];
    simulatedStep?: number;
    startNode?: string;
    endNode?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({ graphData, currentFloor, path, simulatedStep, startNode, endNode }) => {
    const floorNodes = useMemo(() => {
        if (!graphData?.nodes) return [];
        return graphData.nodes.filter((n: any) => n.floor === currentFloor);
    }, [graphData, currentFloor]);

    const floorEdges = useMemo(() => {
        if (!graphData?.edges) return [];
        return graphData.edges.filter((e: any) => {
            const sourceNode = graphData.nodes.find((n: any) => n.id === e.source);
            const targetNode = graphData.nodes.find((n: any) => n.id === e.target);
            return sourceNode?.floor === currentFloor && targetNode?.floor === currentFloor;
        });
    }, [graphData, currentFloor]);

    if (!graphData) return <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>;

    const getNodeColor = (type: string) => {
        switch(type) {
            case 'corridor': return '#cbd5e1';
            case 'classroom': return '#93c5fd';
            case 'lab': return '#c4b5fd';
            case 'washroom': return '#fca5a5';
            case 'stairs': return '#fcd34d';
            case 'lift': return '#fde047';
            case 'entrance': return '#86efac';
            case 'fire_extinguisher': return '#ef4444';
            default: return '#e2e8f0';
        }
    };

    return (
        <div className="relative w-full h-full bg-white rounded-lg shadow-inner overflow-hidden border border-gray-200">
            <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Edges */}
                {floorEdges.map((edge: any, idx: number) => {
                    const sourceNode = floorNodes.find((n: any) => n.id === edge.source);
                    const targetNode = floorNodes.find((n: any) => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    
                    // Is this edge in the path?
                    const inPath = path.includes(edge.source) && path.includes(edge.target);
                    
                    return (
                        <line 
                            key={idx}
                            x1={sourceNode.x} y1={sourceNode.y}
                            x2={targetNode.x} y2={targetNode.y}
                            stroke={inPath ? '#3b82f6' : '#e2e8f0'}
                            strokeWidth={inPath ? 6 : 4}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Nodes */}
                {floorNodes.map((node: any) => {
                    const isStart = node.id === startNode;
                    const isEnd = node.id === endNode;
                    const inPath = path.includes(node.id);
                    
                    return (
                        <g key={node.id}>
                            <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={isStart || isEnd ? 12 : (inPath ? 8 : 6)} 
                                fill={isStart ? '#22c55e' : (isEnd ? '#ef4444' : getNodeColor(node.type))}
                                stroke={inPath ? '#1e3a8a' : '#94a3b8'}
                                strokeWidth={inPath ? 2 : 1}
                            />
                            {node.type !== 'corridor' && (
                                <text x={node.x} y={node.y - 12} fontSize="10" textAnchor="middle" fill="#475569" className="font-medium">
                                    {node.name}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Simulated Agent Marker */}
                {simulatedStep !== undefined && path[simulatedStep] && (
                    <g>
                        {(() => {
                            const currentNode = floorNodes.find((n: any) => n.id === path[simulatedStep]);
                            if (currentNode) {
                                return (
                                    <circle 
                                        cx={currentNode.x} 
                                        cy={currentNode.y} 
                                        r={10} 
                                        fill="#3b82f6" 
                                        className="animate-pulse"
                                    />
                                );
                            }
                            return null;
                        })()}
                    </g>
                )}
            </svg>
            <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow text-xs font-semibold text-gray-700">
                Floor {currentFloor}
            </div>
        </div>
    );
};
