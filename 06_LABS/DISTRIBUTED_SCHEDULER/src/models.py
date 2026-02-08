import uuid
from datetime import datetime, UTC
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    RETRYING = "retrying"


class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    payload: Dict[str, Any]
    priority: int = Field(default=0, ge=0, le=10)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    status: TaskStatus = TaskStatus.PENDING
    retries: int = 0
    max_retries: int = 3
    timeout: int = 30  # seconds


class TaskResult(BaseModel):
    task_id: str
    success: bool
    output: Optional[Any] = None
    error: Optional[str] = None
    started_at: datetime
    finished_at: datetime
    duration: float  # seconds
