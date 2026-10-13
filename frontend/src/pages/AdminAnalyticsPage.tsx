import React, { useState, useEffect } from 'react';
import { getAnalytics, getEvents, addEvent } from '../services/api';
import { BarChart3, TrendingUp, Users, Calendar, MapPin, Plus, CheckCircle, Clock } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        id: '',
        title: '',
        venue: 'Room 101',
        node_id: 'room_101',
        time: '11:00 AM',
        type: 'exam',
        date: 'Today'
    });

    useEffect(() => {
        getAnalytics().then(data => setAnalytics(data)).catch(console.warn);
        getEvents().then(data => setEvents(data || [])).catch(console.warn);
    }, []);

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.title.trim()) return;

        const eventPayload = {
            ...newEvent,
            id: 'ev_' + Date.now()
        };

        const updated = await addEvent(eventPayload);
        setEvents(updated);
        setShowEventForm(false);
        setNewEvent({
            id: '',
            title: '',
            venue: 'Room 101',
            node_id: 'room_101',
            time: '11:00 AM',
            type: 'exam',
            date: 'Today'
        });
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 bg-gray-50">
            {/* Header */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" />
                        Campus Analytics & Event Venue Operations
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Real-time visitor traffic telemetry, peak navigation hours, and campus exam hall notifications.
                    </p>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded shadow flex items-center gap-1.5 transition"
                >
                    <Plus size={14} /> Schedule Campus Event / Exam
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Total Routes Calculated</span>
                        <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{analytics?.total_routes || 142}</p>
                    <p className="text-[11px] text-green-600 font-medium mt-1">↑ +28% this week</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Top Visited Room</span>
                        <MapPin size={16} className="text-blue-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 truncate">Room 309 (Hostel)</p>
                    <p className="text-[11px] text-gray-400 mt-1">48 routing queries</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Peak Campus Movement</span>
                        <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">01:00 PM</p>
                    <p className="text-[11px] text-gray-400 mt-1">During class changeover</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="text-xs font-semibold text-gray-500">Live Scanned QRs</span>
                        <Users size={16} className="text-indigo-500" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">100%</p>
                    <p className="text-[11px] text-green-600 font-medium mt-1">All tags active</p>
                </div>
            </div>

            {/* Event Form Modal / Inline */}
            {showEventForm && (
                <form onSubmit={handleCreateEvent} className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                        Post Campus Exam or Event Venue
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Event / Exam Title</label>
                            <input
                                type="text"
                                required
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                placeholder="e.g. Physics Midterm Examination"
                                className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Venue Room</label>
                            <select
                                value={newEvent.node_id}
                                onChange={e => {
                                    const names: Record<string, string> = {
                                        'room_101': 'Room 101',
                                        'room_104': 'Room 104',
                                        'room_204': 'Room 204',
                                        'room_304': 'Room 304',
                                        'room_305': 'Room 305',
                                        'ai_lab': 'AI Lab',
                                        'room_309': 'Room 309 (Hostel)'
                                    };
                                    setNewEvent({ ...newEvent, node_id: e.target.value, venue: names[e.target.value] || e.target.value });
                                }}
                                className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="room_101">Room 101 (Floor 1)</option>
                                <option value="room_104">Room 104 (Floor 1)</option>
                                <option value="room_204">Room 204 (Floor 2)</option>
                                <option value="room_304">Room 304 (Floor 3)</option>
                                <option value="room_305">Room 305 (Floor 3)</option>
                                <option value="ai_lab">AI Lab (Floor 2)</option>
                                <option value="room_309">Room 309 (Hostel Floor 3)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Time & Schedule</label>
                            <input
                                type="text"
                                value={newEvent.time}
                                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                placeholder="e.g. 10:00 AM - 01:00 PM"
                                className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowEventForm(false)}
                            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 text-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded shadow"
                        >
                            Broadcast Event to Students
                        </button>
                    </div>
                </form>
            )}

            {/* Two Columns: Destination Leaderboard & Active Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Popular Destinations */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        Most Requested Destinations
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(analytics?.top_destinations || {}).slice(0, 5).map(([nodeId, count]: any, idx) => (
                            <div key={nodeId} className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 font-bold text-[11px] flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800">
                                        {nodeId.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${Math.min(100, (count / 50) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 w-8 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheduled Events / Exams List */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        Active Campus Events & Exam Halls
                    </h3>
                    <div className="space-y-2.5">
                        {events.map(ev => (
                            <div key={ev.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                <div>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                        ev.type === 'exam' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {ev.type}
                                    </span>
                                    <p className="text-xs font-bold text-gray-900 mt-1">{ev.title}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                        📍 {ev.venue} · ⏰ {ev.time} ({ev.date})
                                    </p>
                                </div>
                                <span className="text-[10px] text-green-700 bg-green-50 px-2 py-1 rounded font-semibold border border-green-200">
                                    Live in App
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
