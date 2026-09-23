import json
import os
import re
from .graph_engine import graph_engine

class NavigationAgent:
    def __init__(self):
        self.timetable = []
        self.load_data()

    def load_data(self):
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        with open(os.path.join(data_dir, 'timetable.json'), 'r') as f:
            self.timetable = json.load(f)

    def resolve_query(self, query: str, current_location: str = None):
        query_lower = query.lower().strip()

        # Intent: Nearest object
        nearest_match = re.search(r'nearest\s+(fire\s*ext\w*|washroom|toilet|exit|staircase|stairs|lift|elevator)', query_lower)
        if nearest_match and current_location:
            keyword = nearest_match.group(1)
            obj_map = {
                "fire": "fire_extinguisher", "washroom": "washroom", "toilet": "washroom",
                "exit": "entrance", "staircase": "stairs", "stairs": "stairs",
                "lift": "lift", "elevator": "lift"
            }
            obj_type = next((v for k, v in obj_map.items() if k in keyword), None)
            if obj_type:
                res = graph_engine.find_nearest(current_location, obj_type)
                if res:
                    return {"type": "navigate", "destination_id": res["node_id"],
                            "message": f"Found the nearest {keyword} — {res['node_data']['name']}. Calculating route..."}
            return {"type": "error", "message": f"Could not find a nearby {keyword}."}

        # Intent: Next class
        if any(w in query_lower for w in ["next class", "my class", "where is my class"]):
            if self.timetable:
                next_class = self.timetable[0]
                return {
                    "type": "navigate",
                    "destination_id": next_class["node_id"],
                    "message": f"Your next class is {next_class['subject']} at {next_class['time']} in {next_class['room']}. Navigating..."
                }

        # Intent: room number extraction — handles "room 204", "204", "go to 301", "take me to room 102" etc.
        room_match = re.search(r'\b(\d{3})\b', query_lower)
        if room_match:
            number = room_match.group(1)
            node_id = f"room_{number}"
            if node_id in graph_engine.nodes_data:
                name = graph_engine.nodes_data[node_id]['name']
                return {"type": "navigate", "destination_id": node_id,
                        "message": f"Navigating to {name}."}
            else:
                return {"type": "error",
                        "message": f"Room {number} does not exist in this building. Available rooms: 101-104, 201-204, 301-305."}

        # Intent: named locations (fuzzy search on node names)
        for node_id, data in graph_engine.nodes_data.items():
            node_name_lower = data['name'].lower()
            # Direct substring match
            if node_name_lower in query_lower or node_id.replace('_', ' ') in query_lower:
                return {"type": "navigate", "destination_id": node_id,
                        "message": f"Navigating to {data['name']}."}
        # Partial keyword match
        keywords = query_lower.split()
        for node_id, data in graph_engine.nodes_data.items():
            node_name_lower = data['name'].lower()
            if any(kw in node_name_lower for kw in keywords if len(kw) > 3):
                return {"type": "navigate", "destination_id": node_id,
                        "message": f"Navigating to {data['name']}."}

        return {
            "type": "unknown",
            "message": "I couldn't find that location. Try: 'Room 204', 'AI Lab', 'Room 301', 'nearest washroom', or 'my next class'."
        }

agent = NavigationAgent()
