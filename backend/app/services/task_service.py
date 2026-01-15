from datetime import datetime
from app.database import get_db
from fastapi import HTTPException

# Allowed enums (recommended for consistency)
TASK_STATUSES = {"todo", "in-progress", "done"}
TASK_PRIORITIES = {"low", "medium", "high"}


class TaskService:

    @staticmethod
    def create_task(task_data: dict, created_by: int):
        assigned_id = task_data.get("assigned_to")

        if assigned_id:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM users WHERE id = ?", (assigned_id,))
                if not cursor.fetchone():
                    raise HTTPException(
                        status_code=400,
                        detail=f"Assigned user with ID {assigned_id} does not exist"
                    )

        status = task_data.get("status", "todo")
        priority = task_data.get("priority", "medium")

        if status not in TASK_STATUSES:
            raise HTTPException(
                status_code=422,
                detail=f"Status must be one of {TASK_STATUSES}"
            )

        if priority not in TASK_PRIORITIES:
            raise HTTPException(
                status_code=422,
                detail=f"Priority must be one of {TASK_PRIORITIES}"
            )

        with get_db() as conn:
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()

            cursor.execute("""
                INSERT INTO tasks (
                    title, description, status, priority, due_date,
                    assigned_to, created_by, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                task_data.get("title"),
                task_data.get("description"),
                status,
                priority,
                task_data.get("due_date"),
                assigned_id,
                created_by,
                now,
                now
            ))

            conn.commit()
            task_id = cursor.lastrowid
            return TaskService.get_task_by_id(task_id)

    @staticmethod
    def get_task_by_id(task_id: int):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT t.*, u.name AS assigned_user_name
                FROM tasks t
                LEFT JOIN users u ON t.assigned_to = u.id
                WHERE t.id = ?
            """, (task_id,))

            task = cursor.fetchone()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")

            task_dict = dict(task)
            task_dict["is_overdue"] = TaskService._check_overdue(task_dict)
            return task_dict

    @staticmethod
    def get_all_tasks(user_id: int = None, role: str = None):
        with get_db() as conn:
            cursor = conn.cursor()

            if role == "admin":
                cursor.execute("""
                    SELECT t.*, u.name AS assigned_user_name
                    FROM tasks t
                    LEFT JOIN users u ON t.assigned_to = u.id
                    ORDER BY t.created_at DESC
                """)
            else:
                cursor.execute("""
                    SELECT t.*, u.name AS assigned_user_name
                    FROM tasks t
                    LEFT JOIN users u ON t.assigned_to = u.id
                    WHERE t.assigned_to = ?
                    ORDER BY t.created_at DESC
                """, (user_id,))

            tasks = cursor.fetchall()
            result = []

            for task in tasks:
                task_dict = dict(task)
                task_dict["is_overdue"] = TaskService._check_overdue(task_dict)
                result.append(task_dict)

            return result

    @staticmethod
    def update_task(task_id: int, task_data: dict, user_id: int, role: str):
        with get_db() as conn:
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
            existing_task = cursor.fetchone()

            if not existing_task:
                raise HTTPException(status_code=404, detail="Task not found")

            existing = dict(existing_task)

            # Authorization
            if role != "admin" and existing["assigned_to"] != user_id:
                raise HTTPException(status_code=403, detail="Not authorized")

            update_fields = []
            values = []
            now = datetime.utcnow().isoformat()

            for key, value in task_data.items():
                if value is not None and key != "id":
                    if key == "status" and value not in TASK_STATUSES:
                        raise HTTPException(
                            status_code=422,
                            detail=f"Status must be one of {TASK_STATUSES}"
                        )
                    if key == "priority" and value not in TASK_PRIORITIES:
                        raise HTTPException(
                            status_code=422,
                            detail=f"Priority must be one of {TASK_PRIORITIES}"
                        )

                    update_fields.append(f"{key} = ?")
                    values.append(value)

            if update_fields:
                update_fields.append("updated_at = ?")
                values.append(now)

                # Mark completion time
                if (
                    task_data.get("status") == "done"
                    and existing["status"] != "done"
                ):
                    update_fields.append("completed_at = ?")
                    values.append(now)

                values.append(task_id)

                query = f"""
                    UPDATE tasks
                    SET {', '.join(update_fields)}
                    WHERE id = ?
                """
                cursor.execute(query, values)

            return TaskService.get_task_by_id(task_id)

    @staticmethod
    def delete_task(task_id: int):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Task not found")

            return {"message": "Task deleted successfully"}

    @staticmethod
    def _check_overdue(task: dict) -> bool:

        # Completed tasks are never overdue - FIXED: Check for 'done' not 'completed'
        if task.get("status") == "done":
            return False
        
        # No due date means not overdue
        due_date_str = task.get("due_date")
        if not due_date_str:
            return False
        
        try:
            # Parse the due date string
            from datetime import datetime
            
            # Handle both ISO format with and without timezone
            if due_date_str.endswith('Z'):
                due_date_str = due_date_str[:-1]
            
            # Remove timezone info if present (e.g., +00:00)
            if '+' in due_date_str:
                due_date_str = due_date_str.split('+')[0]
            
            # Try to parse the date
            try:
                # Try ISO format first
                due_date = datetime.fromisoformat(due_date_str)
            except:
                # If fromisoformat fails, try parsing just the date part
                if 'T' in due_date_str:
                    date_part = due_date_str.split('T')[0]
                    due_date = datetime.strptime(date_part, '%Y-%m-%d')
                else:
                    due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
            
            # Get current UTC time
            now = datetime.utcnow()
            
            # Task is overdue if current time > due date
            is_overdue = now > due_date
            
            return is_overdue
            
        except Exception as e:
            # If date parsing fails, assume not overdue
            print(f"Error checking overdue status: {str(e)}")
            print(f"Due date string: {due_date_str}")
            return False