import type { Ref } from 'vue';

import type { Board, List, Task } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function updateBoard(
  name: Ref<string>,
  description: Ref<string>,
  editedName: Ref<string>,
  editedDescription: Ref<string>,
  boardID?: string,
) {
  try {
    const data: { board: Board } = await apiRequest(`/v1/board/${boardID}`, 'PUT', {
      name: editedName.value,
      description: editedDescription.value,
    });

    name.value = data.board.name;
    description.value = data.board.description;
  } catch (error) {
    console.error('Error updating board details: ', error);
  }
}

export async function updateList(lists: Ref<List[]>, newListName: Ref<string>, listID: string) {
  try {
    await apiRequest(`/v1/list/${listID}`, 'PUT', {
      name: newListName.value,
    });

    const list = lists.value.find((list) => list.id === listID);

    if (list) list.name = newListName.value;
  } catch (error) {
    console.error('Error changing list title: ', error);
  }
}

export async function updateTask(
  tasks: Ref<Task[]>,
  taskID: string,
  updatedTaskDetails: Ref<Task>,
) {
  try {
    const data: Task = await apiRequest(
      `/v1/task/${updatedTaskDetails.value.id}/edit`,
      'PUT',
      updatedTaskDetails.value,
    );

    const task = tasks.value.find((task) => task.id === taskID);

    if (task) Object.assign(task, data);

    updatedTaskDetails.value = data;
  } catch (error) {
    console.error('Error occurred while editing task: ', error);
  }
}
