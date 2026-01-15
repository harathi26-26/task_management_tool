from fastapi import APIRouter, Depends
from typing import List
from app.schemas.task import TaskResponse, TaskUpdate
from app.services.task_service import TaskService
from app.utils.dependencies import get_current_user
 
router = APIRouter(prefix="/api/user", tags=["User"])
 
@router.get("/tasks", response_model=List[TaskResponse])
async def get_my_tasks(current_user: dict = Depends(get_current_user)):
    return TaskService.get_all_tasks(user_id=current_user["id"], role=current_user["role"])
 
@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_my_task(
    task_id: int,
    task: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    task_dict = {k: v for k, v in task.model_dump().items() if v is not None}
    return TaskService.update_task(task_id, task_dict, current_user["id"], current_user["role"])
 
@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }