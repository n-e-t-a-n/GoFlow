import type { Ref } from 'vue';

import type { Board, BoardData, List, Task, UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function getBoards(board: Ref<Board[]>) {
  try {
    const data: Board[] = await apiRequest('/v1/board');

    board.value = data;
  } catch (error) {
    console.error('Error fetching boards: ', error);
  }
}

export async function getMembers(members: Ref<UserBoard[]>, boardID: Ref<string>) {
  try {
    const data: UserBoard[] = await apiRequest(`/v1/user-board/${boardID.value}`);

    members.value = data;
  } catch (error) {
    console.error('Error fetching members: ', error);
  }
}

export async function getTasks(
  tasks: Ref<Task[]>,
  lists: Ref<List[]>,
  userIsAdmin: Ref<boolean>,
  boardID: Ref<string>,
) {
  try {
    const data: BoardData = await apiRequest(`/v1/task/${boardID.value}`);

    lists.value = data.lists as List[];
    tasks.value = data.tasks as Task[];

    userIsAdmin.value = data.isAdmin as boolean;
  } catch (error) {
    console.error('Error fetching board data: ', error);
  }
}
