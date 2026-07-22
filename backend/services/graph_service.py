import networkx as nx
import random

class GraphService:
    def __init__(self):
        self.G = nx.Graph()
        
    def generate_demo_network(self) -> dict:
        """
        Generates a demo fraud ring network using NetworkX.
        In production, this would query a graph database (Neo4j) or build from MongoDB aggregations.
        """
        G = nx.erdos_renyi_graph(20, 0.15, seed=42)
        
        nodes = []
        for n in G.nodes():
            node_type = random.choice(["Person", "Phone", "Bank", "UPI", "Device"])
            risk_score = random.randint(10, 99)
            nodes.append({
                "id": str(n),
                "label": f"{node_type} {n}",
                "type": node_type,
                "risk_score": risk_score
            })
            
        edges = []
        for e in G.edges():
            edges.append({
                "source": str(e[0]),
                "target": str(e[1]),
                "weight": random.randint(1, 5)
            })
            
        # Basic community detection (using connected components for simplicity)
        communities = list(nx.connected_components(G))
        fraud_rings = len([c for c in communities if len(c) > 3])
            
        return {
            "nodes": nodes,
            "edges": edges,
            "metrics": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "fraud_rings_detected": fraud_rings,
                "high_risk_nodes": len([n for n in nodes if n["risk_score"] > 80])
            }
        }

graph_service = GraphService()
