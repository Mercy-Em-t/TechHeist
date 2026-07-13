import uuid
from typing import Any, Dict
from techheist.core.interfaces import FluidDataNode

class SemanticNode(FluidDataNode):
    """
    A concrete implementation of FluidDataNode that stores data and semantic edges.
    """
    def __init__(self, node_type: str, content: Any):
        self._id = str(uuid.uuid4())
        self.node_type = node_type
        self.content = content
        # Structure: { relationship_type: [target_node_id, target_node_id] }
        self.edges: Dict[str, list[str]] = {}
        
    def get_id(self) -> str:
        return self._id
        
    def get_context(self) -> Dict[str, Any]:
        """Returns the state and connections of this node."""
        return {
            "id": self._id,
            "type": self.node_type,
            "content": self.content,
            "edges": self.edges
        }
        
    def link_to(self, target_node: 'FluidDataNode', relationship: str) -> None:
        """Links this node to another node with a semantic relationship."""
        target_id = target_node.get_id()
        if relationship not in self.edges:
            self.edges[relationship] = []
        if target_id not in self.edges[relationship]:
            self.edges[relationship].append(target_id)
            
    def __repr__(self) -> str:
        return f"<SemanticNode id={self._id[:8]} type={self.node_type} content='{self.content}'>"
