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

// Alias used by NavigationPage for natural-language destination resolution
export const askAgent = agentQuery;
