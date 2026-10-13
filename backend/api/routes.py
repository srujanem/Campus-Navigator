from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional
import json
import os

from core.graph_engine import graph_engine
from core.vision_pipeline import vision_pipeline
from core.agent import agent

router = APIRouter()

# In-memory maintenance state
maintenance_state = {
    "blocked_edges": [],
    "alert": ""
}

class RouteRequest(BaseModel):
    start_id: str
    end_id: str
    accessible_only: bool = False
    blocked_edges: Optional[List[List[str]]] = None

class MaintenanceRequest(BaseModel):
    blocked_edges: List[List[str]]
    alert: str = ""

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

@router.post("/agent/query")
def agent_query(req: AgentQuery):
    return agent.resolve_query(req.query, req.current_location)

@router.post("/analyze-image")
def analyze_image(file: UploadFile = File(...)):
    # We use the filename to simulate image content detection for the demo
    res = vision_pipeline.analyze_image(file.filename)
    return res
