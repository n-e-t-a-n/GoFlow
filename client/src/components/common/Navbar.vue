<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { logout } from '@/helpers/database';

const router = useRouter();

const goToHome = () => {
  router.push({ name: 'Home' });
};
</script>

<template>
  <div
    class="bg-lightblue min-h-[5vh] max-h-[5vh] py-10 px-8 flex justify-between items-center shadow-lg"
  >
    <button
      @click="goToHome"
      class="text-white font-semibold text-3xl py-2 rounded-lg transition duration-200 transform hover:scale-105"
    >
      GoFlow Kanban
    </button>
    <button
      @click="logout"
      class="text-white bg-red-700 font-semibold text-2xl px-6 py-2 rounded-lg transition duration-200 transform hover:scale-105"
    >
      Logout
    </button>
  </div>
</template>
