from app.database import get_db
from datetime import datetime, timedelta
 
class AnalyticsService:
    @staticmethod
    def get_analytics():
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Total counts
            cursor.execute("SELECT COUNT(*) as count FROM tasks")
            total_tasks = cursor.fetchone()["count"]
            
            cursor.execute("SELECT COUNT(*) as count FROM users")
            total_users = cursor.fetchone()["count"]
            
            # Status breakdown
            cursor.execute("""
                SELECT status, COUNT(*) as count
                FROM tasks
                GROUP BY status
            """)
            status_breakdown = {row["status"]: row["count"] for row in cursor.fetchall()}
            
            # Priority breakdown
            cursor.execute("""
                SELECT priority, COUNT(*) as count
                FROM tasks
                GROUP BY priority
            """)
            priority_breakdown = {row["priority"]: row["count"] for row in cursor.fetchall()}
            
            # Overdue tasks
            now = datetime.utcnow().isoformat()
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM tasks
                WHERE due_date < ? AND status != 'completed'
            """, (now,))
            overdue_tasks = cursor.fetchone()["count"]
            
            # Completed tasks
            completed_tasks = status_breakdown.get("completed", 0)
            
            # User task distribution
            cursor.execute("""
                SELECT u.name, COUNT(t.id) as task_count
                FROM users u
                LEFT JOIN tasks t ON u.id = t.assigned_to
                GROUP BY u.id, u.name
            """)
            user_distribution = [dict(row) for row in cursor.fetchall()]
            
            return {
                "total_tasks": total_tasks,
                "total_users": total_users,
                "completed_tasks": completed_tasks,
                "overdue_tasks": overdue_tasks,
                "status_breakdown": status_breakdown,
                "priority_breakdown": priority_breakdown,
                "user_distribution": user_distribution
            }