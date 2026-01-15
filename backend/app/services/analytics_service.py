from app.database import get_db
from datetime import datetime

class AnalyticsService:
    @staticmethod
    def get_analytics():
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Get all tasks with full details
            cursor.execute("""
                SELECT t.*, u.name as assigned_user_name
                FROM tasks t
                LEFT JOIN users u ON t.assigned_to = u.id
                ORDER BY t.created_at DESC
            """)
            all_tasks_raw = cursor.fetchall()
            all_tasks = [dict(row) for row in all_tasks_raw]
            
            # Add is_overdue flag to each task
            now = datetime.utcnow()
            for task in all_tasks:
                task['is_overdue'] = AnalyticsService._check_overdue(task, now)
            
            # Print debug info
            print("\n" + "="*60)
            print("ANALYTICS CALCULATION")
            print("="*60)
            print(f"Current UTC Time: {now}")
            print(f"Total tasks in DB: {len(all_tasks)}")
            
            # Initialize empty lists
            completed_tasks = []
            overdue_tasks = []
            todo_tasks = []
            in_progress_tasks = []
            high_priority_tasks = []
            medium_priority_tasks = []
            low_priority_tasks = []
            
            # Categorize tasks - FIXED: Check for 'done' not 'completed'
            for task in all_tasks:
                print(f"\nProcessing task: {task['title']}")
                print(f"  Status: {task['status']}")
                print(f"  Priority: {task['priority']}")
                print(f"  Is Overdue: {task['is_overdue']}")
                
                # By status - CRITICAL FIX: Use 'done' not 'completed'
                if task['status'] == 'done':
                    completed_tasks.append(task)
                    print(f"  ✓ Added to completed_tasks")
                elif task['status'] == 'todo':
                    todo_tasks.append(task)
                    print(f"  ✓ Added to todo_tasks")
                elif task['status'] == 'in-progress':
                    in_progress_tasks.append(task)
                    print(f"  ✓ Added to in_progress_tasks")
                
                # By overdue (only non-completed tasks)
                if task['is_overdue'] and task['status'] != 'done':
                    overdue_tasks.append(task)
                    print(f"  ✓ Added to overdue_tasks")
                
                # By priority (only pending tasks)
                if task['status'] != 'done':
                    if task['priority'] == 'high':
                        high_priority_tasks.append(task)
                    elif task['priority'] == 'medium':
                        medium_priority_tasks.append(task)
                    elif task['priority'] == 'low':
                        low_priority_tasks.append(task)
            
            # Print categorization results
            print(f"\n{'='*60}")
            print(f"CATEGORIZATION RESULTS:")
            print(f"{'='*60}")
            print(f"  Total: {len(all_tasks)} tasks")
            print(f"  Completed: {len(completed_tasks)} tasks")
            for task in completed_tasks:
                print(f"    - {task['title']} (Status: {task['status']})")
            print(f"  Overdue: {len(overdue_tasks)} tasks")
            print(f"  To Do: {len(todo_tasks)} tasks")
            print(f"  In Progress: {len(in_progress_tasks)} tasks")
            print(f"  High Priority: {len(high_priority_tasks)} tasks")
            print(f"  Medium Priority: {len(medium_priority_tasks)} tasks")
            print(f"  Low Priority: {len(low_priority_tasks)} tasks")
            print("="*60 + "\n")
            
            # Total counts
            total_tasks = len(all_tasks)
            
            cursor.execute("SELECT COUNT(*) as count FROM users")
            total_users = cursor.fetchone()["count"]
            
            # Status breakdown
            cursor.execute("""
                SELECT status, COUNT(*) as count
                FROM tasks
                GROUP BY status
            """)
            status_breakdown = {
                row["status"]: row["count"]
                for row in cursor.fetchall()
            }
            
            # Priority breakdown
            cursor.execute("""
                SELECT priority, COUNT(*) as count
                FROM tasks
                GROUP BY priority
            """)
            priority_breakdown = {
                row["priority"]: row["count"]
                for row in cursor.fetchall()
            }
            
            # User distribution
            cursor.execute("""
                SELECT u.id, u.name, COUNT(t.id) as task_count
                FROM users u
                LEFT JOIN tasks t ON u.id = t.assigned_to
                GROUP BY u.id, u.name
            """)
            user_distribution = []
            for row in cursor.fetchall():
                user_dict = dict(row)
                user_tasks = [t for t in all_tasks if t.get('assigned_to') == user_dict['id']]
                user_dict['tasks'] = user_tasks
                user_distribution.append(user_dict)
            
            result = {
                "total_tasks": total_tasks,
                "total_users": total_users,
                "completed_tasks": len(completed_tasks),
                "overdue_tasks": len(overdue_tasks),
                "status_breakdown": status_breakdown,
                "priority_breakdown": priority_breakdown,
                "user_distribution": user_distribution,
                # IMPORTANT: Task lists for tooltips - always return arrays
                "all_tasks_list": all_tasks,
                "completed_tasks_list": completed_tasks,
                "overdue_tasks_list": overdue_tasks,
                "todo_tasks_list": todo_tasks,
                "in_progress_tasks_list": in_progress_tasks,
                "high_priority_tasks_list": high_priority_tasks,
                "medium_priority_tasks_list": medium_priority_tasks,
                "low_priority_tasks_list": low_priority_tasks
            }
            
            # Debug: Print what we're returning
            print("FINAL RESULT:")
            print(f"  all_tasks_list: {len(result['all_tasks_list'])} tasks")
            print(f"  completed_tasks_list: {len(result['completed_tasks_list'])} tasks")
            print(f"  overdue_tasks_list: {len(result['overdue_tasks_list'])} tasks")
            print(f"  todo_tasks_list: {len(result['todo_tasks_list'])} tasks")
            print(f"  in_progress_tasks_list: {len(result['in_progress_tasks_list'])} tasks")
            print("\n")
            
            return result
    
    @staticmethod
    def _check_overdue(task: dict, now: datetime = None) -> bool:
        """Check if a task is overdue"""
        if now is None:
            now = datetime.utcnow()
            
        # Completed tasks are never overdue - FIXED: Check for 'done'
        if task.get("status") == "done":
            return False
        
        # No due date means not overdue
        due_date_str = task.get("due_date")
        if not due_date_str:
            return False
        
        try:
            # Parse the due date
            if due_date_str.endswith('Z'):
                due_date_str = due_date_str[:-1]
            
            # Remove timezone if present
            if '+' in due_date_str:
                due_date_str = due_date_str.split('+')[0]
            
            try:
                due_date = datetime.fromisoformat(due_date_str)
            except:
                if 'T' in due_date_str:
                    date_part = due_date_str.split('T')[0]
                    due_date = datetime.strptime(date_part, '%Y-%m-%d')
                else:
                    due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
            
            # Task is overdue if current time > due date
            is_overdue = now > due_date
            
            print(f"  Overdue check for '{task.get('title')}':")
            print(f"    Due: {due_date}, Now: {now}, Overdue: {is_overdue}")
            
            return is_overdue
            
        except Exception as e:
            print(f"  Error checking overdue status: {str(e)}")
            return False