from techheist.memory.graph_store import GraphStore
from techheist.orchestration.local_node import LocalNode
from techheist.agents.builder_agent import BuilderAgent

def main():
    print("Initializing TechHeist Local Node...")
    
    # 1. Initialize the memory graph
    memory_graph = GraphStore()
    
    # 2. Initialize the orchestration node
    node = LocalNode(node_id="edge-node-01")
    
    # 3. Create and deploy the Builder Agent
    builder = BuilderAgent(graph_store=memory_graph)
    node.deploy_agent(builder)
    
    print("\n[Simulation] Incoming data streams...")
    data_streams = [
        "System recognizes User",
        "User builds Application",
        "Application uses TechHeist",
        "TechHeist transforms Technology"
    ]
    
    # 4. Agent executes to process streams
    for text in data_streams:
        # In a real system, the orchestrator 'tick' would pass this state
        builder.execute({"input_text": text})
        
    print("\n[Simulation] Displaying Living Blueprint Graph...")
    # 5. Output the resulting memory graph
    memory_graph.print_graph()

if __name__ == "__main__":
    main()
