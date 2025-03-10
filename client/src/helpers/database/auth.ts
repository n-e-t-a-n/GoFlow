import type { Ref } from 'vue';

import type { Router } from 'vue-router';

import type { Auth } from '@/types';

import { apiRequest } from '@/helpers/database';

export async function login(auth: Auth, router: Router) {
  try {
    const data: Auth = await apiRequest('/auth/login', 'POST', auth, 'NO_AUTH');

    localStorage.setItem('token', data.token as string);
    data.user && localStorage.setItem('email', data.user.email);

    await router.push({ name: 'Home' });

    return { message: 'Logged in successfully' };
  } catch (error: any) {
    return { message: 'Login failed', type: 'error' };
  }
}

export async function register(auth: Auth, router: Router) {
  try {
    const data: Auth = await apiRequest('/auth/register', 'POST', auth, 'NO_AUTH');

    localStorage.setItem('token', data.token as string);

    await router.push({ name: 'Home' });

    return { message: 'Registered successfully' };
  } catch (error: any) {
    return { message: 'Registration failed', type: 'error' };
  }
}

export async function logout(router: Router) {
  try {
    await apiRequest('/auth/logout', 'POST');

    localStorage.removeItem('token');
    localStorage.removeItem('email');

    await router.push({ name: 'Login' });

    return { message: 'Logged out successfully' };
  } catch (error) {
    return { message: 'Something went wrong', type: 'error' };
  }
}
