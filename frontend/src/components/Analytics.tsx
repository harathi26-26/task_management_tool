import React from 'react';
import { Analytics as AnalyticsType } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
 
interface AnalyticsProps {
  analytics: AnalyticsType;
}
 
const Analytics: React.FC<AnalyticsProps> = ({ analytics }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
 
  const statusData = Object.entries(analytics.status_breakdown).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
  }));
 
  const priorityData = Object.entries(analytics.priority_breakdown).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));
 
  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{analytics.total_tasks}</p>
        </div>
        
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value completed">{analytics.completed_tasks}</p>
        </div>
        
        <div className="stat-card">
          <h3>Overdue</h3>
          <p className="stat-value overdue">{analytics.overdue_tasks}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{analytics.total_users}</p>
        </div>
      </div>
      
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
                    width: `${(user.task_count / analytics.total_tasks) * 100}%`,
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
 

