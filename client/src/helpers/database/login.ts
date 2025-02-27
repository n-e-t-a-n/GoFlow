import type { Ref } from 'vue';

export default async function login(
  email: Ref<string, string>,
  password: Ref<string, string>,
  isLoading: Ref<boolean, boolean>,
  errorMessage: Ref<string, string>,
) {
  isLoading.value = true;
  errorMessage.value = '';

  const formData = new URLSearchParams();

  formData.append('email', email.value);
  formData.append('password', password.value);

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
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
