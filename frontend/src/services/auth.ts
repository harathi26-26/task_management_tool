import { User } from '../types';
 
export const authService = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
 