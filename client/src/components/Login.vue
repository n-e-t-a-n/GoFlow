<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');

    const login = async () => {
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
    };

    return {
      email,
      password,
      isLoading,
      errorMessage,
      login,
    };
  },
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="bg-white p-8 w-full max-w-sm border-2 border-gray-300">
      <div class="flex justify-center mb-6">
        <img src="../assets/images/logo.png" alt="Logo" class="h-36" />
      </div>
      <form @submit.prevent="login">
        <div>
          <label for="email" class="block text-dark-blue font-semibold text-lg">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            required
            class="w-full mb-6 p-4 mt-1 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-dark-blue font-semibold text-lg">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Password"
            required
            class="w-full p-4 mt-1 border mb-4 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="w-full max-w-xs py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 text-lg mb-3"
          >
            Login
          </button>
        </div>
      </form>

      <div v-if="isLoading" class="text-center text-gray-600 mt-4">Logging in...</div>
      <div v-if="errorMessage" class="text-center text-red-600 mt-4">{{ errorMessage }}</div>

      <p class="text-center mt-4 text-blue-500">
        <router-link to="/register" class="font-semibold">
          Don't have an account? Register
        </router-link>
      </p>
    </div>
  </div>
</template>
