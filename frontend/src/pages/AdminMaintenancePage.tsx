import React, { useState, useEffect } from 'react';
import { getMaintenance, updateMaintenance, resetMaintenance, getGraph } from '../services/api';
import { AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw, AlertOctagon } from 'lucide-react';

export const AdminMaintenancePage: React.FC = () => {
    const [blockedEdges, setBlockedEdges] = useState<string[][]>([]);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [corridors, setCorridors] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        // Load existing maintenance state
        getMaintenance().then(data => {
            if (data) {
                setBlockedEdges(data.blocked_edges || []);
                setAlertMessage(data.alert || '');
            }
        });

        // Load graph corridors
        getGraph().then(data => {
            if (data && data.edges) {
                // Find corridor and stairs walkable edges
                const walkable = data.edges.filter((e: any) => e.type === 'walkable' || e.type === 'stairs');
                setCorridors(walkable);
            }
        });
    }, []);

    const isEdgeBlocked = (u: string, v: string) => {
        return blockedEdges.some(
            ([a, b]) => (a === u && b === v) || (a === v && b === u)
        );
    };

    const toggleEdge = (u: string, v: string) => {
        if (isEdgeBlocked(u, v)) {
            setBlockedEdges(prev => prev.filter(
                ([a, b]) => !((a === u && b === v) || (a === v && b === u))
            ));
        } else {
            setBlockedEdges(prev => [...prev, [u, v]]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateMaintenance(blockedEdges, alertMessage);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update maintenance', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Reopen all corridors and clear active maintenance alerts?')) return;
        try {
            await resetMaintenance();
            setBlockedEdges([]);
            setAlertMessage('');
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to reset maintenance', err);
        }
    };

    // Human friendly edge labels
    const formatEdgeLabel = (u: string, v: string, type: string) => {
        const clean = (s: string) => s.replace(/_/g, ' ').toUpperCase();
        return `${clean(u)} ↔ ${clean(v)} (${type})`;
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 bg-gray-50">
            {/* Header */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-amber-500" />
                        Corridor Maintenance & Dynamic Hazard Rerouting
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Block corridors or staircases during construction or cleaning. The routing engine will automatically recalculate routes to avoid them.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition flex items-center gap-1.5"
                    >
                        <RotateCcw size={14} /> Clear All Blockages
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <CheckCircle2 size={14} /> {isSaving ? 'Publishing...' : 'Publish Hazard Updates'}
                    </button>
                </div>
            </div>

            {saveSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-600" />
                    Hazard rerouting configuration published! All student routes are now dynamically updated.
                </div>
            )}

            {/* Alert Broadcast Message Box */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Live Campus Advisory Banner
                </label>
                <input
                    type="text"
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="e.g. Floor 3 East Corridor undergoing floor renovation. Please use West corridor."
                    className="w-full px-4 py-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                />
                <p className="text-[11px] text-gray-400">
                    This message will appear directly on students' screens when viewing their navigation path.
                </p>
            </div>

            {/* Corridor Edge Toggles */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Walkable Segments & Corridors</h3>
                        <p className="text-xs text-gray-500">Click a corridor to toggle its closure status</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {blockedEdges.length} Blocked
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {corridors.slice(0, 24).map((edge, idx) => {
                        const blocked = isEdgeBlocked(edge.source, edge.target);
                        return (
                            <div
                                key={idx}
                                onClick={() => toggleEdge(edge.source, edge.target)}
                                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                                    blocked
                                        ? 'bg-red-50 border-red-300 text-red-900 shadow-sm'
                                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    {blocked ? (
                                        <AlertOctagon size={16} className="text-red-600 flex-shrink-0" />
                                    ) : (
                                        <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                                    )}
                                    <div>
                                        <p className="text-xs font-bold leading-tight">
                                            {formatEdgeLabel(edge.source, edge.target, edge.type)}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            Length: {edge.distance || 18}m
                                        </p>
                                    </div>
                                </div>

                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    blocked ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {blocked ? 'BLOCKED' : 'OPEN'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
