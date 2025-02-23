<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'Register',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirmation = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const register = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      if (password.value !== passwordConfirmation.value) {
        errorMessage.value = 'Passwords do not match';
        isLoading.value = false;
        return;
      }

      const formData = new URLSearchParams();

      formData.append('name', name.value);
      formData.append('email', email.value);
      formData.append('password', password.value);
      formData.append('password_confirmation', passwordConfirmation.value);

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Registration failed');
        }

        const data = await response.json();
        console.log('Registration successful:', data);

        localStorage.setItem('token', data.token);
        window.location.reload();
      } catch (error: any) {
        errorMessage.value = error.message || 'An error occurred. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      name,
      email,
      password,
      passwordConfirmation,
      isLoading,
      errorMessage,
      successMessage,
      register,
    };
  },
};
</script>

<template>
  <div class="flex justify-center items-center bg-white min-h-screen">
    <div class="bg-white p-8 w-full max-w-2xl border-2 border-gray-300 rounded-2xl">
      <div class="flex justify-center mb-6">
        <img src="../assets/images/logo.png" alt="Logo" class="h-36" />
      </div>
      <form @submit.prevent="register">
        <div>
          <label for="name" class="block text-dark-blue font-semibold text-lg">Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Full Name"
            required
            class="w-full mb-6 p-4 mt-1 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-lightblue"
          />
        </div>

        <div>
          <label for="email" class="block text-dark-blue font-semibold text-lg">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            required
            class="w-full mb-6 p-4 mt-1 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-lightblue"
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
            class="w-full p-4 mt-1 border mb-4 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-lightblue"
          />
        </div>

        <div>
          <label for="password_confirmation" class="block text-dark-blue font-semibold text-lg"
            >Confirm Password</label
          >
          <input
            v-model="passwordConfirmation"
            type="password"
            id="password_confirmation"
            placeholder="Confirm Password"
            required
            class="w-full p-4 mt-1 border mb-6 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-lightblue"
          />
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="w-full max-w-xs py-3 bg-lightblue text-white font-semibold rounded-md hover:bg-darkblue transition duration-200 text-lg mb-3"
          >
            Register
          </button>
        </div>
      </form>

      <div v-if="isLoading" class="text-center text-gray-600 mt-4">Registering...</div>
      <div v-if="errorMessage" class="text-center text-red-600 mt-4">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-center text-green-600 mt-4">{{ successMessage }}</div>

      <p class="text-center mt-4 text-lightblue">
        <router-link to="/" class="font-semibold"> Already have an account? Login </router-link>
      </p>
    </div>
  </div>
</template>
