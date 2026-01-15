from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

ALLOWED_STATUS = {"todo", "in-progress", "done"}
ALLOWED_PRIORITY = {"low", "medium", "high"}

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None

    @validator("status")
    def check_status(cls, v):
        if v not in ALLOWED_STATUS:
            raise ValueError(f"Status must be one of {ALLOWED_STATUS}")
        return v

    @validator("priority")
    def check_priority(cls, v):
        if v not in ALLOWED_PRIORITY:
            raise ValueError(f"Priority must be one of {ALLOWED_PRIORITY}")
        return v

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None

    @validator("status")
    def check_status(cls, v):
        if v and v not in ALLOWED_STATUS:
            raise ValueError(f"Status must be one of {ALLOWED_STATUS}")
        return v

    @validator("priority")
    def check_priority(cls, v):
        if v and v not in ALLOWED_PRIORITY:
            raise ValueError(f"Priority must be one of {ALLOWED_PRIORITY}")
        return v

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    assigned_to: Optional[int]
    created_by: int
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    assigned_user_name: Optional[str] = None
    is_overdue: bool = False
