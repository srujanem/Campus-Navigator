import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface Props {
    highlightFloor?: number;
    onSelectFloor?: (floor: number) => void;
    interactive?: boolean;
}

export const DigitalTwin3D: React.FC<Props> = ({
    highlightFloor = 2,
    onSelectFloor,
    interactive = true,
}) => {
    const [selectedFloor, setSelectedFloor] = useState(highlightFloor);

    const floors = [
        { id: 3, name: 'Floor 3', sub: 'Research Labs & Dean Suite', fill: '#dbeafe', stroke: '#3b82f6', rooms: ['Lab 301', 'Dean Office', 'AI Lab'] },
        { id: 2, name: 'Floor 2', sub: 'CS Classrooms & Robotics', fill: '#e0e7ff', stroke: '#6366f1', rooms: ['Room 201', 'Room 202', 'Room 204'] },
        { id: 1, name: 'Floor 1', sub: 'Lecture Theatres & Faculty', fill: '#d1fae5', stroke: '#10b981', rooms: ['Hall 101', 'Hall 102', 'Staff Room'] },
        { id: 0, name: 'Ground Floor', sub: 'Main Entrance & Lobby', fill: '#fef3c7', stroke: '#f59e0b', rooms: ['Main Gate', 'Reception', 'Auditorium'] },
    ];

    return (
        <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <Layers size={14} className="text-blue-700" />
                    3D Building Inspector — Block A
                </div>
                <span className="text-[10px] text-gray-400 font-medium">Click a floor to select</span>
            </div>

            {/* SVG Canvas */}
            <div className="flex-1 flex items-center justify-center p-4">
                <svg
                    viewBox="0 0 580 440"
                    className="w-full h-full max-w-xl"
                >
                    {floors.map((floor, idx) => {
                        const baseY = 40 + idx * 90;
                        const isSelected = selectedFloor === floor.id;
                        const slabY = isSelected ? baseY - 8 : baseY;
                        const opacity = isSelected ? 1 : 0.7;

                        return (
                            <g
                                key={floor.id}
                                onClick={() => {
                                    setSelectedFloor(floor.id);
                                    if (onSelectFloor) onSelectFloor(floor.id);
                                }}
                                className={interactive ? 'cursor-pointer' : ''}
                                opacity={opacity}
                            >
                                {/* Side Wall Left */}
                                <polygon
                                    points={`110,${slabY + 110} 290,${slabY + 170} 290,${slabY + 185} 110,${slabY + 125}`}
                                    fill="#d1d5db"
                                    stroke={isSelected ? floor.stroke : '#9ca3af'}
                                    strokeWidth="1"
                                />
                                {/* Side Wall Right */}
                                <polygon
                                    points={`290,${slabY + 170} 470,${slabY + 110} 470,${slabY + 125} 290,${slabY + 185}`}
                                    fill="#e5e7eb"
                                    stroke={isSelected ? floor.stroke : '#9ca3af'}
                                    strokeWidth="1"
                                />
                                {/* Floor Top Surface */}
                                <polygon
                                    points={`290,${slabY + 45} 470,${slabY + 105} 290,${slabY + 165} 110,${slabY + 105}`}
                                    fill={isSelected ? floor.fill : '#f9fafb'}
                                    stroke={isSelected ? floor.stroke : '#d1d5db'}
                                    strokeWidth={isSelected ? 2 : 1.5}
                                />

                                {/* Corridor Line */}
                                <line
                                    x1="140" y1={slabY + 105}
                                    x2="440" y2={slabY + 105}
                                    stroke={isSelected ? floor.stroke : '#9ca3af'}
                                    strokeWidth="1.5"
                                    strokeDasharray="5 3"
                                />

                                {/* West Room */}
                                <rect
                                    x="135" y={slabY + 68}
                                    width="60" height="34"
                                    rx="2"
                                    fill={isSelected ? floor.stroke : '#9ca3af'}
                                    fillOpacity="0.15"
                                    stroke={isSelected ? floor.stroke : '#9ca3af'}
                                    strokeWidth="1"
                                />
                                <text x="165" y={slabY + 89} fill={isSelected ? '#1e40af' : '#6b7280'} fontSize="8" fontWeight="600" textAnchor="middle">
                                    {floor.rooms[0]}
                                </text>

                                {/* East Room */}
                                <rect
                                    x="370" y={slabY + 68}
                                    width="60" height="34"
                                    rx="2"
                                    fill={isSelected ? floor.stroke : '#9ca3af'}
                                    fillOpacity="0.15"
                                    stroke={isSelected ? floor.stroke : '#9ca3af'}
                                    strokeWidth="1"
                                />
                                <text x="400" y={slabY + 89} fill={isSelected ? '#1e40af' : '#6b7280'} fontSize="8" fontWeight="600" textAnchor="middle">
                                    {floor.rooms[2]}
                                </text>

                                {/* Floor Label on left */}
                                <text
                                    x="50"
                                    y={slabY + 110}
                                    fill={isSelected ? floor.stroke : '#9ca3af'}
                                    fontSize="9"
                                    fontWeight={isSelected ? '700' : '500'}
                                    textAnchor="middle"
                                >
                                    {floor.name}
                                </text>
                            </g>
                        );
                    })}

                    {/* Navigation Route (only shown on selected floor) */}
                    {(() => {
                        const fl = floors.find(f => f.id === selectedFloor)!;
                        const idx = floors.indexOf(fl);
                        const sY = 40 + idx * 90 - 8;
                        return (
                            <g>
                                <path
                                    d={`M 140,${sY + 140} L 290,${sY + 105} L 440,${sY + 68}`}
                                    fill="none"
                                    stroke="#1d4ed8"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeDasharray="6 4"
                                />
                                <circle cx="140" cy={sY + 140} r="5" fill="#16a34a" stroke="white" strokeWidth="1.5" />
                                <circle cx="440" cy={sY + 68} r="5" fill="#dc2626" stroke="white" strokeWidth="1.5" />
                            </g>
                        );
                    })()}

                    {/* Vertical connectors (Stairs / Lift) */}
                    <line x1="110" y1="110" x2="110" y2="400" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="470" y1="110" x2="470" y2="400" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="75" y="260" fill="#9ca3af" fontSize="8" fontWeight="500" textAnchor="middle">STAIRS</text>
                    <text x="500" y="260" fill="#9ca3af" fontSize="8" fontWeight="500" textAnchor="middle">LIFT</text>
                </svg>
            </div>

            {/* Floor Selector */}
            {interactive && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                    <span className="text-[11px] text-gray-500 font-medium">Select floor:</span>
                    <div className="flex gap-1">
                        {floors.map(f => (
                            <button
                                key={f.id}
                                onClick={() => {
                                    setSelectedFloor(f.id);
                                    if (onSelectFloor) onSelectFloor(f.id);
                                }}
                                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                                    selectedFloor === f.id
                                        ? 'bg-blue-700 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {f.id === 0 ? 'GF' : `F${f.id}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
