import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

export async function createBoard(
  boards: Ref<Board[]>,
  newBoard: Ref<Board>,
  isModalVisible: Ref<boolean>,
) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

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

    if (!response.ok) throw new Error(data.message || 'Failed to create board.');

    boards.value.push({
      ...data.board,
      role: 'admin',
    });
    isModalVisible.value = false;
  } catch (error) {
    console.error('Error creating board: ', error);
  }
}

export async function createList(
  lists: Ref<List[]>,
  newListTitle: Ref<string>,
  boardID: Ref<string>,
  isCreateListModalOpen: Ref<boolean>,
) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

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

    if (!response.ok) throw new Error('Failed to add new board.');

    lists.value.push(data.taskList);
    isCreateListModalOpen.value = false;
    newListTitle.value = '';
  } catch (error) {
    console.error('Error adding new board: ', error);
  }
}

export async function createMember(
  boardID: Ref<string>,
  newMemberEmail: Ref<string>,
  isAdmin: Ref<boolean>,
  members: Ref<UserBoard[]>,
  handleCreateMemberModal: () => void,
) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

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
          email: newMemberEmail.value,
          role: isAdmin.value ? 'admin' : 'member',
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) throw new Error('Failed to add member');

    members.value.push({ ...data.member, name: data.name, email: newMemberEmail });
    handleCreateMemberModal();
  } catch (error) {
    console.error('Error adding member: ', error);
  }
}

export async function createTask(
  newTask: Ref<Task>,
  tasks: Ref<Task[]>,
  isCreateTaskModalOpen: Ref<boolean>,
) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

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

    if (!response.ok) throw new Error('Failed to create new task');

    isCreateTaskModalOpen.value = false;
    tasks.value.push(data);
  } catch (error) {
    console.error('Error creating new task: ', error);
  }
}
