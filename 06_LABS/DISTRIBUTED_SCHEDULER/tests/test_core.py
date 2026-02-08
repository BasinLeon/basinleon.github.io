import unittest
from unittest.mock import MagicMock
from src.models import Task, TaskStatus
from src.queue_manager import QueueManager


class TestSchedulerCore(unittest.TestCase):
    def setUp(self):
        # Mock Redis to avoid dependency on a live server during unit tests
        self.mock_redis = MagicMock()
        self.queue = QueueManager()
        self.queue.client = self.mock_redis

    def test_task_creation(self):
        task = Task(name="test_job", payload={"key": "value"})
        self.assertEqual(task.status, TaskStatus.PENDING)
        self.assertEqual(task.name, "test_job")

    def test_enqueue_logic(self):
        task = Task(name="test_job", payload={"key": "value"})
        task_id = self.queue.enqueue(task)

        # Verify Redis LPUSH was called
        self.mock_redis.lpush.assert_called_once()
        self.assertEqual(task_id, task.id)

    def test_logic_gate_enforcement(self):
        # Test missing payload
        with self.assertRaises(ValueError):
            # Bypass Pydantic validation to test the QueueManager's gate
            # In a real scenario, Pydantic would catch this first,
            # but we want to ensure the Manager doesn't process bad data.
            bad_task = MagicMock(spec=Task)
            bad_task.name = "bad_job"
            bad_task.payload = {}
            self.queue.enqueue(bad_task)


if __name__ == "__main__":
    unittest.main()
