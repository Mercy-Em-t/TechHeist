from typing import List
from techheist.core.interfaces import AutonomousAgent

class LocalNode:
    """
    A lightweight, decentralized orchestrator meant to run locally on an edge device.
    Responsible for executing AutonomousAgents.
    """
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.active_agents: List[AutonomousAgent] = []
        
    def deploy_agent(self, agent: AutonomousAgent) -> None:
        """Deploys an agent to run on this node."""
        self.active_agents.append(agent)
        
    def tick(self) -> None:
        """Single execution cycle for all agents on this node."""
        for agent in self.active_agents:
            # In a real system, state/graph context would be passed here
            state = agent.perceive([])
            agent.execute(state)
