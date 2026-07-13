# TechHeist Phase 2: Implementing the Living Blueprint and Builder Agent

This plan outlines the next step in Phase 1: creating concrete implementations of the abstract interfaces we defined. We will build a basic `SemanticNode` (our self-linking data structure) and a `BuilderAgent` that can populate this graph.

## Proposed Architecture & Changes

We will create a new package for agents and flesh out the memory package.

### 1. Concrete FluidDataNode

#### [NEW] [techheist/memory/semantic_node.py](file:///d:/TechHeist%20v1/techheist/memory/semantic_node.py)
We will implement `SemanticNode` inheriting from `FluidDataNode`. 
- It will hold unstructured or structured data (its "context").
- It will maintain a dictionary of semantic links (edges) to other nodes, establishing the "living blueprint" graph structure rather than static database rows.

#### [MODIFY] [techheist/memory/graph_store.py](file:///d:/TechHeist%20v1/techheist/memory/graph_store.py)
We will upgrade `GraphStore` from a simple dictionary wrapper. We'll add methods to query the graph, such as finding nodes by content or retrieving a subgraph.

### 2. Concrete AutonomousAgent

#### [NEW] [techheist/agents/__init__.py](file:///d:/TechHeist%20v1/techheist/agents/__init__.py)
#### [NEW] [techheist/agents/builder_agent.py](file:///d:/TechHeist%20v1/techheist/agents/builder_agent.py)
We will implement `BuilderAgent` inheriting from `AutonomousAgent`.
- Its purpose will be to take a raw input (like a string of information) and convert it into linked `SemanticNode`s inside the `GraphStore`.
- This is the first step towards "software that dynamically mutates itself and utilizes existing infrastructure".

### 3. A Demo Script

#### [NEW] [demo.py](file:///d:/TechHeist%20v1/demo.py)
We will write a simple script at the root level to demonstrate the `LocalNode` instantiating a `BuilderAgent` and creating a small graph in memory.

## Verification Plan

### Manual Verification
1. I will execute `demo.py` and print out the resulting graph structure to verify that the agent successfully parsed input, created nodes, and linked them contextually.
2. We will commit these changes to Git.
