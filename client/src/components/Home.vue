<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import BoardCard from '@/components/BoardCard.vue';

export default defineComponent({
  name: 'Home',
  components: {
    BoardCard,
  },
  setup() {
    const boards = ref<any[]>([]);

    const router = useRouter();

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

    const getBoards = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      fetch(`${import.meta.env.VITE_BASE_URL}/v1/board`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              boards.value = data;
            });
          } else {
            console.error('Failed to fetch boards.');
          }
        })
        .catch((error) => {
          console.error('Error fetching boards:', error);
        });
    };

    onMounted(() => {
      getBoards();
    });

    return {
      boards,
      logout,
    };
  },
});
</script>

<template>
  <div>
    <div class="bg-blue-500 p-4 flex justify-between items-center">
      <div>
        <img src="../assets/images/logo.png" alt="Logo" class="h-8" />
      </div>

      <div>
        <button
          @click="logout"
          class="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <BoardCard v-for="board in boards" :key="board.id" :board="board" />
    </div>
  </div>
</template>
