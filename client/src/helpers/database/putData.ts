import type { Ref } from 'vue';

import type { Board, List, Task } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function updateBoard(boards: Ref<Board[]>, editedBoard: Board, boardID?: string) {
  try {
    const data: { board: Board } = await apiRequest(`/v1/board/${boardID}`, 'PUT', editedBoard);

    const board = boards.value.find((board) => board.id === boardID);

    if (board) Object.assign(board, data.board);

    return { message: 'Board edited successfully' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function updateList(lists: Ref<List[]>, editedListName: string, listID: string) {
  try {
    await apiRequest(`/v1/list/${listID}`, 'PUT', {
      name: editedListName,
    });

    const list = lists.value.find((list) => list.id === listID);

    if (list) list.name = editedListName;

    return { message: 'List edited successfully' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}

export async function updateTask(tasks: Ref<Task[]>, editedTaskDetails: Task, taskID: string) {
  try {
    const data: Task = await apiRequest(`/v1/task/${taskID}/edit`, 'PUT', editedTaskDetails);

    const task = tasks.value.find((task) => task.id === taskID);

    if (task) Object.assign(task, data);

    return { message: 'Task edited successfully' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
