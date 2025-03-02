import type { UserBoard } from '@/types';
import type { Ref } from 'vue';

export async function removeMember(
  boardID: Ref<string>,
  newMemberEmail: Ref<string>,
  members: Ref<UserBoard[]>,
  isCreateMemberModalOpen: Ref<boolean>,
) {
  try {
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
          email: newMemberEmail.value,
        }),
      },
    );

    if (!response.ok) throw new Error('Failed to remove member.');

    isCreateMemberModalOpen.value = false;

    members.value = members.value.filter((member) => member.email !== newMemberEmail.value);
  } catch (error) {
    console.error('Error removing member: ', error);
  }
}
