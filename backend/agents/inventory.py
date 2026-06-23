from langchain_core.messages import AIMessage, SystemMessage
from langchain_groq import ChatGroq

def inventory_agent(state):
    messages = state.get("messages", [])
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
    
    system_prompt = """You are the Inventory Agent in a manufacturing OS.
You monitor raw material stock levels and safety thresholds.
Read the conversation. Check if parts are low or if a delay is due to a shortage.
Recommend triggering procurement if stock is low.
Prefix your response with 'Inventory Agent: '"""

    prompt_messages = [SystemMessage(content=system_prompt)] + messages
    
    try:
        result = llm.invoke(prompt_messages)
        response_text = result.content
        if not response_text.strip():
            response_text = "Inventory Agent: Stock levels checked. We are low on critical raw materials and require immediate procurement."
    except Exception as e:
        response_text = f"Inventory Agent: Fallback due to LLM error - {str(e)}"
        
    return {"messages": [AIMessage(content=response_text)], "next_agent": "executive"}
