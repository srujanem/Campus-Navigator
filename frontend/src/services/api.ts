const API_BASE = 'http://localhost:8000/api';

export const getGraph = async () => {
    const res = await fetch(`${API_BASE}/graph`);
    return res.json();
};

export const calculateRoute = async (startId: string, endId: string, accessibleOnly: boolean = false, blockedEdges: string[][] = []) => {
    const res = await fetch(`${API_BASE}/navigation/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_id: startId, end_id: endId, accessible_only: accessibleOnly, blocked_edges: blockedEdges })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const calculateMidpoint = async (startAId: string, startBId: string) => {
    const res = await fetch(`${API_BASE}/navigation/midpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_a_id: startAId, start_b_id: startBId })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const getTimetable = async () => {
    const res = await fetch(`${API_BASE}/timetable`);
    return res.json();
};

export const getEvents = async () => {
    const res = await fetch(`${API_BASE}/events`);
    return res.json();
};

export const addEvent = async (eventData: any) => {
    const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    });
    return res.json();
};

export const getAnalytics = async () => {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
};

export const getMaintenance = async () => {
    const res = await fetch(`${API_BASE}/maintenance`);
    return res.json();
};

export const updateMaintenance = async (blockedEdges: string[][], alert: string = '') => {
    const res = await fetch(`${API_BASE}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked_edges: blockedEdges, alert })
    });
    return res.json();
};

export const resetMaintenance = async () => {
    const res = await fetch(`${API_BASE}/maintenance/reset`, { method: 'POST' });
    return res.json();
};

export const agentQuery = async (query: string, currentLocation?: string) => {
    const res = await fetch(`${API_BASE}/agent/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, current_location: currentLocation })
    });
    return res.json();
};

export const analyzeImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/analyze-image`, {
        method: 'POST',
        body: formData
    });
    return res.json();
};

export const askAgent = agentQuery;
