import type { Ref } from 'vue';

import type { Router } from 'vue-router';

import type { Auth } from '@/types';

export async function login(auth: Ref<Auth>, router: Router) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: auth.value.email,
        password: auth.value.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);

    router.push({ name: 'Home' });
  } catch (error: any) {
    console.error('Error during login:', error);
  }
}

export async function register(auth: Ref<Auth>, router: Router) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: auth.value.name,
        email: auth.value.email,
        password: auth.value.password,
        password_confirmation: auth.value.password_confirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);

    router.push({ name: 'Home' });
  } catch (error: any) {
    console.error('Error during registration:', error);
  }
}

export async function logout(router: Router) {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Logout failed');

    localStorage.removeItem('token');

    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
