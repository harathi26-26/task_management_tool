import React, { useState } from 'react';
import { Task } from '../types';
import '../styles/Form.css';
 
interface UserTaskEditModalProps {
  task: Task;
  onUpdateStatus: (newStatus: string) => void;
  onCancel: () => void;
}
 
const UserTaskEditModal: React.FC<UserTaskEditModalProps> = ({
  task,
  onUpdateStatus,
  onCancel,
}) => {
  const [status, setStatus] = useState(task.status);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(status);
  };
 
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#4caf50';
      default: return '#999';
    }
  };
 
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
 
  return (
    <div className="modal-overlay">
      <div className="modal-content user-edit-modal">
        <h2>Update Task Status</h2>
        
        <div className="task-details-view">
          <div className="detail-row">
            <label>Task Title:</label>
            <p className="detail-value">{task.title}</p>
          </div>
          
          {task.description && (
            <div className="detail-row">
              <label>Description:</label>
              <p className="detail-value">{task.description}</p>
            </div>
          )}
          
          <div className="detail-row">
            <label>Priority:</label>
            <span 
              className="priority-badge-large"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority.toUpperCase()}
            </span>
          </div>
          
          <div className="detail-row">
            <label>Due Date:</label>
            <p className="detail-value">📅 {formatDate(task.due_date)}</p>
          </div>
          
          {task.is_overdue && task.status !== 'done' && (
            <div className="overdue-warning">
              ⚠️ This task is overdue!
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="status-update-form">
          <div className="form-group">
            <label>Update Status:</label>
            <div className="status-options">
              <label className={`status-option ${status === 'todo' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="todo"
                  checked={status === 'todo'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="status-card">
                  <div className="status-icon">📋</div>
                  <div className="status-text">To Do</div>
                </div>
              </label>
              
              <label className={`status-option ${status === 'in-progress' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="in-progress"
                  checked={status === 'in-progress'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="status-card">
                  <div className="status-icon">⚡</div>
                  <div className="status-text">In Progress</div>
                </div>
              </label>
              
              <label className={`status-option ${status === 'done' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="completed"
                  checked={status === 'done'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="status-card">
                  <div className="status-icon">✅</div>
                  <div className="status-text">Completed</div>
                </div>
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default UserTaskEditModal;
 