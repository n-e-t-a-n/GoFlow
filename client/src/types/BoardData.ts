import type { Task } from './Task';
import type { List } from './List';

export interface BoardData {
  tasks: Task[];
  lists: List[];
}
