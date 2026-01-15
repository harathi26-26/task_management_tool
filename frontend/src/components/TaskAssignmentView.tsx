import React from 'react';
import { Task, User } from '../types';
import '../styles/TaskAssignment.css';
 
interface TaskAssignmentViewProps {
  tasks: Task[];
  users: User[];
  onAssignTask: (taskId: number, userId: number | null) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}
 
const TaskAssignmentView: React.FC<TaskAssignmentViewProps> = ({
  tasks,
  users,
  onAssignTask,
  onEditTask,
  onDeleteTask,
}) => {
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };
 
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };
 
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };
 
  const handleDrop = (e: React.DragEvent, userId: number | null) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    onAssignTask(taskId, userId);
  };
 
  const getUnassignedTasks = () => {
    return tasks.filter(task => !task.assigned_to);
  };
 
  const getTasksByUser = (userId: number) => {
    return tasks.filter(task => task.assigned_to === userId);
  };
 
  const getTaskCardClass = (task: Task) => {
    if (task.status === 'done') return 'assignment-task-card completed';
    if (task.is_overdue) return 'assignment-task-card overdue';
    return 'assignment-task-card';
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
 
  return (
    <div className="task-assignment-container">
      <div className="assignment-section">
        <h2>📦 Unassigned Tasks</h2>
        <div 
          className="tasks-pool"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, null)}
        >
          {getUnassignedTasks().length === 0 ? (
            <div className="empty-pool">All tasks are assigned! 🎉</div>
          ) : (
            getUnassignedTasks().map(task => (
              <div
                key={task.id}
                className={getTaskCardClass(task)}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <span 
                    className="priority-dot"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  />
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <span className="task-date">📅 {formatDate(task.due_date)}</span>
                  <div className="task-actions-mini">
                    <button onClick={() => onEditTask(task)} className="btn-icon">✏️</button>
                    <button onClick={() => onDeleteTask(task.id)} className="btn-icon">🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
 
      <div className="users-section">
        <h2>👥 Team Members</h2>
        <div className="users-grid">
          {users.filter(user => user.role === 'user').map(user => (
            <div 
              key={user.id}
              className="user-card"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, user.id)}
            >
              <div className="user-header">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              
              <div className="user-stats">
                <span className="stat-badge">
                  {getTasksByUser(user.id).length} tasks
                </span>
              </div>
 
              <div className="user-tasks">
                {getTasksByUser(user.id).length === 0 ? (
                  <div className="empty-user-tasks">
                    Drop tasks here to assign
                  </div>
                ) : (
                  getTasksByUser(user.id).map(task => (
                    <div
                      key={task.id}
                      className={getTaskCardClass(task)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <div className="task-header">
                        <h4>{task.title}</h4>
                        <span 
                          className="priority-dot"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        />
                      </div>
                      <div className="task-footer">
                        <span className="task-date">📅 {formatDate(task.due_date)}</span>
                        <div className="task-actions-mini">
                          <button onClick={() => onEditTask(task)} className="btn-icon">✏️</button>
                          <button onClick={() => onDeleteTask(task.id)} className="btn-icon">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default TaskAssignmentView;
