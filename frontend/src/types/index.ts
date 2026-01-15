// Type declarations for CSS modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css';

// Rest of your existing types...
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_superuser?: boolean;
}
 
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  assigned_user_name?: string;
  is_overdue: boolean;
}
 
export interface Analytics {
  total_tasks: number;
  total_users: number;
  completed_tasks: number;
  overdue_tasks: number;
  status_breakdown: { [key: string]: number };
  priority_breakdown: { [key: string]: number };
  user_distribution: Array<{
    id: number;
    name: string;
    task_count: number;
    tasks: Task[];
  }>;
  // New: Detailed task lists
  all_tasks_list: Task[];
  completed_tasks_list: Task[];
  overdue_tasks_list: Task[];
  todo_tasks_list: Task[];
  in_progress_tasks_list: Task[];
  high_priority_tasks_list: Task[];
  medium_priority_tasks_list: Task[];
  low_priority_tasks_list: Task[];
}
 
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}