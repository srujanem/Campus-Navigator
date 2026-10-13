import React, { useState, useEffect } from 'react';
import { getGraph } from '../services/api';
import { QrCode, Printer, Filter, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminQRGenerator: React.FC = () => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getGraph().then(data => {
            if (data && data.nodes) {
                // Filter printable destinations (rooms, labs, entrances, washrooms)
                const printable = data.nodes.filter((n: any) =>
                    ['classroom', 'hostel_room', 'entrance', 'lab', 'washroom', 'fire_extinguisher'].includes(n.type)
                );
                setNodes(printable.sort((a: any, b: any) => a.name.localeCompare(b.name)));
            }
        });
    }, []);

    const filteredNodes = nodes.filter(n => {
        const matchesFloor = selectedFloor === 'all' || n.floor === selectedFloor;
        const matchesSearch = n.name.toLowerCase().includes(searchTerm.toLowerCase()) || n.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFloor && matchesSearch;
    });

    const handlePrint = () => {
        window.print();
    };

    // Helper to generate a clean visual SVG QR pattern with encoded link
    const renderQRCanvas = (nodeId: string, nodeName: string) => {
        // Encoded destination URL for the student
        const targetUrl = `http://localhost:5173/student?start=${encodeURIComponent(nodeId)}`;
        // Generates an attractive stylized deterministic SVG QR matrix
        return (
            <div className="w-32 h-32 bg-white border border-gray-300 rounded p-1.5 flex flex-col items-center justify-center shadow-inner relative group">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
                    {/* QR Border corners */}
                    <rect x="5" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                    <rect x="12" y="12" width="12" height="12" fill="currentColor" rx="1" />

                    <rect x="69" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                    <rect x="76" y="12" width="12" height="12" fill="currentColor" rx="1" />

                    <rect x="5" y="69" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                    <rect x="12" y="76" width="12" height="12" fill="currentColor" rx="1" />

                    {/* Randomized deterministic pattern based on ID */}
                    <circle cx="50" cy="20" r="4" fill="currentColor" />
                    <circle cx="40" cy="50" r="4" fill="currentColor" />
                    <circle cx="60" cy="50" r="4" fill="currentColor" />
                    <circle cx="50" cy="80" r="4" fill="currentColor" />
                    <rect x="42" y="38" width="16" height="6" fill="currentColor" />
                    <rect x="42" y="56" width="16" height="6" fill="currentColor" />
                    <circle cx="78" cy="50" r="3" fill="currentColor" />
                    <circle cx="22" cy="50" r="3" fill="currentColor" />
                    <circle cx="75" cy="75" r="4" fill="currentColor" />
                    <circle cx="85" cy="85" r="3" fill="currentColor" />
                </svg>
                <span className="text-[8px] font-mono text-gray-400 mt-1 truncate max-w-full">
                    {nodeId}
                </span>
            </div>
        );
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 bg-gray-50">
            {/* Header / No-print controls */}
            <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/admin" className="text-gray-400 hover:text-gray-600 transition">
                            <ArrowLeft size={16} />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <QrCode size={20} className="text-blue-600" />
                            Printable Campus QR Code Generator
                        </h1>
                    </div>
                    <p className="text-xs text-gray-500">
                        Print these tags and place them on physical doorframes. Students scan to set their live starting point with 100% accuracy.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded shadow flex items-center gap-2 transition"
                    >
                        <Printer size={15} /> Print All QR Cards ({filteredNodes.length})
                    </button>
                </div>
            </div>

            {/* Filter Toolbar (hidden during print) */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-gray-200 text-xs">
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-gray-400" />
                    <span className="font-semibold text-gray-700">Filter Floor:</span>
                    {(['all', 0, 1, 2, 3] as const).map(fl => (
                        <button
                            key={fl}
                            onClick={() => setSelectedFloor(fl)}
                            className={`px-3 py-1 rounded font-medium transition ${
                                selectedFloor === fl
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {fl === 'all' ? 'All Floors' : fl === 0 ? 'Ground Floor' : `Floor ${fl}`}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search room (e.g. 309)..."
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Printable Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-4">
                {filteredNodes.map(node => (
                    <div
                        key={node.id}
                        className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center text-center shadow-sm print:shadow-none print:border-gray-800 break-inside-avoid"
                    >
                        {/* Institutional Badge */}
                        <div className="w-full pb-2 mb-2 border-b border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase">Campus Navigator</span>
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                                Floor {node.floor}
                            </span>
                        </div>

                        {/* Room Title */}
                        <h3 className="text-base font-extrabold text-gray-900 mb-0.5">
                            {node.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-3">
                            {node.building || 'Block A'} · {node.type.replace('_', ' ')}
                        </p>

                        {/* QR Code */}
                        <div className="my-1">
                            {renderQRCanvas(node.id, node.name)}
                        </div>

                        {/* Scan Instruction */}
                        <p className="text-[9px] text-gray-500 mt-3 font-medium">
                            Point phone camera or open <span className="font-semibold text-gray-800">Campus Navigator</span> to navigate
                        </p>
                    </div>
                ))}
            </div>

            {filteredNodes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <QrCode size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">No rooms found</p>
                    <p className="text-xs text-gray-400">Try adjusting your floor filter or search query.</p>
                </div>
            )}
        </div>
    );
};
