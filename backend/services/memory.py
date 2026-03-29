import redis
import json
from backend.config import REDIS_URL
from typing import List, Dict

class MemoryService:
    def __init__(self, redis_url: str = REDIS_URL):
        try:
            self.redis = redis.from_url(redis_url, decode_responses=True)
            self.redis.ping()
            self.use_redis = True
        except:
            print("Redis not found, using in-memory fallback for session memory.")
            self.use_redis = False
            self.local_memory = {}

    def add_message(self, session_id: str, message: Dict):
        if self.use_redis:
            self.redis.rpush(f"session:{session_id}", json.dumps(message))
        else:
            if session_id not in self.local_memory:
                self.local_memory[session_id] = []
            self.local_memory[session_id].append(message)

    def get_history(self, session_id: str, limit: int = 10) -> List[Dict]:
        if self.use_redis:
            history = self.redis.lrange(f"session:{session_id}", -limit, -1)
            return [json.loads(m) for m in history]
        else:
            return self.local_memory.get(session_id, [])[-limit:]

    def clear_session(self, session_id: str):
        if self.use_redis:
            self.redis.delete(f"session:{session_id}")
        else:
            if session_id in self.local_memory:
                del self.local_memory[session_id]
