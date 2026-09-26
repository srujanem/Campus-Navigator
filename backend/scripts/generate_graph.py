import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def generate_campus():
    return {
        "buildings": [
            {
                "id": "block_a",
                "name": "Block A",
                "floors": [
                    {"id": 0, "name": "Ground Floor"},
                    {"id": 1, "name": "First Floor"},
                    {"id": 2, "name": "Second Floor"},
                    {"id": 3, "name": "Third Floor"}
                ]
            }
        ]
    }

def generate_graph():
    nodes = []
    edges = []

    # Layout per floor:
    # Corridor runs West (x=80) to East (x=520), y=200
    # Rooms on North side (y=120) and South side (y=280)
    # Stairs A at x=60 (West), Stairs B at x=540 (East)
    # Lift at x=540, y=180

    floor_rooms = {
        0: [
            {"id": "entrance_main",  "name": "Main Gate",       "type": "entrance",          "x": 300, "y": 300},
            {"id": "reception",      "name": "Reception",        "type": "room",              "x": 220, "y": 120},
            {"id": "security",       "name": "Security Room",    "type": "room",              "x": 380, "y": 120},
            {"id": "washroom_0",     "name": "Washroom GF",      "type": "washroom",          "x": 460, "y": 120},
            {"id": "fe_0",           "name": "Fire Ext. GF",     "type": "fire_extinguisher", "x": 300, "y": 170},
        ],
        1: [
            {"id": "room_101",       "name": "Room 101",         "type": "classroom",         "x": 140, "y": 120},
            {"id": "room_102",       "name": "Room 102",         "type": "classroom",         "x": 220, "y": 120},
            {"id": "room_103",       "name": "Room 103",         "type": "classroom",         "x": 300, "y": 120},
            {"id": "room_104",       "name": "Room 104",         "type": "classroom",         "x": 380, "y": 120},
            {"id": "washroom_1",     "name": "Washroom F1",      "type": "washroom",          "x": 460, "y": 120},
            {"id": "fe_1",           "name": "Fire Ext. F1",     "type": "fire_extinguisher", "x": 300, "y": 170},
        ],
        2: [
            {"id": "room_201",       "name": "Room 201",         "type": "classroom",         "x": 140, "y": 120},
            {"id": "room_202",       "name": "Room 202",         "type": "classroom",         "x": 220, "y": 120},
            {"id": "room_203",       "name": "Room 203",         "type": "classroom",         "x": 300, "y": 120},
            {"id": "room_204",       "name": "Room 204",         "type": "classroom",         "x": 380, "y": 120},
            {"id": "ai_lab",         "name": "AI Lab",           "type": "lab",               "x": 460, "y": 120},
            {"id": "washroom_2",     "name": "Washroom F2",      "type": "washroom",          "x": 460, "y": 280},
            {"id": "fe_2",           "name": "Fire Ext. F2",     "type": "fire_extinguisher", "x": 300, "y": 170},
        ],
        3: [
            {"id": "room_301",       "name": "Room 301",         "type": "classroom",         "x": 140, "y": 120},
            {"id": "room_302",       "name": "Room 302",         "type": "classroom",         "x": 220, "y": 120},
            {"id": "room_303",       "name": "Room 303",         "type": "classroom",         "x": 300, "y": 120},
            {"id": "room_304",       "name": "Room 304",         "type": "classroom",         "x": 380, "y": 120},
            {"id": "room_305",       "name": "Room 305",         "type": "classroom",         "x": 460, "y": 120},
            {"id": "room_309",       "name": "Room 309 (Hostel)","type": "hostel_room",       "x": 540, "y": 120},
            {"id": "room_310",       "name": "Room 310 (Hostel)","type": "hostel_room",       "x": 620, "y": 120},
            {"id": "washroom_3",     "name": "Washroom F3",      "type": "washroom",          "x": 460, "y": 280},
            {"id": "fe_3",           "name": "Fire Ext. F3",     "type": "fire_extinguisher", "x": 300, "y": 170},
        ],
    }

    corridor_nodes = {
        0:  ("corridor_0_w",   "corridor_0_mid",  "corridor_0_e"),
        1:  ("corridor_1_w",   "corridor_1_mid",  "corridor_1_e"),
        2:  ("corridor_2_w",   "corridor_2_mid",  "corridor_2_e"),
        3:  ("corridor_3_w",   "corridor_3_mid",  "corridor_3_e"),
    }

    stair_a_ids = {f: f"stairs_a_{f}" for f in range(4)}
    stair_b_ids = {f: f"stairs_b_{f}" for f in range(4)}
    lift_ids    = {f: f"lift_{f}"     for f in range(4)}

    for floor in range(4):
        f = floor
        cw, cm, ce = corridor_nodes[f]

        # Corridor nodes
        nodes += [
            {"id": cw, "name": f"West Corridor F{f}",  "type": "corridor", "building": "Block A", "floor": f, "x": 120, "y": 200},
            {"id": cm, "name": f"Main Corridor F{f}",  "type": "corridor", "building": "Block A", "floor": f, "x": 300, "y": 200},
            {"id": ce, "name": f"East Corridor F{f}",  "type": "corridor", "building": "Block A", "floor": f, "x": 480, "y": 200},
        ]
        edges += [
            {"source": cw, "target": cm, "distance": 18, "type": "walkable"},
            {"source": cm, "target": ce, "distance": 18, "type": "walkable"},
        ]

        # Stairs A (West)
        nodes.append({"id": stair_a_ids[f], "name": f"Staircase A (F{f})", "type": "stairs", "building": "Block A", "floor": f, "x": 60,  "y": 200})
        edges.append({"source": stair_a_ids[f], "target": cw, "distance": 6, "type": "walkable"})

        # Stairs B (East)
        nodes.append({"id": stair_b_ids[f], "name": f"Staircase B (F{f})", "type": "stairs", "building": "Block A", "floor": f, "x": 540, "y": 200})
        edges.append({"source": stair_b_ids[f], "target": ce, "distance": 6, "type": "walkable"})

        # Lift (East)
        nodes.append({"id": lift_ids[f], "name": f"Lift (F{f})", "type": "lift", "building": "Block A", "floor": f, "x": 540, "y": 180})
        edges.append({"source": lift_ids[f], "target": ce, "distance": 4, "type": "walkable"})

        # Floor rooms
        for room in floor_rooms[f]:
            nodes.append({**room, "building": "Block A", "floor": f})
            # Connect each room to closest corridor node
            rx = room["x"]
            if rx <= 180:
                corridor_conn = cw
            elif rx <= 400:
                corridor_conn = cm
            else:
                corridor_conn = ce
            edges.append({"source": room["id"], "target": corridor_conn, "distance": 8, "type": "door"})

        # Main entrance also connects to ground mid corridor
        if f == 0:
            edges.append({"source": "entrance_main", "target": cm, "distance": 10, "type": "walkable"})

    # Inter-floor connections via stairs
    for f in range(3):
        edges.append({"source": stair_a_ids[f], "target": stair_a_ids[f+1], "distance": 12, "type": "stairs"})
        edges.append({"source": stair_b_ids[f], "target": stair_b_ids[f+1], "distance": 12, "type": "stairs"})
        edges.append({"source": lift_ids[f],    "target": lift_ids[f+1],    "distance": 5,  "type": "lift"})

    return {"nodes": nodes, "edges": edges}


