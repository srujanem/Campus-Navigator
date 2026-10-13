from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import os
import networkx as nx

from core.graph_engine import graph_engine
from core.vision_pipeline import vision_pipeline
from core.agent import agent

router = APIRouter()

# In-memory maintenance state
maintenance_state = {
    "blocked_edges": [],
    "alert": ""
}

# In-memory analytics state
analytics_state = {
    "total_routes": 142,
    "top_destinations": {
        "room_309": 48,
        "room_104": 31,
        "ai_lab": 27,
        "washroom_2": 19,
        "room_305": 17
    },
    "hourly_activity": [4, 8, 22, 35, 41, 28, 19, 12],
    "crowd_density": {
        "corridor_3_e": "high",
        "corridor_1_mid": "medium",
        "corridor_2_w": "low",
        "stairs_b_3": "medium"
    }
}

# Campus Events & Exams
events_state = [
    {
        "id": "ev1",
        "title": "Data Structures Midterm Examination",
        "venue": "Room 101",
        "node_id": "room_101",
        "time": "09:30 AM",
        "type": "exam",
        "date": "Today"
    },
    {
        "id": "ev2",
        "title": "Machine Learning Lab Viva",
        "venue": "AI Lab",
        "node_id": "ai_lab",
        "time": "02:00 PM",
        "type": "lab",
        "date": "Today"
    },
    {
        "id": "ev3",
        "title": "Campus Placement Orientation",
        "venue": "Room 305",
        "node_id": "room_305",
        "time": "04:30 PM",
        "type": "seminar",
        "date": "Today"
    }
]

class RouteRequest(BaseModel):
    start_id: str
    end_id: str
    accessible_only: bool = False
    blocked_edges: Optional[List[List[str]]] = None

class MidpointRequest(BaseModel):
    start_a_id: str
    start_b_id: str

class MaintenanceRequest(BaseModel):
    blocked_edges: List[List[str]]
    alert: str = ""

class EventItem(BaseModel):
    id: str
    title: str
    venue: str
    node_id: str
    time: str
    type: str = "general"
    date: str = "Today"

class AgentQuery(BaseModel):
    query: str
    current_location: Optional[str] = None
    
@router.get("/campus")
def get_campus():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    with open(os.path.join(data_dir, 'campus.json'), 'r') as f:
        return json.load(f)

@router.get("/graph")
def get_graph():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    with open(os.path.join(data_dir, 'graph.json'), 'r') as f:
        return json.load(f)

@router.get("/timetable")
def get_timetable():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    tt_path = os.path.join(data_dir, 'timetable.json')
    if os.path.exists(tt_path):
        with open(tt_path, 'r') as f:
            return json.load(f)
    return []

@router.get("/events")
def get_events():
    return events_state

@router.post("/events")
def add_event(ev: EventItem):
    events_state.append(ev.dict())
    return events_state

@router.get("/analytics")
def get_analytics():
    return analytics_state

@router.get("/maintenance")
def get_maintenance():
    return maintenance_state

@router.post("/maintenance")
def update_maintenance(req: MaintenanceRequest):
    maintenance_state["blocked_edges"] = req.blocked_edges
    maintenance_state["alert"] = req.alert
    return maintenance_state

@router.post("/maintenance/reset")
def reset_maintenance():
    maintenance_state["blocked_edges"] = []
    maintenance_state["alert"] = ""
    return maintenance_state

@router.post("/navigation/route")
def calculate_route(req: RouteRequest):
    # Track analytics
    analytics_state["total_routes"] += 1
    analytics_state["top_destinations"][req.end_id] = analytics_state["top_destinations"].get(req.end_id, 0) + 1

    # Merge global maintenance blocked edges if not explicitly provided
    active_blocked = list(req.blocked_edges or [])
    for b in maintenance_state["blocked_edges"]:
        if b not in active_blocked:
            active_blocked.append(b)

    res = graph_engine.calculate_route(req.start_id, req.end_id, req.accessible_only, active_blocked)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    
    # Attach maintenance alert info if relevant
    if maintenance_state["alert"]:
        res["maintenance_alert"] = maintenance_state["alert"]
        
    return res

@router.post("/navigation/midpoint")
def calculate_midpoint(req: MidpointRequest):
    """
    Finds the optimal meeting room between two students (e.g. Student in 309 and Student in 101)
    that minimizes the total travel distance.
    """
    G = graph_engine.graph
    if req.start_a_id not in G or req.start_b_id not in G:
        raise HTTPException(status_code=400, detail="Invalid starting locations")

    # Candidates are public rooms, corridors, or lounges
    candidate_nodes = [
        n for n, d in G.nodes(data=True)
        if d.get('type') in ['corridor', 'room', 'classroom', 'entrance', 'lab']
    ]

    best_node = None
    min_combined_dist = float('inf')

    for node in candidate_nodes:
        try:
            d_a = nx.astar_path_length(G, req.start_a_id, node, weight='weight')
            d_b = nx.astar_path_length(G, req.start_b_id, node, weight='weight')
            total = max(d_a, d_b) # minimax fairness
            if total < min_combined_dist:
                min_combined_dist = total
                best_node = node
        except nx.NetworkXNoPath:
            continue

    if not best_node:
        raise HTTPException(status_code=400, detail="No meeting location reachable")

    route_a = graph_engine.calculate_route(req.start_a_id, best_node)
    route_b = graph_engine.calculate_route(req.start_b_id, best_node)
    target_info = graph_engine.nodes_data.get(best_node, {})

    return {
        "midpoint_node": best_node,
        "midpoint_name": target_info.get("name", best_node),
        "floor": target_info.get("floor", 0),
        "student_a": route_a,
        "student_b": route_b,
        "shared_destination": target_info
    }

@router.post("/agent/query")
def agent_query(req: AgentQuery):
    return agent.resolve_query(req.query, req.current_location)

@router.post("/analyze-image")
def analyze_image(file: UploadFile = File(...)):
    # We use the filename to simulate image content detection for the demo
    res = vision_pipeline.analyze_image(file.filename)
    return res
