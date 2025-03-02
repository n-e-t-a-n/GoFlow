import type { Ref } from 'vue';

import type { List, Task } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function updateBoard(
  name: Ref<string>,
  description: Ref<string>,
  editedName: Ref<string>,
  editedDescription: Ref<string>,
  isUpdateBoardModalOpen: Ref<boolean>,
  boardID?: string,
) {
  try {
    const response: Response = await apiRequest(`/v1/board/${boardID}`, 'PUT', {
      name: editedName.value,
      description: editedDescription.value,
    });

    if (!response.ok) throw new Error('Failed to update board details');

    const updatedBoard = await response.json();

    name.value = updatedBoard.board.name;
    description.value = updatedBoard.board.description;

    isUpdateBoardModalOpen.value = false;
  } catch (error) {
    console.error('Error updating board details: ', error);
  }
}

export async function updateList(
  lists: Ref<List[]>,
  newListName: Ref<string>,
  isUpdateListModalOpen: Ref<boolean>,
  listID: string,
) {
  try {
    const response: Response = await apiRequest(`/v1/list/${listID}`, 'PUT', {
      name: newListName.value,
    });

    if (!response.ok) throw new Error('Failed to edit list title');

    isUpdateListModalOpen.value = false;
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
  handleEditTaskModal: () => void,
) {
  try {
    const response: Response = await apiRequest(
      `/v1/task/${updatedTaskDetails.value.id}/edit`,
      'PUT',
      updatedTaskDetails.value,
    );

    const data = await response.json();

    if (!response.ok) throw new Error('Failed to edit task');

    const task = tasks.value.find((task) => task.id === taskID);

    if (task) Object.assign(task, data);

    updatedTaskDetails.value = data;

    handleEditTaskModal();
  } catch (error) {
    console.error('Error occurred while editing task: ', error);
  }
}
