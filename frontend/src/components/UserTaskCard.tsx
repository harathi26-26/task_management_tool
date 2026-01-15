import React from 'react';
import { Task } from '../types';
import '../styles/TaskCard.css';

interface UserTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const UserTaskCard: React.FC<UserTaskCardProps> = ({ task, onEdit }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id.toString());
    e.dataTransfer.setData('currentStatus', task.status);
  };

  const getCardClass = () => {
    const baseClass = 'task-card';
    
    // Order matters: Check completed first, then overdue
    if (task.status === 'done') {
      return `${baseClass} task-completed`;
    }
    
    // Check if overdue (must not be completed)
    if (task.is_overdue === true) {
      return `${baseClass} task-overdue`;
    }
    
    return baseClass;
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Debug logging
  console.log('User Task:', task.title, 'is_overdue:', task.is_overdue, 'status:', task.status, 'CSS class:', getCardClass());

  return (
    <div
      className={getCardClass()}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span
          className="priority-badge"
          style={{ backgroundColor: getPriorityColor() }}
        >
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="task-meta-item">
          <span className="meta-label">Due:</span>
          <span className="meta-value">{formatDate(task.due_date)}</span>
        </div>
      </div>
      
      {task.is_overdue && task.status !== 'done' && (
        <div className="overdue-badge">
          ⚠️ Overdue
        </div>
      )}
      
      {task.status === 'done' && (
        <div className="completed-badge">
          ✓ Completed
        </div>
      )}
      
      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="btn-edit-only">
          Update Status
        </button>
      </div>
    </div>
  );
};

export default UserTaskCard;