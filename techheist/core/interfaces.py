from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

class FluidDataNode(ABC):
    """
    The fundamental unit of the 'living blueprint' system.
    Unlike static database rows, a FluidDataNode is self-linking and inherently machine-readable.
    """
    @abstractmethod
    def get_id(self) -> str:
        """Returns a unique identifier for this node."""
        pass
    
    @abstractmethod
    def get_context(self) -> Dict[str, Any]:
        """Returns the self-describing context of this data structure."""
        pass
        
    @abstractmethod
    def link_to(self, target_node: 'FluidDataNode', relationship: str) -> None:
        """Establishes a semantic, self-updating link to another node."""
        pass

class AutonomousAgent(ABC):
    """
    A dynamic software entity capable of mutating itself and operating on the FluidDataNode graph.
    """
    @abstractmethod
    def perceive(self, local_graph: List[FluidDataNode]) -> Any:
        """Reads the current state of the local knowledge graph."""
        pass
        
    @abstractmethod
    def execute(self, state: Any) -> None:
        """Performs actions, which may include modifying the graph, deploying sub-agents, or rewriting its own logic."""
        pass
