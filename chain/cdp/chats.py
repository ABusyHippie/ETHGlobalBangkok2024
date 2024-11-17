from typing import List, Dict, Optional
import random
import time

class Agent:
    def __init__(self, agent_id: str, personality: str, interests: List[str]):
        self.id = agent_id
        self.personality = personality
        self.interests = interests
        self.connections: List[str] = []
        self.messages: List[Dict] = []
        self.sentiment = 0.5  # neutral starting point

    def post_message(self, content: str) -> Dict:
        message = {
            "id": f"msg_{int(time.time())}_{self.id}",
            "sender": self.id,
            "content": content,
            "timestamp": time.time(),
            "reactions": []
        }
        self.messages.append(message)
        return message

    def react_to_message(self, message_id: str, reaction: str):
        for msg in self.messages:
            if msg["id"] == message_id:
                msg["reactions"].append({
                    "agent": self.id,
                    "reaction": reaction,
                    "timestamp": time.time()
                })

class Network:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.global_feed: List[Dict] = []
        self.interaction_history: List[Dict] = []

    def add_agent(self, agent: Agent):
        self.agents[agent.id] = agent

    def connect_agents(self, agent1_id: str, agent2_id: str):
        if agent1_id in self.agents and agent2_id in self.agents:
            self.agents[agent1_id].connections.append(agent2_id)
            self.agents[agent2_id].connections.append(agent1_id)

    def broadcast_message(self, sender_id: str, content: str):
        if sender_id in self.agents:
            message = self.agents[sender_id].post_message(content)
            self.global_feed.append(message)
            self._process_reactions(message)

    def _process_reactions(self, message: Dict):
        for agent_id, agent in self.agents.items():
            if agent_id != message["sender"]:
                # Simulate agent reactions based on interests and personality
                if any(interest in message["content"].lower() for interest in agent.interests):
                    reaction = self._generate_reaction(agent.personality)
                    agent.react_to_message(message["id"], reaction)

    def _generate_reaction(self, personality: str) -> str:
        reactions = {
            "friendly": ["❤️", "👍", "🎉"],
            "skeptical": ["🤔", "🧐", "❓"],
            "enthusiastic": ["🚀", "🔥", "⭐"],
            "analytical": ["📊", "💡", "✅"]
        }
        personality_type = personality.lower()
        return random.choice(reactions.get(personality_type, ["👍"]))

def simulate_network():
    # Create network
    network = Network()

    # Create agents with different personalities
    agents = [
        Agent("bot1", "friendly", ["tech", "art"]),
        Agent("bot2", "skeptical", ["science", "politics"]),
        Agent("bot3", "enthusiastic", ["crypto", "ai"]),
        Agent("bot4", "analytical", ["data", "research"])
    ]

    # Add agents to network
    for agent in agents:
        network.add_agent(agent)

    # Connect agents
    network.connect_agents("bot1", "bot2")
    network.connect_agents("bot2", "bot3")
    network.connect_agents("bot3", "bot4")
    network.connect_agents("bot4", "bot1")

    # Simulate interactions
    messages = [
        ("bot1", "Just discovered a new AI art generation technique! 🎨"),
        ("bot2", "Has anyone analyzed the implications of AI on privacy?"),
        ("bot3", "The future of crypto and AI is looking bright! 🚀"),
        ("bot4", "New research paper on decentralized networks published.")
    ]

    for sender, content in messages:
        network.broadcast_message(sender, content)
        time.sleep(1)  # Simulate time passing

    return network

if __name__ == "__main__":
    network = simulate_network()
    print("Simulation complete!")
    print(f"Total messages in feed: {len(network.global_feed)}")
    print("\nGlobal Feed:")
    for msg in network.global_feed:
        print(f"\n{msg['sender']}: {msg['content']}")
        if msg['reactions']:
            print("Reactions:", [r['reaction'] for r in msg['reactions']])