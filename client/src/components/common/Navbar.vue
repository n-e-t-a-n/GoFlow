<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { logout, type ApiRequest } from '@/helpers/database';

import { useToastStore } from '@/stores';

const router = useRouter();

const { showToast } = useToastStore();

function goToHome() {
  router.push({ name: 'Home' });
}

async function handleLogout() {
  const { message, type }: ApiRequest = await logout(router);

  showToast(message, type);
}
</script>

<template>
  <div
    class="bg-lightblue min-h-[5vh] max-h-[5vh] py-10 px-8 flex justify-between items-center sticky top-0 z-40"
  >
    <button
      @click="goToHome"
      class="text-white font-semibold text-3xl py-2 rounded-lg transition duration-200 transform hover:scale-105"
    >
      GoFlow Kanban
    </button>
    <button
      @click="handleLogout"
      class="text-white bg-red-700 font-semibold text-2xl px-6 py-2 rounded-lg transition duration-200 transform hover:scale-105"
    >
      Logout
    </button>
  </div>
</template>
