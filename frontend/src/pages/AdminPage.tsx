import React, { useState, useRef, useCallback } from 'react';
import {
    Building2, Upload, Plus, Trash2, Save, CheckCircle,
    FileText, Image as ImageIcon, Table, RefreshCw,
    Settings, ChevronRight, AlertCircle, Layers,
    MapPin, GitBranch, Download, Eye
} from 'lucide-react';

/* ── Types ── */
interface Room {
    id: string; name: string; type: string; floor: number; x: number; y: number;
}
interface TimetableRow {
    time: string; subject: string; room: string; node_id: string;
}

const ROOM_TYPES = ['classroom', 'lab', 'washroom', 'stairs', 'lift', 'entrance', 'fire_extinguisher', 'corridor'];
const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];

/* ── Stepper ── */
const steps = ['College Info', 'Upload Floor Plan', 'Manage Rooms', 'Upload Timetable', 'Review & Publish'];

const StepBar: React.FC<{ current: number }> = ({ current }) => (
    <div className="flex items-center">
        {steps.map((s, i) => (
            <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                        i < current  ? 'bg-green-500 border-green-500 text-white' :
                        i === current ? 'bg-blue-600 border-blue-600 text-white' :
                                        'bg-white border-slate-300 text-slate-400'
                    }`}>
                        {i < current ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <p className={`text-[9px] mt-1 font-semibold text-center max-w-[64px] ${i === current ? 'text-blue-600' : 'text-slate-400'}`}>{s}</p>
                </div>
                {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < current ? 'bg-green-400' : 'bg-slate-200'}`} />
                )}
            </React.Fragment>
        ))}
    </div>
);

/* ── Upload Zone ── */
const UploadZone: React.FC<{
    label: string; accept: string; icon: React.ReactNode;
    onFile: (f: File) => void; uploaded?: string;
}> = ({ label, accept, icon, onFile, uploaded }) => {
    const ref = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
    };

    return (
        <div
            onClick={() => ref.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragging ? 'border-blue-400 bg-blue-50' :
                uploaded  ? 'border-green-400 bg-green-50' :
                            'border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
        >
            <input ref={ref} type="file" accept={accept} className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
            <div className={`mb-2 ${uploaded ? 'text-green-500' : 'text-slate-400'}`}>
                {uploaded ? <CheckCircle size={32} /> : icon}
            </div>
            {uploaded ? (
                <div className="text-center">
                    <p className="text-sm font-bold text-green-700">{uploaded}</p>
                    <p className="text-xs text-green-500 mt-0.5">Click to replace</p>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-600">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Drag & drop or click to browse</p>
                </div>
            )}
        </div>
    );
};

