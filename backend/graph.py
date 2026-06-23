from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from agents.executive import executive_agent
from agents.production import production_agent
from agents.inventory import inventory_agent
from agents.procurement import procurement_agent
from agents.quality import quality_agent

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str
    workflow_id: str
    context: dict

def router(state: AgentState):
    if state.get("next_agent") == "END":
        return END
    return state.get("next_agent", "executive")

workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("executive", executive_agent)
workflow.add_node("production", production_agent)
workflow.add_node("inventory", inventory_agent)
workflow.add_node("procurement", procurement_agent)
workflow.add_node("quality", quality_agent)

# Add Edges
workflow.add_edge("production", "executive")
workflow.add_edge("inventory", "executive")
workflow.add_edge("procurement", "executive")
workflow.add_edge("quality", "executive")

workflow.add_conditional_edges("executive", router)
workflow.set_entry_point("executive")

app_graph = workflow.compile()
