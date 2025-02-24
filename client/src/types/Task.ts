export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'top';

export interface Task {
  id: string;
  board_id: string;
  task_list_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_user_id: string | null;
  due_date: string | null;
  priority: TaskPriority;
  list_name?: string;
}
