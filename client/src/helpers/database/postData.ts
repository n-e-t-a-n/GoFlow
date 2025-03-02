import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

export async function createBoard(
  boards: Ref<Board[]>,
  newBoard: Ref<Board>,
  handleCreateBoardModal: () => void,
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

    boards.value.push({ ...data.board, role: 'admin' });

    handleCreateBoardModal();
  } catch (error) {
    console.error('Error creating board: ', error);
  }
}

export async function createList(
  lists: Ref<List[]>,
  newList: Ref<List>,
  handleCreateListModal: () => void,
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
      body: JSON.stringify(newList.value),
    });

    const data = await response.json();

    if (!response.ok) throw new Error('Failed to add new board.');

    lists.value.push(data.taskList);

    handleCreateListModal();
  } catch (error) {
    console.error('Error adding new board: ', error);
  }
}

export async function createMember(
  email: Ref<string>,
  boardID: Ref<string>,
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
          email: email.value,
          role: isAdmin.value ? 'admin' : 'member',
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) throw new Error('Failed to add member');

    members.value.push({ ...data.member, name: data.name, email: email });

    handleCreateMemberModal();
  } catch (error) {
    console.error('Error adding member: ', error);
  }
}

export async function createTask(
  newTask: Ref<Task>,
  tasks: Ref<Task[]>,
  handleCreateTaskModal: () => void,
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

    handleCreateTaskModal();

    tasks.value.push(data);
  } catch (error) {
    console.error('Error creating new task: ', error);
  }
}
