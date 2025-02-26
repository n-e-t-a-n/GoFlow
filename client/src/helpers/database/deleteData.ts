import type { UserBoard } from '@/types';
import type { Ref } from 'vue';

export async function removeMember(
  boardID: Ref<string>,
  newMemberEmail: Ref<string>,
  isCreateMemberModalOpen: Ref<boolean>,
  members: Ref<UserBoard[]>,
) {
  try {
    const token = localStorage.getItem('token');

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

    if (response.ok) {
      const data = await response.json();
      console.log('Member removed:', data);

      isCreateMemberModalOpen.value = false;
      members.value = members.value.filter((member) => member.email !== newMemberEmail.value);
    } else {
      console.error('Failed to remove member.');
    }
  } catch (error) {
    console.error('Error removing member:', error);
  }
}
