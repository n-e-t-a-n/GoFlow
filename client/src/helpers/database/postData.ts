import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function createBoard(boards: Ref<Board[]>, newBoard: Ref<Board>) {
  try {
    const data: { board: Board } = await apiRequest('/v1/board', 'POST', newBoard.value);

    boards.value.push({ ...data.board, role: 'admin' });
  } catch (error) {
    console.error('Error creating board: ', error);
  }
}

export async function createList(lists: Ref<List[]>, newList: Ref<List>) {
  try {
    const data: { taskList: List } = await apiRequest('/v1/list', 'POST', newList.value);

    lists.value.push(data.taskList);
  } catch (error) {
    console.error('Error adding new board: ', error);
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
  } catch (error) {
    console.error('Error adding member: ', error);
  }
}

export async function createTask(newTask: Ref<Task>, tasks: Ref<Task[]>) {
  try {
    const data: Task = await apiRequest('/v1/task', 'POST', newTask.value);

    tasks.value.push(data);
  } catch (error) {
    console.error('Error creating new task: ', error);
  }
}