/* ════════════════════════════════════════════ */
export const AdminPage: React.FC = () => {
    const [step, setStep]               = useState(0);
    const [collegeName, setCollegeName] = useState('');
    const [collegeCode, setCollegeCode] = useState('');
    const [numFloors, setNumFloors]     = useState(4);
    const [floorPlans, setFloorPlans]   = useState<Record<number, File | null>>({});
    const [floorPlanNames, setFloorPlanNames] = useState<Record<number, string>>({});
    const [processingFloor, setProcessingFloor] = useState<number | null>(null);
    const [processedFloors, setProcessedFloors] = useState<Set<number>>(new Set());
    const [activeFloorTab, setActiveFloorTab]   = useState(0);
    const [rooms, setRooms]             = useState<Room[]>([
        { id: 'entrance_main', name: 'Main Entrance', type: 'entrance',  floor: 0, x: 300, y: 280 },
        { id: 'room_101',      name: 'Room 101',      type: 'classroom', floor: 1, x: 140, y: 120 },
        { id: 'room_204',      name: 'Room 204',      type: 'classroom', floor: 2, x: 380, y: 120 },
        { id: 'room_301',      name: 'Room 301',      type: 'classroom', floor: 3, x: 140, y: 120 },
        { id: 'ai_lab',        name: 'AI Lab',        type: 'lab',       floor: 2, x: 460, y: 120 },
        { id: 'stairs_a_0',   name: 'Staircase A',   type: 'stairs',    floor: 0, x: 60,  y: 200 },
        { id: 'lift_0',        name: 'Lift',           type: 'lift',      floor: 0, x: 540, y: 200 },
    ]);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [timetableFile, setTimetableFile] = useState<File | null>(null);
    const [timetableRows, setTimetableRows] = useState<TimetableRow[]>([
        { time: '09:00', subject: 'Data Structures', room: 'Room 101', node_id: 'room_101' },
        { time: '10:00', subject: 'DBMS',            room: 'Room 204', node_id: 'room_204' },
        { time: '12:00', subject: 'Machine Learning', room: 'Room 301', node_id: 'room_301' },
    ]);
    const [published, setPublished]     = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);

    /* Simulate VLM floor plan processing */
    const processFloorPlan = (floor: number) => {
        setProcessingFloor(floor);
        setTimeout(() => {
            setProcessingFloor(null);
            setProcessedFloors(prev => new Set([...prev, floor]));
            // Simulate auto-detected rooms
            const autoRooms: Room[] = [
                { id: `room_${floor}01`, name: `Room ${floor}01`, type: 'classroom', floor, x: 140, y: 120 },
                { id: `room_${floor}02`, name: `Room ${floor}02`, type: 'classroom', floor, x: 220, y: 120 },
                { id: `room_${floor}03`, name: `Room ${floor}03`, type: 'classroom', floor, x: 300, y: 120 },
                { id: `washroom_${floor}`, name: `Washroom F${floor}`, type: 'washroom', floor, x: 460, y: 120 },
            ];
            setRooms(prev => [...prev.filter(r => r.floor !== floor), ...autoRooms]);
        }, 2000);
    };

    /* CSV parse simulation */
    const handleTimetableUpload = (file: File) => {
        setTimetableFile(file);
        // Simulate parse — in production, read real CSV
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').slice(1).filter(l => l.trim());
            const parsed = lines.map(line => {
                const [time, subject, room, node_id] = line.split(',').map(s => s.trim().replace(/"/g, ''));
                return { time, subject, room, node_id };
            }).filter(r => r.time);
            if (parsed.length > 0) setTimetableRows(parsed);
        };
        reader.readAsText(file);
    };

    const addRoom = () => {
        const newRoom: Room = {
            id: `room_new_${Date.now()}`, name: 'New Room',
            type: 'classroom', floor: activeFloorTab, x: 300, y: 200
        };
        setRooms(prev => [...prev, newRoom]);
        setEditingRoom(newRoom);
    };

    const saveRoom = (updated: Room) => {
        setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
        setEditingRoom(null);
    };

    const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

    const handlePublish = () => {
        setPublishLoading(true);
        setTimeout(() => { setPublishLoading(false); setPublished(true); }, 2000);
    };

    const downloadConfig = () => {
        const config = {
            college: { name: collegeName, code: collegeCode, floors: numFloors },
            nodes: rooms,
            timetable: timetableRows
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${collegeCode || 'campus'}_config.json`; a.click();
    };

    /* ════════════════════════════════════════════ */
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">

            {/* ── Sidebar ── */}
            <div className="w-56 bg-slate-900 flex flex-col h-full flex-shrink-0">
                <div className="px-5 py-5 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <Settings size={16} className="text-blue-400" />
                        <h1 className="text-sm font-black text-white tracking-tight">Admin Portal</h1>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Campus Nav Agent</p>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {[
                        { icon: <Building2 size={14} />, label: 'College Setup',    s: 0 },
                        { icon: <ImageIcon size={14} />, label: 'Floor Plans',       s: 1 },
                        { icon: <MapPin size={14} />,    label: 'Room Manager',      s: 2 },
                        { icon: <Table size={14} />,     label: 'Timetable',         s: 3 },
                        { icon: <Eye size={14} />,       label: 'Review & Publish',  s: 4 },
                    ].map(item => (
                        <button key={item.s} onClick={() => setStep(item.s)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                                step === item.s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                {collegeName && (
                    <div className="p-4 border-t border-slate-700">
                        <div className="bg-slate-800 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Active College</p>
                            <p className="text-xs text-white font-bold mt-0.5 truncate">{collegeName}</p>
                            <p className="text-[10px] text-slate-500">{rooms.length} rooms · {numFloors} floors</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-black text-slate-900">{steps[step]}</h2>
                            <p className="text-xs text-slate-500">Step {step + 1} of {steps.length}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={downloadConfig}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <Download size={13} /> Export Config
                            </button>
                            {step > 0 && (
                                <button onClick={() => setStep(s => s - 1)}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                                    ← Back
                                </button>
                            )}
                            {step < steps.length - 1 && (
                                <button onClick={() => setStep(s => s + 1)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Next <ChevronRight size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                    <StepBar current={step} />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* ── STEP 0: College Info ── */}
                    {step === 0 && (
                        <div className="max-w-2xl space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                                <Building2 size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-blue-900">Welcome to Campus Nav Admin</p>
                                    <p className="text-xs text-blue-700 mt-0.5">Fill in your college details. Each college gets its own isolated spatial graph and navigation system.</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">College Details</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">College Name *</label>
                                        <input value={collegeName} onChange={e => setCollegeName(e.target.value)}
                                            placeholder="e.g. IIT Bombay"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">College Code *</label>
                                        <input value={collegeCode} onChange={e => setCollegeCode(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                            placeholder="e.g. iit-bombay"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 font-mono" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Number of Floors</label>
                                    <div className="flex gap-2">
                                        {[2, 3, 4, 5, 6].map(f => (
                                            <button key={f} onClick={() => setNumFloors(f)}
                                                className={`w-12 h-10 rounded-lg text-sm font-bold border transition-colors ${numFloors === f ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Building Name</label>
                                    <input defaultValue="Block A"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Accessibility Settings</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Lift available', desc: 'Enable lift-based accessible routing' },
                                        { label: 'Wheelchair ramps', desc: 'Mark entrance ramps as accessible' },
                                        { label: 'Accessible washrooms', desc: 'Tag accessible washroom nodes' },
                                    ].map(item => (
                                        <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                                                <p className="text-xs text-slate-400">{item.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 1: Floor Plans ── */}
                    {step === 1 && (
                        <div className="max-w-3xl space-y-5">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-800">
                                    <strong>VLM Auto-Detection:</strong> Upload a photo or scan of your floor plan.
                                    Our AI will automatically detect rooms, corridors, stairs, and exits.
                                    You can review and correct results in Step 3.
                                    Accepted formats: <code className="bg-amber-100 px-1 rounded">JPG, PNG, PDF, SVG</code>
                                </p>
                            </div>

                            {/* Floor tabs */}
                            <div className="flex gap-2 flex-wrap">
                                {Array.from({ length: numFloors }, (_, i) => (
                                    <button key={i} onClick={() => setActiveFloorTab(i)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                            activeFloorTab === i ? 'bg-blue-600 text-white border-blue-600' :
                                            processedFloors.has(i) ? 'bg-green-50 text-green-700 border-green-300' :
                                            'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                        }`}>
                                        {i === 0 ? 'GF' : `F${i}`} {processedFloors.has(i) ? '✓' : ''}
                                    </button>
                                ))}
                            </div>

                            {/* Upload zone for current floor tab */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        {activeFloorTab === 0 ? 'Ground Floor' : `Floor ${activeFloorTab}`} — Blueprint Upload
                                    </h3>
                                    {floorPlanNames[activeFloorTab] && !processedFloors.has(activeFloorTab) && (
                                        <button
                                            onClick={() => processFloorPlan(activeFloorTab)}
                                            disabled={processingFloor === activeFloorTab}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg disabled:opacity-60"
                                        >
                                            {processingFloor === activeFloorTab
                                                ? <><RefreshCw size={12} className="animate-spin" /> Detecting rooms…</>
                                                : <><GitBranch size={12} /> Run VLM Auto-Detect</>}
                                        </button>
                                    )}
                                    {processedFloors.has(activeFloorTab) && (
                                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                                            <CheckCircle size={14} /> Rooms auto-detected
                                        </span>
                                    )}
                                </div>

                                <UploadZone
                                    label="Drop your floor plan here (JPG, PNG, PDF, SVG)"
                                    accept="image/*,.pdf,.svg"
                                    icon={<Upload size={32} />}
                                    uploaded={floorPlanNames[activeFloorTab]}
                                    onFile={(file) => {
                                        setFloorPlans(prev => ({ ...prev, [activeFloorTab]: file }));
                                        setFloorPlanNames(prev => ({ ...prev, [activeFloorTab]: file.name }));
                                    }}
                                />

                                {floorPlanNames[activeFloorTab] && (
                                    <div className="bg-slate-50 rounded-lg px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                                        <ImageIcon size={13} className="text-slate-400" />
                                        <span className="font-medium">{floorPlanNames[activeFloorTab]}</span>
                                        <span className="text-slate-400">uploaded — click "Run VLM Auto-Detect" to extract rooms automatically</span>
                                    </div>
                                )}

                                {processedFloors.has(activeFloorTab) && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 space-y-1">
                                        <p className="text-xs font-bold text-green-800">Auto-detected on this floor:</p>
                                        {rooms.filter(r => r.floor === activeFloorTab).map(r => (
                                            <div key={r.id} className="flex items-center gap-2 text-xs text-green-700">
                                                <CheckCircle size={11} /> {r.name} ({r.type})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* All floors status */}
                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-3">All Floors Status</h3>
                                <div className="space-y-2">
                                    {Array.from({ length: numFloors }, (_, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                            <span className="text-sm text-slate-700 font-medium">{i === 0 ? 'Ground Floor' : `Floor ${i}`}</span>
                                            <div className="flex items-center gap-3">
                                                {floorPlanNames[i]
                                                    ? <span className="text-xs text-blue-600 font-medium">📄 {floorPlanNames[i]}</span>
                                                    : <span className="text-xs text-slate-400">No file uploaded</span>}
                                                {processedFloors.has(i)
                                                    ? <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓ Detected</span>
                                                    : <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Pending</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Room Manager ── */}
                    {step === 2 && (
                        <div className="max-w-4xl space-y-5">
                            {/* Floor filter tabs */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {Array.from({ length: numFloors }, (_, i) => (
                                        <button key={i} onClick={() => setActiveFloorTab(i)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${activeFloorTab === i ? 'bg-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                            {i === 0 ? 'GF' : `F${i}`} ({rooms.filter(r => r.floor === i).length})
                                        </button>
                                    ))}
                                    <button onClick={() => setActiveFloorTab(-1)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${activeFloorTab === -1 ? 'bg-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                                        All ({rooms.length})
                                    </button>
                                </div>
                                <button onClick={addRoom}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                    <Plus size={13} /> Add Room
                                </button>
                            </div>

                            {/* Room table */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            {['ID', 'Name', 'Type', 'Floor', 'X', 'Y', 'Actions'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-slate-500 font-bold uppercase tracking-wide text-[10px]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rooms
                                            .filter(r => activeFloorTab === -1 || r.floor === activeFloorTab)
                                            .map(room => (
                                                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-2.5 font-mono text-slate-500">{room.id}</td>
                                                    <td className="px-4 py-2.5 font-semibold text-slate-800">{room.name}</td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                            room.type === 'classroom' ? 'bg-blue-100 text-blue-700' :
                                                            room.type === 'lab'       ? 'bg-purple-100 text-purple-700' :
                                                            room.type === 'stairs'    ? 'bg-yellow-100 text-yellow-700' :
                                                            room.type === 'lift'      ? 'bg-yellow-100 text-yellow-700' :
                                                            room.type === 'entrance'  ? 'bg-green-100 text-green-700' :
                                                            room.type === 'washroom'  ? 'bg-red-100 text-red-700' :
                                                                                        'bg-slate-100 text-slate-600'
                                                        }`}>{room.type}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-slate-600">{FLOOR_NAMES[room.floor] || `F${room.floor}`}</td>
                                                    <td className="px-4 py-2.5 font-mono text-slate-500">{room.x}</td>
                                                    <td className="px-4 py-2.5 font-mono text-slate-500">{room.y}</td>
                                                    <td className="px-4 py-2.5">
                                                        <div className="flex gap-1.5">
                                                            <button onClick={() => setEditingRoom({ ...room })}
                                                                className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                                                <Settings size={12} />
                                                            </button>
                                                            <button onClick={() => deleteRoom(room.id)}
                                                                className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Edit Room Modal */}
                            {editingRoom && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                                        <h3 className="text-base font-bold text-slate-900">Edit Room</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Node ID</label>
                                                <input value={editingRoom.id}
                                                    onChange={e => setEditingRoom(r => r ? { ...r, id: e.target.value } : r)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Display Name</label>
                                                <input value={editingRoom.name}
                                                    onChange={e => setEditingRoom(r => r ? { ...r, name: e.target.value } : r)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Type</label>
                                                <select value={editingRoom.type}
                                                    onChange={e => setEditingRoom(r => r ? { ...r, type: e.target.value } : r)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400">
                                                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Floor</label>
                                                <select value={editingRoom.floor}
                                                    onChange={e => setEditingRoom(r => r ? { ...r, floor: +e.target.value } : r)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400">
                                                    {Array.from({ length: numFloors }, (_, i) => (
                                                        <option key={i} value={i}>{i === 0 ? 'Ground' : `Floor ${i}`}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">X coordinate</label>
                                                <input type="number" value={editingRoom.x}
                                                    onChange={e => setEditingRoom(r => r ? { ...r, x: +e.target.value } : r)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Y coordinate</label>
                                                <input type="number" value={editingRoom.y}
                                                    onChange={e => setEditingRoom(r => r ? { ...r, y: +e.target.value } : r)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-400" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setEditingRoom(null)}
                                                className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50">Cancel</button>
                                            <button onClick={() => saveRoom(editingRoom)}
                                                className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5">
                                                <Save size={13} /> Save Room
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 3: Timetable ── */}
                    {step === 3 && (
                        <div className="max-w-3xl space-y-5">
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-800">Upload Timetable (CSV)</h3>

                                <UploadZone
                                    label="Upload timetable.csv"
                                    accept=".csv"
                                    icon={<FileText size={32} />}
                                    uploaded={timetableFile?.name}
                                    onFile={handleTimetableUpload}
                                />

                                <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="font-bold mb-1">Expected CSV format:</p>
                                    <code className="block text-[11px] font-mono">time,subject,room,node_id</code>
                                    <code className="block text-[11px] font-mono">09:00,Data Structures,Room 101,room_101</code>
                                    <code className="block text-[11px] font-mono">10:00,DBMS,Room 204,room_204</code>
                                </div>
                            </div>

                            {/* Timetable preview */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Timetable Preview</p>
                                    <button onClick={() => setTimetableRows(prev => [...prev, { time: '00:00', subject: 'New Class', room: 'Room 101', node_id: 'room_101' }])}
                                        className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700">
                                        <Plus size={12} /> Add Row
                                    </button>
                                </div>
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            {['Time', 'Subject', 'Room', 'Node ID'].map(h => (
                                                <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-bold uppercase text-[10px]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {timetableRows.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-4 py-2.5 font-mono font-bold text-slate-700">{row.time}</td>
                                                <td className="px-4 py-2.5 text-slate-800">{row.subject}</td>
                                                <td className="px-4 py-2.5 text-slate-600">{row.room}</td>
                                                <td className="px-4 py-2.5 font-mono text-slate-400">{row.node_id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Review & Publish ── */}
                    {step === 4 && (
                        <div className="max-w-2xl space-y-5">
                            {published ? (
                                <div className="bg-green-50 border border-green-300 rounded-2xl p-8 text-center">
                                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-green-900">Campus Published!</h3>
                                    <p className="text-sm text-green-700 mt-2">
                                        <strong>{collegeName || 'Your Campus'}</strong> is now live on Campus Nav Agent.
                                    </p>
                                    <div className="mt-4 bg-white border border-green-200 rounded-xl px-4 py-3 text-left">
                                        <p className="text-xs text-slate-500 font-bold mb-1 uppercase">Student Access URL</p>
                                        <code className="text-sm font-mono text-blue-600">
                                            http://localhost:5173/?college={collegeCode || 'your-college'}
                                        </code>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={downloadConfig}
                                            className="flex-1 py-2 border border-green-300 text-green-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-green-100">
                                            <Download size={13} /> Download Config JSON
                                        </button>
                                        <button onClick={() => window.location.href = '/'}
                                            className="flex-1 py-2 bg-green-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-green-700">
                                            <Eye size={13} /> View Navigation App
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                                        <h3 className="text-sm font-bold text-slate-800">Summary</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'College', value: collegeName || '(not set)' },
                                                { label: 'Code', value: collegeCode || '(not set)', mono: true },
                                                { label: 'Total Rooms', value: `${rooms.length} nodes` },
                                                { label: 'Floors', value: `${numFloors} floors` },
                                                { label: 'Timetable', value: `${timetableRows.length} classes` },
                                                { label: 'Floor Plans', value: `${Object.keys(floorPlanNames).length} uploaded` },
                                            ].map(item => (
                                                <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{item.label}</p>
                                                    <p className={`text-sm font-bold text-slate-800 mt-0.5 ${(item as any).mono ? 'font-mono' : ''}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-800 mb-3">Rooms by Floor</h3>
                                        <div className="space-y-2">
                                            {Array.from({ length: numFloors }, (_, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                                                    <span className="text-slate-700 font-medium">{i === 0 ? 'Ground Floor' : `Floor ${i}`}</span>
                                                    <span className="text-slate-500">{rooms.filter(r => r.floor === i).length} rooms</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={handlePublish} disabled={publishLoading || !collegeName}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 transition-all active:scale-95">
                                        {publishLoading
                                            ? <><RefreshCw size={20} className="animate-spin" /> Publishing…</>
                                            : <><Layers size={20} /> Publish Campus to Navigation App</>}
                                    </button>
                                    {!collegeName && (
                                        <p className="text-xs text-center text-slate-400">Set a college name in Step 1 to publish</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
