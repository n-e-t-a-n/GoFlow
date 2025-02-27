import type { Ref } from 'vue';
import type { Auth } from '@/types';

import { useRouter } from 'vue-router';
const router = useRouter();

export async function login(payload: Auth, isLoading: Ref<boolean>, errorMessage: Ref<string>) {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('Login successful:', data);
    localStorage.setItem('token', data.token);

    window.location.href = '/';
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

export async function register(payload: Auth, isLoading: Ref<boolean>, errorMessage: Ref<string>) {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    console.log('Registration successful:', data);

    localStorage.setItem('token', data.token);
    window.location.reload();
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

export async function logout() {
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

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    localStorage.removeItem('token');
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    console.log('Logged out successfully.');
  }
}
