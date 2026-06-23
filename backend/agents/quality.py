from langchain_core.messages import AIMessage, SystemMessage
from langchain_groq import ChatGroq

def quality_agent(state):
    messages = state.get("messages", [])
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
    
    system_prompt = """You are the Quality Control Agent in a manufacturing OS.
You analyze defect rates and machine performance.
Read the conversation. Identify the root cause of the defect and recommend a fix (like recalibration).
Prefix your response with 'Quality Agent: '"""

    prompt_messages = [SystemMessage(content=system_prompt)] + messages
    
    try:
        result = llm.invoke(prompt_messages)
        response_text = result.content
        if not response_text.strip():
            response_text = "Quality Agent: Analyzing defect data. Recommend immediately recalibrating Machine B to prevent QA failure."
    except Exception as e:
        response_text = f"Quality Agent: Fallback due to LLM error - {str(e)}"
        
    return {"messages": [AIMessage(content=response_text)], "next_agent": "executive"}
