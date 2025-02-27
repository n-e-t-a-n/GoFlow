import type { Ref } from 'vue';

import type { Board, UserBoard } from '@/types';

export async function getBoards(board: Ref<Board[]>) {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/board`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch boards');
    }

    board.value = data;
  } catch (error) {
    console.error('Error fetching boards:', error);
  }
}

export async function getMembers(members: Ref<UserBoard[]>, boardID: string) {
  try {
    const token = localStorage.getItem('token');

    if (!token) return;

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    const data = await response.json();
    members.value = data;
  } catch (error) {
    console.error('Error fetching members:', error);
  }
}
