import type { Ref } from 'vue';

import type { Board, BoardData, List, Task, UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function getBoards(board: Ref<Board[]>) {
  try {
    const data: Board[] = await apiRequest('/v1/board');

    board.value = data;
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function getMembers(members: Ref<UserBoard[]>, boardID: string) {
  try {
    const data: UserBoard[] = await apiRequest(`/v1/user-board/${boardID}`);

    members.value = data;
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function getTasks(
  tasks: Ref<Task[]>,
  lists: Ref<List[]>,
  userIsAdmin: Ref<boolean>,
  boardID: string,
) {
  try {
    const data: BoardData = await apiRequest(`/v1/task/${boardID}`);

    lists.value = data.lists as List[];
    tasks.value = data.tasks as Task[];

    userIsAdmin.value = data.isAdmin as boolean;
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
