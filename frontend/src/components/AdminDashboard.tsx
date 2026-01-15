import React, { useState, useEffect } from 'react';
import { Task, User, Analytics as AnalyticsType } from '../types';
import { adminAPI } from '../services/api';
import { authService } from '../services/auth';
import TaskBoard from './TaskBoard';
import TaskForm from './TaskForm';
import Analytics from './Analytics';
import TaskAssignmentView from './TaskAssignmentView';
import '../styles/Dashboard.css';
 
const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAssignmentView, setShowAssignmentView] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getUser();
 
  useEffect(() => {
    loadTasks();
    loadUsers();
    loadAnalytics();
  }, []);
 
  // IMPORTANT: Reload analytics whenever showAnalytics changes
  useEffect(() => {
    if (showAnalytics) {
      console.log('Analytics view opened - refreshing data...');
      loadAnalytics();
      loadTasks(); // Also refresh tasks to get latest data
    }
  }, [showAnalytics]);
 
  const loadTasks = async () => {
    try {
      console.log('Loading tasks...');
      const data = await adminAPI.getTasks();
      console.log('Tasks loaded:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };
 
  const loadUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };
 
  const loadAnalytics = async () => {
    try {
      console.log('Loading analytics...');
      const data = await adminAPI.getAnalytics();
      console.log('Analytics loaded:', data);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };
 
  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };
 
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };
 
  const handleSubmitTask = async (taskData: Partial<Task>) => {
    setLoading(true);
    try {
      if (editingTask) {
        await adminAPI.updateTask(editingTask.id, taskData);
      } else {
        await adminAPI.createTask(taskData);
      }
      setShowTaskForm(false);
      setEditingTask(null);
      
      // Reload all data after task changes
      await Promise.all([
        loadTasks(),
        loadAnalytics()
      ]);
      
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
 
    try {
      await adminAPI.deleteTask(taskId);
      
      // Reload all data after deletion
      await Promise.all([
        loadTasks(),
        loadAnalytics()
      ]);
      
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };
 
  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await adminAPI.updateTask(taskId, { status: newStatus });
      
      // Reload all data after status change
      await Promise.all([
        loadTasks(),
        loadAnalytics()
      ]);
      
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };
 
  const handleAssignTask = async (taskId: number, userId: number | null) => {
    try {
      await adminAPI.updateTask(taskId, { assigned_to: userId });
      
      // Reload all data after assignment
      await Promise.all([
        loadTasks(),
        loadAnalytics()
      ]);
      
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task');
    }
  };
 
  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };
 
  const handleShowAnalytics = () => {
    setShowAssignmentView(false);
    setShowAnalytics(!showAnalytics);
  };
 
  const handleShowAssignmentView = () => {
    setShowAnalytics(false);
    setShowAssignmentView(!showAssignmentView);
  };
 
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            📋 Task Manager - Admin Dashboard
            <span className="admin-badge">🔑 ADMIN</span>
          </h1>
          <p>Welcome, {currentUser?.name}</p>
        </div>
        <div className="header-right">
          <button 
            onClick={handleShowAssignmentView}
            className={showAssignmentView ? "btn-primary" : "btn-secondary"}
          >
            {showAssignmentView ? '📋 Task Board' : '👥 Assign Tasks'}
          </button>
          <button 
            onClick={handleShowAnalytics}
            className="btn-secondary"
          >
            {showAnalytics ? '📋 Show Tasks' : '📊 Analytics'}
          </button>
          <button onClick={handleCreateTask} className="btn-primary">
            + Create Task
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>
 
      <main className="dashboard-main">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">Loading...</div>
          </div>
        )}
        
        {showAnalytics && analytics ? (
          <Analytics analytics={analytics} onRefresh={loadAnalytics} />
        ) : showAssignmentView ? (
          <TaskAssignmentView
            tasks={tasks}
            users={users}
            onAssignTask={handleAssignTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <TaskBoard
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            isDraggable={true}
          />
        )}
      </main>
 
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          users={users}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
 
export default AdminDashboard;
 