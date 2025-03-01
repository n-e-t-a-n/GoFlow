<script lang="ts" setup>
import { ref, onMounted } from 'vue';

import { BoardCard, Modal } from '@/components/common';

import { getBoards, createBoard } from '@/helpers/database';

import type { Board } from '@/types';

const boards = ref<Board[]>([]);
const newBoard = ref<Board>({
  id: '',
  name: '',
  description: '',
});

const isModalVisible = ref(false);

function handleModal() {
  if (isModalVisible.value) {
    newBoard.value.name = '';
    newBoard.value.description = '';
  }

  isModalVisible.value = !isModalVisible.value;
};

function handleCreateBoard() {
  createBoard(boards, newBoard, isModalVisible);
};

onMounted(() => {
  getBoards(boards);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-6">
      <button
        @click="handleModal"
        class="text-white font-semibold text-lg bg-lightblue px-6 py-3 rounded-lg shadow-md hover:bg-darkblue transition duration-200"
      >
        Create New Board
      </button>
    </div>

    <div class="space-y-6 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BoardCard v-for="board in boards" :key="board.id" :board="board" />
    </div>

    <Modal :isOpen="isModalVisible" :handleModal="handleModal">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Create New Board</h2>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2" for="name">Board Name:</label>
        <input
          id="name"
          v-model="newBoard.name"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightblue"
          placeholder="Enter board name"
        />

        <label class="block text-gray-700 mt-4 mb-2" for="description">Description:</label>
        <textarea
          id="description"
          v-model="newBoard.description"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightblue"
          placeholder="Enter board description"
        ></textarea>
      </div>

      <div class="flex justify-end gap-4 mt-4">
        <button
          @click="handleModal"
          class="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          @click="handleCreateBoard"
          class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
        >
          Create
        </button>
      </div>
    </Modal>
  </div>
</template>
