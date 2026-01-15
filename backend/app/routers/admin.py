from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import TaskService
from app.services.analytics_service import AnalyticsService
from app.utils.dependencies import require_admin, get_current_user
from app.database import get_db
 
router = APIRouter(prefix="/api/admin", tags=["Admin"])
 
@router.post("/tasks", response_model=TaskResponse)
async def create_task(task: TaskCreate, current_user: dict = Depends(require_admin)):
    """Create a new task (Admin only)"""
    task_dict = task.model_dump()
    return TaskService.create_task(task_dict, current_user["id"])
 
@router.get("/tasks", response_model=List[TaskResponse])
async def get_all_tasks(current_user: dict = Depends(require_admin)):
    """Get all tasks (Admin only)"""
    return TaskService.get_all_tasks(role="admin")
 
@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, current_user: dict = Depends(require_admin)):
    """Get a specific task (Admin only)"""
    return TaskService.get_task_by_id(task_id)
 
@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task: TaskUpdate,
    current_user: dict = Depends(require_admin)
):
    """Update a task (Admin only)"""
    task_dict = {k: v for k, v in task.model_dump().items() if v is not None}
    return TaskService.update_task(task_id, task_dict, current_user["id"], "admin")
 
@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, current_user: dict = Depends(require_admin)):
    """Delete a task (Admin only)"""
    return TaskService.delete_task(task_id)
 
@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(require_admin)):
    """Get analytics data (Admin only)"""
    return AnalyticsService.get_analytics()
 
@router.get("/users")
async def get_all_users(current_user: dict = Depends(require_admin)):
    """Get all users (Admin only)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
        users = [dict(row) for row in cursor.fetchall()]
        return users
