import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { userAPI } from '../services/api';
import { authService } from '../services/auth';
import UserTaskBoard from './UserTaskBoard';
import UserTaskEditModal from './UserTaskEditModal';
import '../styles/Dashboard.css';
 
const UserDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const currentUser = authService.getUser();
 
  useEffect(() => {
    loadTasks();
  }, []);
 
  const loadTasks = async () => {
    try {
      const data = await userAPI.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };
 
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };
 
  const handleUpdateStatus = async (newStatus: string) => {
    if (!editingTask) return;
 
    try {
      await userAPI.updateTask(editingTask.id, { status: newStatus });
      setShowEditModal(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };
 
  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await userAPI.updateTask(taskId, { status: newStatus });
      await loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };
 
  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };
 
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const overdue = tasks.filter(t => t.is_overdue && t.status !== 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
 
    return { total, completed, overdue, inProgress, todo };
  };
 
  const stats = getTaskStats();
 
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📋 Task Manager - User Dashboard</h1>
          <p>Welcome, {currentUser?.name}</p>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>
 
      <div className="user-stats">
        <div className="stat-card">
          <h3>My Tasks</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>To Do</h3>
          <p className="stat-value">{stats.todo}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-value">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value completed">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue</h3>
          <p className="stat-value overdue">{stats.overdue}</p>
        </div>
      </div>
 
      <main className="dashboard-main">
        <UserTaskBoard
          tasks={tasks}
          onEditTask={handleEditTask}
          onStatusChange={handleStatusChange}
        />
      </main>
 
      {showEditModal && editingTask && (
        <UserTaskEditModal
          task={editingTask}
          onUpdateStatus={handleUpdateStatus}
          onCancel={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
 
export default UserDashboard;