def generate_landmarks():
    return [
        {"id": "lm_room_204",  "type": "room_sign", "text": "204", "building": "Block A", "floor": 2, "node": "room_204",     "description": "Signboard for Room 204"},
        {"id": "lm_stairs_b2", "type": "staircase",  "text": "Stairs B", "building": "Block A", "floor": 2, "node": "stairs_b_2", "description": "Staircase B on F2"},
        {"id": "lm_corridor_2","type": "corridor",   "text": "East Corridor", "building": "Block A", "floor": 2, "node": "corridor_2_e", "description": "East corridor F2"},
        {"id": "lm_room_301",  "type": "room_sign", "text": "301", "building": "Block A", "floor": 3, "node": "room_301",     "description": "Signboard for Room 301"},
    ]


def generate_timetable():
    return [
        {"time": "09:00", "subject": "Data Structures",    "room": "Room 101", "node_id": "room_101"},
        {"time": "10:00", "subject": "DBMS",               "room": "Room 204", "node_id": "room_204"},
        {"time": "12:00", "subject": "Machine Learning",   "room": "Room 305", "node_id": "room_305"},
        {"time": "14:00", "subject": "AI Lab Practical",   "room": "AI Lab",   "node_id": "ai_lab"},
    ]


if __name__ == "__main__":
    with open(f"{DATA_DIR}/campus.json",    "w") as f: json.dump(generate_campus(),    f, indent=2)
    with open(f"{DATA_DIR}/graph.json",     "w") as f: json.dump(generate_graph(),     f, indent=2)
    with open(f"{DATA_DIR}/landmarks.json", "w") as f: json.dump(generate_landmarks(), f, indent=2)
    with open(f"{DATA_DIR}/timetable.json", "w") as f: json.dump(generate_timetable(), f, indent=2)
    print("Mock data generated successfully.")
