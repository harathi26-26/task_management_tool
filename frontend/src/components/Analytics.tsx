import React, { useState, useEffect } from 'react';
import { Analytics as AnalyticsType } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TaskTooltip from './TaskTooltip';
import '../styles/Dashboard.css';
import '../styles/Tooltip.css';
 
interface AnalyticsProps {
  analytics: AnalyticsType;
  onRefresh?: () => void;
}
 
const Analytics: React.FC<AnalyticsProps> = ({ analytics, onRefresh }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
 
  // Debug: Log analytics data when it changes
  useEffect(() => {
    console.log("ANALYTICS STATE CHECK")
    console.log('Completed tasks list:', analytics.completed_tasks_list, {
      total_tasks: analytics.total_tasks,
      completed_tasks: analytics.completed_tasks,
      overdue_tasks: analytics.overdue_tasks,
      all_tasks_list_length: analytics.all_tasks_list?.length || 0,
      completed_tasks_list_length: analytics.completed_tasks_list?.length || 0,
      overdue_tasks_list_length: analytics.overdue_tasks_list?.length || 0,
      completed_tasks_list: analytics.completed_tasks_list
    });
  }, [analytics]);
 
  const statusData = Object.entries(analytics.status_breakdown).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
  }));
 
  const priorityData = Object.entries(analytics.priority_breakdown).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));
 
  const handleMouseEnter = (cardName: string, event: React.MouseEvent) => {
    console.log(`Mouse entered card: ${cardName}`);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setHoveredCard(cardName);
  };
 
  const handleMouseLeave = () => {
    console.log('Mouse left card');
    setHoveredCard(null);
  };
 
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };
 
  const getTooltipContent = () => {
    if (!hoveredCard) return null;
    
    let title = '';
    let tasks: any[] = [];
    
    switch (hoveredCard) {
      case 'total':
        title = 'All Tasks';
        tasks = analytics.all_tasks_list || [];
        break;
      case 'completed':
        title = 'Completed Tasks';
        tasks = analytics.completed_tasks_list || [];
        break;
      case 'overdue':
        title = 'Overdue Tasks';
        tasks = analytics.overdue_tasks_list || [];
        break;
      case 'users':
        return null;
      default:
        return null;
    }
    
    console.log('Tooltip content for', hoveredCard, ':', { title, taskCount: tasks.length, tasks });
    
    return { title, tasks };
  };

  const tooltipContent = getTooltipContent();

 
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <button
          onClick={handleRefresh}
          className="btn-refresh"
          disabled={isRefreshing}
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>
      
      <div className="stats-grid">
        <div
          className="stat-card stat-card-hoverable"
          onMouseEnter={(e) => handleMouseEnter('total', e)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>Total Tasks</h3>
          <p className="stat-value">{analytics.total_tasks}</p>
          <div className="stat-card-hover-hint">
            Hover for details ({analytics.all_tasks_list?.length || 0} tasks)
          </div>
        </div>
        
        <div
          className="stat-card stat-card-hoverable"
          onMouseEnter={(e) => handleMouseEnter('completed', e)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>Completed</h3>
          <p className="stat-value completed">{analytics.completed_tasks}</p>
          <div className="stat-card-hover-hint">
            Hover for details ({analytics.completed_tasks_list?.length || 0} tasks)
          </div>
        </div>
        
        <div
          className="stat-card stat-card-hoverable"
          onMouseEnter={(e) => handleMouseEnter('overdue', e)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>Overdue</h3>
          <p className="stat-value overdue">{analytics.overdue_tasks}</p>
          <div className="stat-card-hover-hint">
            Hover for details ({analytics.overdue_tasks_list?.length || 0} tasks)
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{analytics.total_users}</p>
        </div>
      </div>
 
      {/* Tooltip Overlay */}
      {hoveredCard && tooltipContent && (
        <div
          className="tooltip-overlay"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-20px',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <TaskTooltip
            title={tooltipContent.title}
            tasks={tooltipContent.tasks}
          />
        </div>
      )}
      
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-card">
          <h3>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="user-distribution">
        <h3>Task Distribution by User</h3>
        <div className="user-list">
          {analytics.user_distribution.map((user, index) => (
            <div key={index} className="user-item">
              <span className="user-name">{user.name}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${analytics.total_tasks > 0 ? (user.task_count / analytics.total_tasks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="task-count">{user.task_count} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default Analytics;