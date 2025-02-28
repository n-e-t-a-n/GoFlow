import type { Task } from '@/types';
import type { Ref } from 'vue';

export async function updateBoard(
  name: Ref<string>,
  description: Ref<string>,
  editedName: Ref<string>,
  editedDescription: Ref<string>,
  isUpdateBoardModalOpen: Ref<boolean>,
  boardID?: string,
) {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/board/${boardID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editedName.value,
        description: editedDescription.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update board details');
    }

    const updatedBoard = await response.json();

    name.value = updatedBoard.board.name;
    description.value = updatedBoard.board.description;

    isUpdateBoardModalOpen.value = false;
  } catch (error) {
    console.error('Error updating board details:', error);
  }
}

export async function updateList(
  listName: Ref<string>,
  newListName: Ref<string>,
  isUpdateListModalOpen: Ref<boolean>,
  listID?: string,
) {
  const token = localStorage.getItem('token');

  if (!token || !listID) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/list/${listID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newListName.value,
      }),
    });

    if (!response.ok) {
      console.error('Failed to edit list title');
    }

    const data = await response.json();
    console.log('List title successfully edited:', data);

    isUpdateListModalOpen.value = false;
    listName.value = newListName.value;
  } catch (error) {
    console.error('Error changing list title:', error);
  }
}

export async function updateTask(
  taskDetails: Ref<Task>,
  updatedTaskDetails: Ref<Task>,
  handleEditTaskModal: () => void,
) {
  try {
    const token = localStorage.getItem('token');

    if (!token) return;

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v1/task/${updatedTaskDetails.value.id}/edit`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTaskDetails.value),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to edit task');
    }

    taskDetails.value = data;
    updatedTaskDetails.value = data;

    handleEditTaskModal();
  } catch (error) {
    console.error('Error occurred while editing task:', error);
  }
}
