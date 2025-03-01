<script lang="ts" setup>
import { ref } from 'vue';

import { register } from '@/helpers/database';

import type { Auth } from '@/types';

const auth = ref<Auth>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const isLoading = ref(false);
const errorMessage = ref('');

function handleRegister() {
  register(auth.value, isLoading, errorMessage);
};
</script>

<template>
  <div class="flex justify-center items-center bg-lightblue min-h-screen">
    <div class="bg-white p-8 w-full max-w-2xl border-2 border-gray-300 rounded-2xl">
      <div class="flex justify-center mb-6">
        <img src="../assets/images/logo.png" alt="Logo" class="h-36" />
      </div>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="name" class="block text-dark-blue font-semibold text-lg">Name</label>
          <input
            v-model="auth.name"
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
            v-model="auth.email"
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
            v-model="auth.password"
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
            v-model="auth.password_confirmation"
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

      <p class="text-center mt-4 text-lightblue">
        <router-link to="/" class="font-semibold">
          Already have an account? <strong class="font-bold">Login</strong>
        </router-link>
      </p>
    </div>
  </div>
</template>
