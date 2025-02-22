export type UserBoardRole = 'member' | 'admin';

export interface UserBoard {
  user_id: string; 
  board_id: string; 
  role: UserBoardRole;
  created_at: string; 
  updated_at: string;
}