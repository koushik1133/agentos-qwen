from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base, WorkflowLog, Memory
from pydantic import BaseModel
from graph import app_graph
from langchain_core.messages import HumanMessage
import time
import uuid
from datetime import datetime, timezone

app = FastAPI(
    title="ForgeMind AI API",
    description="Multi-agent manufacturing operating system powered by Qwen Cloud",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to ForgeMind AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

class WorkflowRequest(BaseModel):
    message: str

from fastapi.responses import StreamingResponse
from fastapi import BackgroundTasks
from database import SessionLocal
import json

def log_workflow_to_db(workflow_id: str, details: dict):
    db = SessionLocal()
    try:
        db_log = WorkflowLog(workflow_id=workflow_id, status="Completed", details=details)
        db.add(db_log)
        db.commit()
    finally:
        db.close()

@app.post("/api/workflow")
async def run_workflow(request: WorkflowRequest):
    workflow_id = str(uuid.uuid4())
    
    async def event_generator():
        inputs = {"messages": [HumanMessage(content=request.message)]}
        yield f"data: {json.dumps({'message': request.message})}\n\n"
        
        agents_involved = []
        try:
            for output in app_graph.stream(inputs, config={"recursion_limit": 8}):
                for node_name, node_state in output.items():
                    if "messages" in node_state and len(node_state["messages"]) > 0:
                        latest_msg = node_state["messages"][-1].content
                        agent_title = node_name.capitalize()
                        if agent_title not in agents_involved:
                            agents_involved.append(agent_title)
                        yield f"data: {json.dumps({'message': latest_msg})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'message': f'System halted due to safety limit: {str(e)}'})}\n\n"
            
        details = {
            "query": request.message,
            "agents": ", ".join(agents_involved)
        }
        log_workflow_to_db(workflow_id, details)
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

from fastapi import Depends
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import desc

@app.get("/api/metrics")
def get_metrics(db: Session = Depends(get_db)):
    total_workflows = db.query(WorkflowLog).count()
    recent_logs = db.query(WorkflowLog).order_by(desc(WorkflowLog.created_at)).limit(3).all()
    
    recent_actions = []
    for log in recent_logs:
        # Simple heuristic to determine type based on agents
        agents = log.details.get("agents", "")
        action_type = "Workflow"
        if "Production" in agents: action_type = "Production Schedule Update"
        if "Procurement" in agents: action_type = "Procurement Triggered"
        if "Quality" in agents: action_type = "Quality Check"
        
        # Calculate minutes ago
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        log_time = log.created_at.replace(tzinfo=None) if log.created_at.tzinfo else log.created_at
        mins_ago = int((now_utc - log_time).total_seconds() / 60)
        time_str = f"{mins_ago} mins ago" if mins_ago > 0 else "Just now"
        
        recent_actions.append({
            "action": f"{action_type} (ID: {log.workflow_id[:8]})",
            "time": time_str
        })

    return {
        "active_workflows": total_workflows,
        "agreement_score": 98,
        "cost_reduction": total_workflows * 1250, # Arbitrary scaling for demo
        "recent_actions": recent_actions if recent_actions else [{"action": "System Initialized", "time": "Just now"}]
    }

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    logs = db.query(WorkflowLog).order_by(desc(WorkflowLog.created_at)).limit(10).all()
    history = []
    for log in logs:
        agents = log.details.get("agents", "")
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        log_time = log.created_at.replace(tzinfo=None) if log.created_at.tzinfo else log.created_at
        mins_ago = int((now_utc - log_time).total_seconds() / 60)
        time_str = f"{mins_ago} mins ago" if mins_ago > 0 else "Just now"
        
        type_str = "Analysis"
        if "Procurement" in agents: type_str = "Sourcing"
        elif "Quality" in agents: type_str = "QA Resolution"
        elif "Production" in agents: type_str = "Scheduling"
        
        history.append({
            "id": f"#{log.workflow_id[:6]}",
            "type": type_str,
            "status": log.status,
            "agents": agents,
            "time": time_str
        })
    return history

@app.get("/api/memories")
def get_memories(query: str = "", db: Session = Depends(get_db)):
    # Mock fallback, but eventually read from Memory table
    # Since we aren't logging memories yet, return a mix of DB and mock
    logs = db.query(WorkflowLog).order_by(desc(WorkflowLog.created_at)).limit(5).all()
    memories = []
    for log in logs:
        memories.append({
            "title": f"Workflow Memory ({log.workflow_id[:6]})",
            "importance": 0.95,
            "description": f"Processed a query: '{log.details.get('query', '')[:50]}...'",
            "metadata": f"{log.created_at.strftime('%b %d, %Y')} - Agents: {log.details.get('agents', '')}"
        })
        
    if not memories:
        memories = [
            {
                "title": "Initial Setup Memory",
                "importance": 1.0,
                "description": "ForgeMind AI OS initialized. Awaiting commands.",
                "metadata": "System Genesis"
            }
        ]
    return memories

@app.get("/api/workflows/{workflow_id}")
def get_workflow_details(workflow_id: str):
    # Mock data for Agent Collaboration Viewer
    return [
        {"agent": "Executive Agent", "color": "blue", "message": "Received alert: Production delay on Line A. Requesting analysis from Production Agent."},
        {"agent": "Production Agent", "color": "orange", "message": "Analyzed schedule. Bottleneck is due to part shortage. Suggesting Inventory check."},
        {"agent": "Inventory Agent", "color": "green", "message": "Part #1042 is below safety stock. Triggering Procurement workflow."},
        {"agent": "Procurement Agent", "color": "purple", "message": "Comparing suppliers. Supplier X has 2-day delivery. Supplier Y has 5-day delivery but cheaper. Voting for Supplier X to prevent further delay."},
        {"agent": "Executive Agent", "color": "blue", "message": "Vote accepted. Approved PO for Supplier X. Logging decision to Memory Agent."}
    ]

@app.get("/api/production")
def get_production_insights():
    return {
        "bottlenecks": [
            {"line": "Line A - Assembly", "status": "Delayed (Part Shortage)", "severity": "high"},
            {"line": "Line C - Quality Check", "status": "At Capacity", "severity": "medium"}
        ],
        "recommendations": [
            {
                "title": "Schedule Shift",
                "description": "Production Agent recommends shifting Line C workers to Line B during downtime.",
                "confidence": 92,
                "status": "Pending Exec Approval"
            }
        ]
    }
