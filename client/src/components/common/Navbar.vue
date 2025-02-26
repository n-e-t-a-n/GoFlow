<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Navbar',
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push({ name: 'Home' });
    };

    const logout = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push({ name: 'Login' });
        return;
      }

      fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.ok) {
            localStorage.removeItem('token');
            router.push({ name: 'Login' });
          } else {
            console.error('Logout failed');
          }
        })
        .catch((error) => {
          console.error('Error during logout:', error);
        });
    };

    return {
      goToHome,
      logout,
    };
  },
});
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
