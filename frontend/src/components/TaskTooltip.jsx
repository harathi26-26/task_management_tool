import React from 'react';
import '../styles/Tooltip.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_user_name: string;
  is_overdue: boolean;
}

interface TaskTooltipProps {
  title: string;
  tasks: Task[];
}

const TaskTooltip: React.FC<TaskTooltipProps> = ({ title, tasks }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done': return '✓ Done';
      case 'in-progress': return '⏳ In Progress';
      case 'todo': return '📋 To Do';
      default: return status;
    }
  };

  console.log('TaskTooltip rendering:', { title, taskCount: tasks.length, tasks });

  return (
    <div className="task-tooltip-container">
      <div className="tooltip-header">
        <h4>{title}</h4>
        <span className="task-count-badge">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="tooltip-body">
        {tasks.length === 0 ? (
          <div className="no-tasks-message">
            <p>No tasks in this category</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-item ${task.is_overdue ? 'overdue' : ''}`}>
                <div className="task-item-header">
                  <span className="task-title">{task.title}</span>
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                
                {/* <p className="task-description">{task.description}</p> */}
                
                {/* <div className="task-meta">
                  <span className="status-badge">{getStatusBadge(task.status)}</span>
                  
                </div>
                
                {task.is_overdue && task.status !== 'done' && (
                  <div className="overdue-warning">⚠️ Overdue</div>
                )} */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskTooltip;