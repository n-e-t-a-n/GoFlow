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

    await apiRequest(`/v1/user-board/${boardID.value}`, 'DELETE', { email: email.value });

    members.value = members.value.filter((member) => member.email !== email.value);

    return { message: 'Successfully removed member' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
