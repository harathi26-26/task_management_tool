import axios from 'axios';
import { Task, User, Analytics } from '../types';

/* ================================
   BASE CONFIG
================================ */

const API_BASE_URL = 'http://127.0.0.1:8080';

/**
 * Axios instance for JSON-based APIs
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================================
   JWT INTERCEPTOR
================================ */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================================
   AUTH API
================================ */

export const authAPI = {
  /**
   * Register user (JSON)
   */
  register: async (
    name: string,
    email: string,
    password: string,
    role: string = 'user'
  ) => {
    const response = await api.post('/api/auth/register', {
      name,
      email,
      password,
      role,
    });

    return response.data;
  },

  /**
   * Login user (OAuth2 form-data)
   * IMPORTANT: FastAPI expects `username`, not `email`
   */
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  },
};

/* ================================
   ADMIN API
================================ */

export const adminAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/admin/tasks');
    return response.data;
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    const response = await api.post('/api/admin/tasks', taskData);
    return response.data;
  },

  updateTask: async (
    taskId: number,
    taskData: Partial<Task>
  ): Promise<Task> => {
    const response = await api.put(`/api/admin/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/api/admin/tasks/${taskId}`);
  },

  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get('/api/admin/analytics');
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },
};

/* ================================
   USER API
================================ */

export const userAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/user/tasks');
    return response.data;
  },

  updateTask: async (
    taskId: number,
    taskData: Partial<Task>
  ): Promise<Task> => {
    const response = await api.put(`/api/user/tasks/${taskId}`, taskData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
};

/* ================================
   EXPORT DEFAULT
================================ */

export default api;
