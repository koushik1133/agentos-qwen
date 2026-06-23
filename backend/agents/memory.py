from sqlalchemy.orm import Session
from models import Memory
from database import SessionLocal
import json

class MemoryAgent:
    def __init__(self):
        # We would initialize embedding model here
        pass

    def store_memory(self, agent_id: str, content: str, importance: float = 1.0, metadata: dict = None):
        db: Session = SessionLocal()
        try:
            # Mock embedding for now
            mock_embedding = [0.1] * 1536 
            memory = Memory(
                agent_id=agent_id,
                content=content,
                embedding=mock_embedding,
                importance_score=importance,
                metadata_=metadata or {}
            )
            db.add(memory)
            db.commit()
            return True
        except Exception as e:
            print(f"Failed to store memory: {e}")
            db.rollback()
            return False
        finally:
            db.close()

    def retrieve_memory(self, query: str, limit: int = 5):
        # Implement vector search here using pgvector's <-> operator
        return []

memory_agent = MemoryAgent()
