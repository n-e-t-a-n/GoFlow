import type { Ref } from 'vue';

import type { Board } from '@/types';

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
