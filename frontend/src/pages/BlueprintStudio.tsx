import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Map as MapIcon } from 'lucide-react';

export const BlueprintStudio: React.FC = () => {
    const [tab, setTab] = useState<'blueprint' | 'photos' | 'guide'>('blueprint');

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
                    Upload architectural floor plans and corridor photos to generate the campus map.
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
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-4">
                                <MapIcon size={24} />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">Upload Floor Plan File</p>
                            <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                                Accepts high-resolution architectural drawings. Upload to generate the base navigation graph.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {['PNG / JPEG', 'Architectural PDF', 'AutoCAD Raster'].map(f => (
                                    <span key={f} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">{f}</span>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-6 py-2.5 rounded mx-auto transition-colors">
                                <Upload size={14} /> Browse Files
                            </button>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-center">
                            <p className="text-sm font-medium text-gray-600">No blueprint uploaded yet.</p>
                            <p className="text-xs text-gray-400 mt-1">Once uploaded, the AI will extract rooms and corridors here.</p>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: CORRIDOR PHOTOS ── */}
                {tab === 'photos' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-3">
                                <ImageIcon size={20} />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">Upload Corridor Photos</p>
                            <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                                Upload photos of door nameplates and corridors to train the vision model (VLM).
                            </p>
                            <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-5 py-2.5 rounded mx-auto transition-colors">
                                <Upload size={13} /> Select Photos
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-700">VLM Recognition Results</p>
                            </div>
                            <div className="p-8 text-center">
                                <p className="text-xs text-gray-500">Awaiting photo uploads. Results will appear here.</p>
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
