import type { List, Task } from '@/types';
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

  if (!token) throw new Error('User is not logged in');

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
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

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
    const token = localStorage.getItem('token');

    if (!token) throw new Error('User is not logged in');

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

    if (!response.ok) throw new Error('Failed to edit task');

    const task = tasks.value.find((task) => task.id === taskID);

    if (task) {
      task.assigned_user_id = data.assigned_user_id;
      task.title = data.title;
      task.description = data.description;
      task.status = data.status;
      task.due_date = data.due_date;
      task.priority = data.priority;
      task.task_list_id = data.task_list_id;
      task.board_id = data.board_id;
    }

    updatedTaskDetails.value = data;

    handleEditTaskModal();
  } catch (error) {
    console.error('Error occurred while editing task: ', error);
  }
}
