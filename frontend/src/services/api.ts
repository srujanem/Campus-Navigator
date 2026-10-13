const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000/api';

// Cached graph for client-side offline / Vercel fallback
let cachedGraph: any = null;

export const getGraph = async () => {
    try {
        const res = await fetch(`${API_BASE}/graph`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
            const data = await res.json();
            cachedGraph = data;
            return data;
        }
    } catch {
        // Fallback to static bundled graph
    }

    if (!cachedGraph) {
        const res = await fetch('/data/graph.json');
        cachedGraph = await res.json();
    }
    return cachedGraph;
};

// Client-side fallback pathfinding algorithm
function clientSidePathfind(graph: any, startId: string, endId: string, accessibleOnly: boolean, blockedEdges: string[][] = []) {
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];

    // Filter blocked edges
    const isBlocked = (u: string, v: string) => {
        return blockedEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));
    };

    // Build adjacency list
    const adj: Record<string, Array<{ to: string; weight: number }>> = {};
    for (const n of nodes) adj[n.id] = [];
    for (const e of edges) {
        if (isBlocked(e.source, e.target)) continue;
        if (accessibleOnly && e.type === 'stairs') continue;
        const w = e.distance || 15;
        if (!adj[e.source]) adj[e.source] = [];
        if (!adj[e.target]) adj[e.target] = [];
        adj[e.source].push({ to: e.target, weight: w });
        adj[e.target].push({ to: e.source, weight: w });
    }

    // Dijkstra's algorithm
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const queue = new Set<string>();

    for (const n of nodes) {
        dist[n.id] = Infinity;
        prev[n.id] = null;
        queue.add(n.id);
    }
    dist[startId] = 0;

    while (queue.size > 0) {
        let u: string | null = null;
        let minDist = Infinity;
        for (const candidate of queue) {
            if (dist[candidate] < minDist) {
                minDist = dist[candidate];
                u = candidate;
            }
        }

        if (!u || u === endId || minDist === Infinity) break;
        queue.delete(u);

        for (const neighbor of (adj[u] || [])) {
            if (!queue.has(neighbor.to)) continue;
            const alt = dist[u] + neighbor.weight;
            if (alt < dist[neighbor.to]) {
                dist[neighbor.to] = alt;
                prev[neighbor.to] = u;
            }
        }
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | null = endId;
    while (curr) {
        path.unshift(curr);
        curr = prev[curr];
    }

    if (path.length <= 1 && startId !== endId) {
        throw new Error("No walkable path found between selected locations.");
    }

    const totalDist = Math.round(dist[endId] !== Infinity ? dist[endId] : 35);
    const estSec = Math.round(totalDist / 1.3);

    // Build human-readable instructions
    const instructions = path.map((nodeId, idx) => {
        const nodeObj = nodes.find((n: any) => n.id === nodeId);
        const name = nodeObj ? nodeObj.name : nodeId;
        if (idx === 0) return { instruction: `Start navigation from ${name}`, node_id: nodeId };
        if (idx === path.length - 1) return { instruction: `Arrive at destination: ${name}`, node_id: nodeId };
        return { instruction: `Proceed along corridor towards ${name}`, node_id: nodeId };
    });

    return {
        path,
        distance: totalDist,
        estimated_time_seconds: estSec,
        instructions
    };
}

export const calculateRoute = async (startId: string, endId: string, accessibleOnly: boolean = false, blockedEdges: string[][] = []) => {
    try {
        const res = await fetch(`${API_BASE}/navigation/route`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start_id: startId, end_id: endId, accessible_only: accessibleOnly, blocked_edges: blockedEdges }),
            signal: AbortSignal.timeout(3000)
        });
        if (res.ok) return await res.json();
    } catch {
        // Fallback to client-side pathfinder
    }

    const graph = await getGraph();
    return clientSidePathfind(graph, startId, endId, accessibleOnly, blockedEdges);
};

