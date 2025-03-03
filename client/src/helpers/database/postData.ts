import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function createBoard(boards: Ref<Board[]>, newBoard: Board) {
  try {
    const data: { board: Board } = await apiRequest('/v1/board', 'POST', newBoard);

    boards.value.push({ ...data.board, role: 'admin' });

    return { message: 'Board successfully created' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function createList(lists: Ref<List[]>, newList: List) {
  try {
    const data: { taskList: List } = await apiRequest('/v1/list', 'POST', newList);

    lists.value.push(data.taskList);

    return { message: 'List successfully created' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function createMember(
  members: Ref<UserBoard[]>,
  email: string,
  boardID: string,
  isAdmin: boolean,
) {
  try {
    const data: UserBoard = await apiRequest(`/v1/user-board/${boardID}`, 'POST', {
      email: email,
      role: isAdmin ? 'admin' : 'member',
    });

    members.value.push({ ...data, email: email });

    return { message: 'Successfully added member to the board' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function createTask(tasks: Ref<Task[]>, newTask: Task) {
  try {
    const data: Task = await apiRequest('/v1/task', 'POST', newTask);

    tasks.value.push(data);

    return { message: 'Successfully added task' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
