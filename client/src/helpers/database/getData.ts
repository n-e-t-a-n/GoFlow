import type { Ref } from 'vue';

import type { Board, List, Task, UserBoard } from '@/types';

export async function getBoards(board: Ref<Board[]>) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/board`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Failed to fetch boards');

    board.value = data;
  } catch (error) {
    console.error('Error fetching boards: ', error);
  }
}

export async function getMembers(members: Ref<UserBoard[]>, boardID: Ref<string>) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error('Failed to fetch members');

    const data = await response.json();
    members.value = data;
  } catch (error) {
    console.error('Error fetching members: ', error);
  }
}

export async function getTasks(
  tasks: Ref<Task[]>,
  lists: Ref<List[]>,
  userIsAdmin: Ref<boolean>,
  boardID: Ref<string>,
) {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('User is not logged in');

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/task/${boardID.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch tasks and lists');

    const data = await response.json();

    lists.value = data.lists;
    tasks.value = data.tasks;

    userIsAdmin.value = data.isAdmin;
  } catch (error) {
    console.error('Error fetching board data: ', error);
  }
}
