import type { Ref } from 'vue';
import type { Auth } from '@/types';

export async function login(
  payload: Auth,
  isLoading: Ref<boolean, boolean>,
  errorMessage: Ref<string, string>,
) {
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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    localStorage.setItem('token', data.token);

    window.location.href = '/';
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

export async function register() {

}