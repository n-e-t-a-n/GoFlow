import type { UserBoard } from '@/types';
import type { Ref } from 'vue';

export async function removeMember(
  email: Ref<string>,
  boardID: Ref<string>,
  members: Ref<UserBoard[]>,
  handleRemoveMemberModal: () => void,
) {
  try {
    const userEmail = localStorage.getItem('email');

    if (userEmail === email.value) throw new Error('You cannot remove yourself from the board');

    const token = localStorage.getItem('token');

    if (!token) throw new Error('User is not logged in');

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v1/user-board/${boardID.value}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.value,
        }),
      },
    );

    if (!response.ok) throw new Error('Failed to remove member.');

    handleRemoveMemberModal();

    members.value = members.value.filter((member) => member.email !== email.value);
  } catch (error) {
    console.error('Error removing member: ', error);
  }
}