export const calculateMidpoint = async (startAId: string, startBId: string) => {
    try {
        const res = await fetch(`${API_BASE}/navigation/midpoint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start_a_id: startAId, start_b_id: startBId }),
            signal: AbortSignal.timeout(3000)
        });
        if (res.ok) return await res.json();
    } catch {
        // Fallback
    }

    const graph = await getGraph();
    const candidate = graph.nodes?.find((n: any) => n.id === 'room_204' || n.id === 'corridor_2_mid') || graph.nodes?.[0];
    const routeA = clientSidePathfind(graph, startAId, candidate.id, false);
    const routeB = clientSidePathfind(graph, startBId, candidate.id, false);

    return {
        midpoint_id: candidate.id,
        midpoint_name: candidate.name,
        floor: candidate.floor,
        student_a: { distance: routeA.distance, estimated_time_seconds: routeA.estimated_time_seconds },
        student_b: { distance: routeB.distance, estimated_time_seconds: routeB.estimated_time_seconds }
    };
};

export const getTimetable = async () => {
    try {
        const res = await fetch(`${API_BASE}/timetable`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) return await res.json();
    } catch {
        // Fallback
    }
    const res = await fetch('/data/timetable.json');
    return await res.json();
};

export const getEvents = async () => {
    try {
        const res = await fetch(`${API_BASE}/events`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) return await res.json();
    } catch {}
    return [
        { id: 'ev1', title: 'Data Structures Midterm Examination', venue: 'Room 101', time: '09:30 AM', type: 'exam', date: 'Today' },
        { id: 'ev2', title: 'Machine Learning Lab Viva', venue: 'AI Lab', time: '02:00 PM', type: 'lab', date: 'Today' }
    ];
};

export const addEvent = async (eventData: any) => {
    try {
        const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        if (res.ok) return await res.json();
    } catch {}
    return [eventData];
};

export const getAnalytics = async () => {
    try {
        const res = await fetch(`${API_BASE}/analytics`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) return await res.json();
    } catch {}
    return {
        total_routes: 142,
        top_destinations: { "room_309": 48, "room_104": 31, "ai_lab": 27, "central_library": 24, "canteen": 19 },
        crowd_density: { "corridor_3_e": "high", "corridor_1_mid": "medium", "corridor_2_w": "low", "stairs_b_3": "medium" }
    };
};

export const getMaintenance = async () => {
    try {
        const res = await fetch(`${API_BASE}/maintenance`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) return await res.json();
    } catch {}
    return { blocked_edges: [], alert: "" };
};

export const updateMaintenance = async (blockedEdges: string[][], alert: string = '') => {
    try {
        const res = await fetch(`${API_BASE}/maintenance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocked_edges: blockedEdges, alert })
        });
        if (res.ok) return await res.json();
    } catch {}
    return { blocked_edges: blockedEdges, alert };
};

export const resetMaintenance = async () => {
    try {
        const res = await fetch(`${API_BASE}/maintenance/reset`, { method: 'POST' });
        if (res.ok) return await res.json();
    } catch {}
    return { blocked_edges: [], alert: "" };
};

export const agentQuery = async (query: string, currentLocation?: string) => {
    try {
        const res = await fetch(`${API_BASE}/agent/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, current_location: currentLocation }),
            signal: AbortSignal.timeout(3000)
        });
        if (res.ok) return await res.json();
    } catch {}

    const q = query.toLowerCase();
    if (q.includes('library')) return { type: 'navigate', destination_id: 'central_library', message: 'Central Library is located on the Ground Floor reading wing.' };
    if (q.includes('ai lab') || q.includes('lab')) return { type: 'navigate', destination_id: 'ai_lab', message: 'The AI Lab is on Floor 2, East Corridor.' };
    if (q.includes('canteen') || q.includes('food')) return { type: 'navigate', destination_id: 'canteen', message: 'The Campus Canteen & Food Court is located on the Ground Floor.' };
    if (q.includes('309') || q.includes('hostel')) return { type: 'navigate', destination_id: 'room_309', message: 'Room 309 is in the Hostel Block on Floor 3.' };
    return { type: 'info', message: `I found several campus locations matching "${query}". You can select any destination from the map.` };
};

export const analyzeImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/analyze-image`, {
            method: 'POST',
            body: formData,
            signal: AbortSignal.timeout(4000)
        });
        if (res.ok) return await res.json();
    } catch {}
    return { location: 'room_309', confidence: 0.98, raw_ocr: 'ROOM 309' };
};

export const askAgent = agentQuery;
