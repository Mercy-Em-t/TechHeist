from typing import Dict, List, Optional
from techheist.core.interfaces import FluidDataNode

class GraphStore:
    """
    The 'living blueprint' memory system.
    Maintains the graph of nodes and provides querying capabilities.
    """
    def __init__(self):
        self._nodes: Dict[str, FluidDataNode] = {}
        
    def add_node(self, node: FluidDataNode) -> None:
        self._nodes[node.get_id()] = node
        
    def get_node(self, node_id: str) -> Optional[FluidDataNode]:
        return self._nodes.get(node_id)

    def get_all_nodes(self) -> List[FluidDataNode]:
        """Returns all nodes currently in the graph."""
        return list(self._nodes.values())
        
    def find_nodes_by_type(self, node_type: str) -> List[FluidDataNode]:
        """Finds nodes that have a specific type (if they support get_context)."""
        results = []
        for node in self._nodes.values():
            ctx = node.get_context()
            if ctx.get("type") == node_type:
                results.append(node)
        return results

    def print_graph(self) -> None:
        """Utility method to print the current state of the graph."""
        print("--- Current Graph State ---")
        for node in self._nodes.values():
            ctx = node.get_context()
            print(f"Node [{ctx.get('type')}]: {ctx.get('content')} (ID: {node.get_id()[:8]})")
            for rel, targets in ctx.get('edges', {}).items():
                target_snippets = []
                for tid in targets:
                    t_node = self.get_node(tid)
                    if t_node:
                        t_ctx = t_node.get_context()
                        target_snippets.append(f"{t_ctx.get('content')} ({tid[:8]})")
                    else:
                        target_snippets.append(f"UNKNOWN ({tid[:8]})")
                print(f"  --[{rel}]--> {', '.join(target_snippets)}")
        print("---------------------------")

