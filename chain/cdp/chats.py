import sys
import json
from langchain_openai import ChatOpenAI
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage

def process_prompt(prompt):
    try:
        llm = ChatOpenAI(model="gpt-4o-mini")  
        cdp = CdpAgentkitWrapper()
        cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(cdp)
        tools = cdp_toolkit.get_tools()
        
        agent_executor = create_react_agent(
            llm,
            tools=tools,
            state_modifier="You are a helpful agent that can interact with the Base blockchain using CDP AgentKit. You can create wallets, deploy tokens, and perform transactions."
        )

        responses = []
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=prompt)]},
            {"configurable": {"thread_id": "my_first_agent"}}
        ):
            if "agent" in chunk:
                responses.append(chunk["agent"]["messages"][0].content)
            elif "tools" in chunk:
                responses.append(chunk["tools"]["messages"][0].content)
        
        return json.dumps({"response": " ".join(responses)})
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    prompt = sys.argv[1] if len(sys.argv) > 1 else ""
    print(process_prompt(prompt))