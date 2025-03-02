import type { Ref } from 'vue';

import type { Router } from 'vue-router';

import type { Auth } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function login(auth: Ref<Auth>, router: Router) {
  try {
    const data: { token: string; user: { email: string } } = await apiRequest(
      '/auth/login',
      'POST',
      auth.value,
      'NO_AUTH',
    );

    localStorage.setItem('token', data.token as string);
    data.user && localStorage.setItem('email', data.user.email);

    router.push({ name: 'Home' });
  } catch (error: any) {
    console.error('Error during login: ', error);
  }
}

export async function register(auth: Ref<Auth>, router: Router) {
  try {
    await apiRequest('/auth/register', 'POST', auth.value, 'NO_AUTH');

    router.push({ name: 'Home' });
  } catch (error: any) {
    console.error('Error during registration: ', error);
  }
}

export async function logout(router: Router) {
  try {
    await apiRequest('/auth/logout', 'POST');

    localStorage.removeItem('token');
    localStorage.removeItem('email');

    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Error during logout: ', error);
  }
}
