import type { Ref } from 'vue';

import type { Router } from 'vue-router';

import type { Auth } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function login(auth: Ref<Auth>, router: Router) {
  try {
    const response: Response = await apiRequest('/auth/login', 'POST', auth.value, 'NO_AUTH');

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.user.email);

    router.push({ name: 'Home' });
  } catch (error: any) {
    console.error('Error during login: ', error);
  }
}

export async function register(auth: Ref<Auth>, router: Router) {
  try {
    const response = await apiRequest('/auth/register', 'POST', auth.value, 'NO_AUTH');

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.user.email);

    router.push({ name: 'Home' });
  } catch (error: any) {
    console.error('Error during registration: ', error);
  }
}

export async function logout(router: Router) {
  try {
    const response = await apiRequest('/auth/logout', 'POST');

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Logout failed');

    localStorage.removeItem('token');
    localStorage.removeItem('email');

    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Error during logout: ', error);
  }
}
