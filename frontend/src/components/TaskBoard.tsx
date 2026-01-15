import React from 'react';
import { Task } from '../types';
import DraggableTaskCard from './DraggableTaskCard';
import '../styles/TaskBoard.css';
 
interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onDrop: (taskId: number, newStatus: string) => void;
  isDraggable: boolean;
}
 
const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onDrop,
  isDraggable,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };
 
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };
 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== status) {
      onDrop(taskId, status);
    }
  };
 
  return (
    <div
      className="task-column"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h2>{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="tasks-container">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            isDraggable={isDraggable}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="empty-column">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
};
 
export default TaskColumn;
