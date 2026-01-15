from pydantic import BaseModel
from typing import Optional
from datetime import datetime
 
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None