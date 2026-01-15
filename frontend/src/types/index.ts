// Type declarations for CSS modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css';

// Rest of your existing types...
export interface User {
  id: number;
  email: string;
  username: string;
  is_admin: boolean;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to_id?: number;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
