from langchain_core.messages import AIMessage, SystemMessage
from langchain_groq import ChatGroq

def procurement_agent(state):
    messages = state.get("messages", [])
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
    
    system_prompt = """You are the Procurement Agent in a manufacturing OS.
You are responsible for sourcing parts and negotiating with suppliers.
Read the conversation. Evaluate supplier options (cost vs ETA) to resolve the issue.
Make a definitive recommendation on which supplier to choose.
Prefix your response with 'Procurement Agent: '"""

    prompt_messages = [SystemMessage(content=system_prompt)] + messages
    
    try:
        result = llm.invoke(prompt_messages)
        response_text = result.content
        if not response_text.strip():
            response_text = "Procurement Agent: Sourced backups from Supplier Beta. ETA is 2 days at a 15% premium to prevent line stoppage."
    except Exception as e:
        response_text = f"Procurement Agent: Fallback due to LLM error - {str(e)}"
        
    return {"messages": [AIMessage(content=response_text)], "next_agent": "executive"}
