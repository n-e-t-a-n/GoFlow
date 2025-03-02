import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function getBoards(board: Ref<Board[]>) {
  try {
    const response: Response = await apiRequest('/v1/board');

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Failed to fetch boards');

    board.value = data;
  } catch (error) {
    console.error('Error fetching boards: ', error);
  }
}

export async function getMembers(members: Ref<UserBoard[]>, boardID: Ref<string>) {
  try {
    const response: Response = await apiRequest(`/v1/user-board/${boardID.value}`);

    if (!response.ok) throw new Error('Failed to fetch members');

    const data = await response.json();
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
    const response: Response = await apiRequest(`/v1/task/${boardID.value}`);

    if (!response.ok) throw new Error('Failed to fetch tasks and lists');

    const data = await response.json();

    lists.value = data.lists;
    tasks.value = data.tasks;

    userIsAdmin.value = data.isAdmin;
  } catch (error) {
    console.error('Error fetching board data: ', error);
  }
}
