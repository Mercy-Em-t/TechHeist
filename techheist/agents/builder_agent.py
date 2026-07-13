from typing import Any, List
from techheist.core.interfaces import AutonomousAgent, FluidDataNode
from techheist.memory.graph_store import GraphStore
from techheist.memory.semantic_node import SemanticNode

class BuilderAgent(AutonomousAgent):
    """
    An agent that takes raw string input, extracts concepts, and builds a knowledge graph.
    This simulates software dynamically organizing data into machine-readable structures.
    """
    def __init__(self, graph_store: GraphStore):
        self.graph_store = graph_store
        
    def perceive(self, local_graph: List[FluidDataNode]) -> Any:
        """
        In a more advanced state, this would read the existing graph. 
        For now, it just acknowledges the environment.
        """
        return {"nodes_count": len(local_graph)}

    def execute(self, state: Any) -> None:
        """
        Expects `state` to be a dictionary with an 'input_text' key for this simple demo.
        It parses the text and builds the graph.
        """
        if not isinstance(state, dict) or 'input_text' not in state:
            print("BuilderAgent: No 'input_text' provided to execute.")
            return
            
        text = state['input_text']
        print(f"BuilderAgent: Processing input -> '{text}'")
        
        # Extremely simplified "NLP" parsing for demonstration
        # E.g., "Alice knows Bob" -> Node(Alice), Node(Bob), Edge(Alice -> Bob: 'knows')
        
        words = text.split()
        if len(words) >= 3:
            subject_name = words[0]
            verb = words[1]
            object_name = " ".join(words[2:])
            
            # Find or create subject node
            subject_node = self._find_or_create_node("entity", subject_name)
            
            # Find or create object node
            object_node = self._find_or_create_node("entity", object_name)
            
            # Link them
            subject_node.link_to(object_node, verb)
            
            print(f"BuilderAgent: Created relationship [{subject_name}] --({verb})--> [{object_name}]")
        else:
            print("BuilderAgent: Input too simple. Expected at least 3 words (Subject Verb Object).")

    def _find_or_create_node(self, node_type: str, content: str) -> SemanticNode:
        """Helper to find an existing node or create a new one."""
        existing = self.graph_store.find_nodes_by_type(node_type)
        for node in existing:
            if node.get_context().get("content") == content:
                return node
                
        # If not found, create and add
        new_node = SemanticNode(node_type, content)
        self.graph_store.add_node(new_node)
        return new_node
