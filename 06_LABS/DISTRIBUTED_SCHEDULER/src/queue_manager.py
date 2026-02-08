import json
import redis
from .models import Task


class QueueManager:
    def __init__(
        self, host="localhost", port=6379, db=0, queue_name="basin_nexus_tasks"
    ):
        self.client = redis.Redis(host=host, port=port, db=db, decode_responses=True)
        self.queue_name = queue_name

    def enqueue(self, task: Task) -> str:
        """
        Logic Gate: Verify task before submission.
        """
        if not task.name or not task.payload:
            raise ValueError("Task must have a name and payload.")

        # Serialize task using Pydantic's model_dump_json() method
        task_data = task.model_dump_json()

        # LPUSH to Redis
        self.client.lpush(self.queue_name, task_data)

        print(f"ENQUEUED [ID: {task.id}] Name: {task.name}")
        return task.id

    def get_queue_length(self) -> int:
        return self.client.llen(self.queue_name)

    def clear_queue(self):
        self.client.delete(self.queue_name)
