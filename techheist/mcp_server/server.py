from mcp.server.fastmcp import FastMCP
from techheist.memory.graph_store import GraphStore
from techheist.memory.semantic_node import SemanticNode

# Initialize the global Hyper-Context memory graph
memory_graph = GraphStore()

# Initialize the FastMCP server
mcp = FastMCP("TechHeist-HyperContext")

@mcp.tool()
def add_node(node_type: str, content: str) -> str:
    """
    Injects a new piece of knowledge or strategy into the living blueprint.
    """
    # Check if a node with this content already exists to avoid exact duplicates
    existing = memory_graph.find_nodes_by_type(node_type)
    for node in existing:
        if node.get_context().get("content") == content:
            return f"Node already exists with ID: {node.get_id()}"
            
    new_node = SemanticNode(node_type, content)
    memory_graph.add_node(new_node)
    return f"Created new {node_type} node with ID: {new_node.get_id()}"

@mcp.tool()
def link_nodes(source_id: str, target_id: str, relationship: str) -> str:
    """
    Creates a semantic link between two existing nodes in the graph.
    """
    source_node = memory_graph.get_node(source_id)
    target_node = memory_graph.get_node(target_id)
    
    if not source_node:
        return f"Error: Source node {source_id} not found."
    if not target_node:
        return f"Error: Target node {target_id} not found."
        
    source_node.link_to(target_node, relationship)
    return f"Linked {source_id} --[{relationship}]--> {target_id}"

@mcp.tool()
def query_graph_by_type(node_type: str) -> str:
    """
    Retrieves all nodes of a specific type to provide context.
    """
    nodes = memory_graph.find_nodes_by_type(node_type)
    if not nodes:
        return f"No nodes found of type: {node_type}"
        
    results = []
    for node in nodes:
        ctx = node.get_context()
        results.append(f"- ID: {node.get_id()} | Content: {ctx.get('content')}")
    return "\n".join(results)

@mcp.resource("hyper-context://topology")
def get_graph_topology() -> str:
    """
    Returns the complete current topology of the living blueprint.
    """
    nodes = memory_graph.get_all_nodes()
    if not nodes:
        return "Graph is empty."
        
    topology = []
    for node in nodes:
        ctx = node.get_context()
        topology.append(f"Node [{ctx.get('type')}]: {ctx.get('content')} (ID: {node.get_id()})")
        for rel, targets in ctx.get('edges', {}).items():
            topology.append(f"  --[{rel}]--> {', '.join(targets)}")
    
    return "\n".join(topology)
