import type { Ref } from 'vue';

import type { UserBoard } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function removeMember(members: Ref<UserBoard[]>, email: string, boardID: string) {
  try {
    const userEmail = localStorage.getItem('email');

    if (userEmail === email) throw new Error('You cannot remove yourself from the board');

    await apiRequest(`/v1/user-board/${boardID}`, 'DELETE', { email: email });

    members.value = members.value.filter((member) => member.email !== email);

    return { message: 'Successfully removed member' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
