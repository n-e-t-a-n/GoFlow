import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function createBoard(boards: Ref<Board[]>, newBoard: Ref<Board>) {
  try {
    const data: { board: Board } = await apiRequest('/v1/board', 'POST', newBoard.value);

    boards.value.push({ ...data.board, role: 'admin' });

    return { message: 'Board successfully created' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function createList(lists: Ref<List[]>, newList: Ref<List>) {
  try {
    const data: { taskList: List } = await apiRequest('/v1/list', 'POST', newList.value);

    lists.value.push(data.taskList);

    return { message: 'List successfully created' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function createMember(
  email: Ref<string>,
  boardID: Ref<string>,
  isAdmin: Ref<boolean>,
  members: Ref<UserBoard[]>,
) {
  try {
    const data: UserBoard = await apiRequest(`/v1/user-board/${boardID.value}`, 'POST', {
      email: email.value,
      role: isAdmin.value ? 'admin' : 'member',
    });

    members.value.push({ ...data, email: email.value });

    return { message: 'Successfully added member to the board' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function createTask(newTask: Ref<Task>, tasks: Ref<Task[]>) {
  try {
    const data: Task = await apiRequest('/v1/task', 'POST', newTask.value);

    tasks.value.push(data);

    return { message: 'Successfully added task' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
