import React from 'react';
import { Task } from '../types';
import UserTaskCard from './UserTaskCard';
import '../styles/TaskBoard.css';
 
interface UserTaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
}
 
const UserTaskBoard: React.FC<UserTaskBoardProps> = ({
  tasks,
  onEditTask,
  onStatusChange,
}) => {
  const columns = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Completed', status: 'done' },
  ];
 
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };
 
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };
 
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };
 
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
  };
 
  return (
    <div className="task-board">
      {columns.map((column) => (
        <div
          key={column.status}
          className="task-column"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          <div className="column-header">
            <h2>{column.title}</h2>
            <span className="task-count">{getTasksByStatus(column.status).length}</span>
          </div>
          
          <div className="tasks-container">
            {getTasksByStatus(column.status).map((task) => (
              <UserTaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
              />
            ))}
            
            {getTasksByStatus(column.status).length === 0 && (
              <div className="empty-column">
                No tasks in this column
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
 
export default UserTaskBoard;
