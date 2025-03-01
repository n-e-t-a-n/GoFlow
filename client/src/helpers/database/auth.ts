import type { Ref } from 'vue';
import type { Auth } from '@/types';

export async function login(auth: Auth) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: auth.email,
        password: auth.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);

    window.location.reload();
  } catch (error: any) {
    console.error('Error during login:', error);
  }
}

export async function register(payload: Auth) {
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

    if (!response.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);
    window.location.reload();
  } catch (error: any) {
    console.error('Error during registration:', error);
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
    window.location.reload();
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
