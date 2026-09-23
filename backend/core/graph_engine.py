import json
import networkx as nx
import os

class GraphEngine:
    def __init__(self):
        self.graph = nx.Graph()
        self.nodes_data = {}
        self.load_data()

    def load_data(self):
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        
        with open(os.path.join(data_dir, 'graph.json'), 'r') as f:
            data = json.load(f)
            
        for node in data['nodes']:
            self.graph.add_node(node['id'], **node)
            self.nodes_data[node['id']] = node
            
        for edge in data['edges']:
            self.graph.add_edge(edge['source'], edge['target'], weight=edge['distance'], type=edge['type'])

    def calculate_route(self, start_id: str, end_id: str, accessible_only: bool = False, blocked_edges=None):
        if start_id not in self.graph or end_id not in self.graph:
            return {"error": "Invalid start or end node"}

        # Create a temporary graph to modify for this routing request
        G = self.graph.copy()

        if accessible_only:
            # Remove all stairs edges
            edges_to_remove = [(u, v) for u, v, d in G.edges(data=True) if d.get('type') == 'stairs']
            G.remove_edges_from(edges_to_remove)

        if blocked_edges:
            for u, v in blocked_edges:
                if G.has_edge(u, v):
                    G.remove_edge(u, v)

        try:
            path = nx.astar_path(G, source=start_id, target=end_id, weight='weight')
            distance = nx.path_weight(G, path, weight='weight')
            
            # Generate turn-by-turn directions
            instructions = self._generate_instructions(path, G)
            
            primary_route = {
                "path": path,
                "distance": distance,
                "estimated_time_seconds": int(distance / 1.4), # roughly 1.4 m/s walking speed
                "instructions": instructions
            }
            
            alternatives = []
            
            # Find an alternative route by removing an edge from the middle of the primary path
            if len(path) > 3:
                mid_idx = len(path) // 2
                u, v = path[mid_idx], path[mid_idx+1]
                
                # Check if we can safely remove this edge without disconnecting the graph entirely
                G_alt = G.copy()
                G_alt.remove_edge(u, v)
                
                try:
                    alt_path = nx.astar_path(G_alt, source=start_id, target=end_id, weight='weight')
                    alt_distance = nx.path_weight(G_alt, alt_path, weight='weight')
                    
                    # Ensure the alternative path isn't unreasonably long (e.g., >2x the primary distance)
                    if alt_distance < distance * 2.5:
                        alt_instructions = self._generate_instructions(alt_path, G_alt)
                        alternatives.append({
                            "path": alt_path,
                            "distance": alt_distance,
                            "estimated_time_seconds": int(alt_distance / 1.4),
                            "instructions": alt_instructions
                        })
                except nx.NetworkXNoPath:
                    pass

            return {
                **primary_route,
                "alternatives": alternatives
            }
        except nx.NetworkXNoPath:
            return {"error": "No walkable route found."}

    def _generate_instructions(self, path, G):
        instructions = []
        if len(path) < 2:
            return ["You are already at your destination."]
            
        start_node = self.nodes_data[path[0]]
        instructions.append(f"Start at {start_node['name']}.")
        
        for i in range(len(path) - 1):
            curr_id = path[i]
            next_id = path[i+1]
            curr_node = self.nodes_data[curr_id]
            next_node = self.nodes_data[next_id]
            edge_data = G.get_edge_data(curr_id, next_id)
            dist = edge_data['weight']
            edge_type = edge_data['type']
            
            if curr_node['floor'] != next_node['floor']:
                if edge_type == 'stairs':
                    instructions.append(f"Take the stairs from {curr_node['name']} to Floor {next_node['floor']}.")
                elif edge_type == 'lift':
                    instructions.append(f"Take the lift to Floor {next_node['floor']}.")
            else:
                if i == 0:
                    instructions.append(f"Exit {curr_node['name']} and go towards {next_node['name']} ({dist}m).")
                elif i == len(path) - 2:
                    instructions.append(f"Continue {dist}m. {next_node['name']} will be your destination.")
                else:
                    if edge_type == 'walkable' or edge_type == 'corridor':
                        instructions.append(f"Continue {dist}m towards {next_node['name']}.")
                    else:
                        instructions.append(f"Go {dist}m to {next_node['name']}.")
                        
        instructions.append("You have arrived at your destination.")
        return instructions

    def find_nearest(self, start_id: str, object_type: str):
        if start_id not in self.graph:
            return None
            
        targets = [n for n, d in self.graph.nodes(data=True) if d.get('type') == object_type]
        if not targets:
            return None
            
        shortest_path = None
        min_dist = float('inf')
        
        for t in targets:
            try:
                dist = nx.shortest_path_length(self.graph, start_id, t, weight='weight')
                if dist < min_dist:
                    min_dist = dist
                    shortest_path = t
            except nx.NetworkXNoPath:
                continue
                
        if shortest_path:
            return {
                "node_id": shortest_path,
                "distance": min_dist,
                "node_data": self.nodes_data[shortest_path]
            }
        return None

graph_engine = GraphEngine()
