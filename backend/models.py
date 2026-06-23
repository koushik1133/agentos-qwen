from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, index=True)
    content = Column(Text)
    embedding = Column(JSON) # Mocking vector as JSON for SQLite
    importance_score = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    metadata_ = Column("metadata", JSON, default={}) # Using metadata_ to avoid conflict with Base.metadata

class WorkflowLog(Base):
    __tablename__ = "workflow_logs"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(String, index=True)
    status = Column(String)
    details = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class AgentMessage(Base):
    __tablename__ = "agent_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(String, index=True)
    sender = Column(String)
    receiver = Column(String)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
