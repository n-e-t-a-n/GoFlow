<script lang="ts" setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { login, type ApiRequest } from '@/helpers/database';

import type { Auth } from '@/types';

import { useToastStore } from '@/stores';

const auth = ref<Auth>({
  email: '',
  password: '',
});

const router = useRouter();

async function handleLogin() {
  const { message, type }: ApiRequest = await login(auth.value, router);

  showToast(message, type);
}

const { showToast } = useToastStore();
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-lightblue">
    <div class="bg-white p-8 w-full max-w-2xl border-2 border-gray-300 rounded-2xl">
      <div class="flex justify-center mb-6">
        <img src="../assets/images/logo.png" alt="Logo" class="h-36" />
      </div>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-dark-blue font-semibold text-lg">Email</label>
          <input
            v-model="auth.email"
            type="email"
            id="email"
            placeholder="Email"
            required
            class="w-full mb-4 p-4 mt-1 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-dark-blue font-semibold text-lg">Password</label>
          <input
            v-model="auth.password"
            type="password"
            id="password"
            placeholder="Password"
            required
            class="w-full p-4 mt-1 border mb-8 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="w-full max-w-xs py-3 bg-lightblue text-white font-semibold rounded-md hover:bg-darkblue transition duration-200 text-lg mb-3"
          >
            Login
          </button>
        </div>
      </form>

      <p class="text-center mt-4 text-lightblue">
        <router-link to="/register" class="font-semibold">
          Don't have an account? <strong class="font-bold">Register</strong>
        </router-link>
      </p>
    </div>
  </div>
</template>
