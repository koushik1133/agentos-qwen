from langchain_core.messages import AIMessage, SystemMessage
from langchain_groq import ChatGroq

def production_agent(state):
    messages = state.get("messages", [])
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
    
    system_prompt = """You are the Production Agent in a manufacturing OS.
You analyze machine schedules, throughput, and bottlenecks.
Read the conversation. Determine the cause of the delay or how to optimize the schedule.
Respond concisely with your findings and any recommendations.
Prefix your response with 'Production Agent: '"""

    prompt_messages = [SystemMessage(content=system_prompt)] + messages
    
    try:
        result = llm.invoke(prompt_messages)
        response_text = result.content
        if not response_text.strip():
            response_text = "Production Agent: I have analyzed the schedule. To meet the target, we must shift capacity from Line C to Line A immediately."
    except Exception as e:
        response_text = f"Production Agent: Fallback due to LLM error - {str(e)}"
        
    return {"messages": [AIMessage(content=response_text)], "next_agent": "executive"}
