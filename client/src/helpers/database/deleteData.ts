import type { Ref } from 'vue';

import type { UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function removeMember(
  email: Ref<string>,
  boardID: Ref<string>,
  members: Ref<UserBoard[]>,
) {
  try {
    const userEmail = localStorage.getItem('email');

    if (userEmail === email.value) throw new Error('You cannot remove yourself from the board');

    const response: Response = await apiRequest(`/v1/user-board/${boardID.value}`, 'DELETE', {
      email: email.value,
    });

    if (!response.ok) throw new Error('Failed to remove member.');

    members.value = members.value.filter((member) => member.email !== email.value);
  } catch (error) {
    console.error('Error removing member: ', error);
  }
}
