from langchain_core.messages import AIMessage, SystemMessage
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field

class ExecutiveRoute(BaseModel):
    response: str = Field(description="Your response message acknowledging the situation and explaining your routing decision.")
    next_agent: str = Field(description="The next agent to route to. Must be one of: production, inventory, quality, procurement, END")

def executive_agent(state):
    messages = state.get("messages", [])
    
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
    structured_llm = llm.with_structured_output(ExecutiveRoute)
    
    system_prompt = """You are the Executive Agent in a manufacturing OS.
You orchestrate workflows by delegating to specialized agents.
Read the conversation history. Decide what needs to happen next.
- If we need to check schedules or bottlenecks, route to 'production'.
- If we need to check stock or raw materials, route to 'inventory'.
- If we need to buy/source parts, route to 'procurement'.
- If we need to analyze defects, route to 'quality'.
- CRITICAL: If a recommendation has been made by another agent, if you are asking a follow-up question, or if the issue is resolved, YOU MUST route to 'END' immediately. Do NOT route to the same agent twice in a row.

Keep your response concise, professional, and authoritative."""

    prompt_messages = [SystemMessage(content=system_prompt)] + messages
    
    try:
        result = structured_llm.invoke(prompt_messages)
        response_text = f"Executive Agent: {result.response}"
        valid_agents = ["production", "inventory", "quality", "procurement", "END"]
        next_agent = result.next_agent if result.next_agent in valid_agents else "END"
    except Exception as e:
        response_text = f"Executive Agent: Fallback due to LLM error - {str(e)}"
        next_agent = "END"
        
    return {"messages": [AIMessage(content=response_text)], "next_agent": next_agent}
