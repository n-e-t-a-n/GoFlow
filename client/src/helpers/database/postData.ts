import type { Ref } from 'vue';

import type { Board, List, Task } from '@/types';

export async function createBoard(
  boards: Ref<Board[]>,
  newBoard: Ref<Board>,
  isModalVisible: Ref<boolean>,
) {
  const token = localStorage.getItem('token');

  if (!token || !newBoard.value.name) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/board`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBoard.value),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create board.');
    }

    boards.value.push({
      ...data.board,
      role: 'admin',
    });
    isModalVisible.value = false;
  } catch (error) {
    console.error('Error creating board:', error);
  }
}

export async function createList(
  lists: Ref<List[]>,
  newListTitle: Ref<string>,
  boardID: Ref<string>,
  isCreateListModalOpen: Ref<boolean>,
) {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/list/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        board_id: boardID.value,
        name: newListTitle.value,
        priority: 100,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to add new board.');
    }

    lists.value.push(data.taskList);
    isCreateListModalOpen.value = false;
    newListTitle.value = '';
  } catch (error) {
    console.error('Error adding new board:', error);
  }
}

export async function createMember(
  boardID: Ref<string>,
  newMemberEmail: Ref<string>,
  isAdmin: Ref<boolean>,
  isCreateMemberModalOpen: Ref<boolean>,
) {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID.value}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          board_id: boardID.value,
          email: newMemberEmail.value,
          role: isAdmin.value ? 'admin' : 'member',
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to add member');
    }
    console.log('Member added:', data);
    isCreateMemberModalOpen.value = false;
    newMemberEmail.value = '';
  } catch (error) {
    console.error('Error adding member:', error);
  }
}

export async function createTask(
  newTask: Ref<Task>,
  isCreateTaskModalOpen: Ref<boolean>,
  filteredTasks: Ref<Task[]>,
) {
  const token = localStorage.getItem('token');

  console.log(newTask.value);

  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTask.value),
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to create new task');
    }

    isCreateTaskModalOpen.value = false;
    filteredTasks.value.push(data);

  } catch (error) {
    console.error('Error creating new task:', error);
  }
}
