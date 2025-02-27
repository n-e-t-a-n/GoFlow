import type { Ref } from 'vue';

export async function updateBoard(
  name: Ref<string>,
  description: Ref<string>,
  editedName: Ref<string>,
  editedDescription: Ref<string>,
  isUpdateBoardModalOpen: Ref<boolean>,
  boardID?: string,
) {
  try {
    const token = localStorage.getItem('token');

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
