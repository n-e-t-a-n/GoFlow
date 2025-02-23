<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import BoardCard from '@/components/BoardCard.vue';
import Modal from '@/components/Modal.vue';

export default defineComponent({
  name: 'Home',
  components: {
    BoardCard,
    Modal,
  },
  setup() {
    const boards = ref<any[]>([]);
    const isModalVisible = ref(false);
    const newBoard = ref({
      name: '',
      description: '',
    });

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

    const createBoard = () => {
      const token = localStorage.getItem('token');
      if (!token || !newBoard.value.name || !newBoard.value.description) return;

      fetch(`${import.meta.env.VITE_BASE_URL}/v1/board`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBoard.value),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then(() => {
              getBoards();
              isModalVisible.value = false;
            });
          } else {
            console.error('Failed to create board.');
          }
        })
        .catch((error) => {
          console.error('Error creating board:', error);
        });
    };

    const openModal = () => {
      newBoard.value.name = '';
      newBoard.value.description = '';
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    onMounted(() => {
      getBoards();
    });

    return {
      boards,
      logout,
      isModalVisible,
      newBoard,
      createBoard,
      openModal,
      closeModal,
    };
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-6">
      <button
        @click="openModal"
        class="text-white bg-green-500 px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
      >
        Create New Board
      </button>
    </div>

    <div class="space-y-6 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BoardCard v-for="board in boards" :key="board.id" :board="board" />
    </div>

    <Modal :isOpen="isModalVisible" @update:isOpen="isModalVisible = $event">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Create New Board</h2>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2" for="name">Board Name:</label>
        <input
          id="name"
          v-model="newBoard.name"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          placeholder="Enter board name"
        />

        <label class="block text-gray-700 mt-4 mb-2" for="description">Description:</label>
        <textarea
          id="description"
          v-model="newBoard.description"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          placeholder="Enter board description"
        ></textarea>
      </div>

      <div class="flex justify-end gap-4 mt-4">
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          @click="createBoard"
          class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
        >
          Create
        </button>
      </div>
    </Modal>
  </div>
</template>
