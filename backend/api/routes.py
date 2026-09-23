from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional
import json
import os

from core.graph_engine import graph_engine
from core.vision_pipeline import vision_pipeline
from core.agent import agent

router = APIRouter()

class RouteRequest(BaseModel):
    start_id: str
    end_id: str
    accessible_only: bool = False
    blocked_edges: Optional[List[List[str]]] = None

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

@router.post("/navigation/route")
def calculate_route(req: RouteRequest):
    res = graph_engine.calculate_route(req.start_id, req.end_id, req.accessible_only, req.blocked_edges)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res

@router.post("/agent/query")
def agent_query(req: AgentQuery):
    return agent.resolve_query(req.query, req.current_location)

@router.post("/analyze-image")
def analyze_image(file: UploadFile = File(...)):
    # We use the filename to simulate image content detection for the demo
    res = vision_pipeline.analyze_image(file.filename)
    return res
