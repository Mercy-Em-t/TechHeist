from typing import Dict, List, Optional
from techheist.core.interfaces import FluidDataNode

class GraphStore:
    """
    A mock/placeholder implementation of the continuous stateful memory system.
    This will eventually be a decentralized organic graph system.
    """
    def __init__(self):
        self._nodes: Dict[str, FluidDataNode] = {}
        
    def add_node(self, node: FluidDataNode) -> None:
        self._nodes[node.get_id()] = node
        
    def get_node(self, node_id: str) -> Optional[FluidDataNode]:
        return self._nodes.get(node_id)
