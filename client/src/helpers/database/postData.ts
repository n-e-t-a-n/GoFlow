import type { Ref } from 'vue';

import type { Board, List } from '@/types';

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
      ...newBoard.value,
      role: 'admin',
    });
    isModalVisible.value = false;
  } catch (error) {
    console.error('Error creating board:', error);
  }
}

export async function createList(lists: Ref<List[]>, newListTitle: Ref<string>, boardID: string) {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/list/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        board_id: boardID,
        name: newListTitle.value,
        priority: 100,
      }),
    });

    if (response.ok) {
      console.log('Successfully added new board.');
      lists.value.push({
        name: newListTitle.value,
      });
      closeCreateModal();
    } else {
      console.error('Failed to add new board.');
    }
  } catch (error) {
    console.error('Error adding new board:', error);
  }
}
