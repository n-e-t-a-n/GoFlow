<script lang="ts" setup>
import { computed, inject, ref, type ComputedRef, type Ref } from 'vue';

import { useRouter } from 'vue-router';

import { Modal } from '@/components/common';

import { updateBoard, type ApiRequest } from '@/helpers/database';

import type { Board } from '@/types';

import { useToastStore } from '@/stores';

const props = defineProps<{
  board: Board;
}>();

const { showToast } = useToastStore();

const boards = inject('boards') as Ref<Board[]>;

const board = computed(() =>
  boards.value.find((board) => board.id === props.board.id),
) as ComputedRef<Board>;
const editedBoard = ref<Board>({ ...board.value });

const isUpdateBoardModalOpen = ref(false);

const router = useRouter();

function viewBoard() {
  router.push(`/board/${props.board.id}`);
}

async function handleUpdateBoard() {
  const { message, type }: ApiRequest = await updateBoard(
    boards,
    editedBoard.value,
    props.board.id,
  );

  handleUpdateBoardModal();

  showToast(message, type);
}

function handleUpdateBoardModal() {
  if (!isUpdateBoardModalOpen.value) {
    editedBoard.value = { ...board.value };
  }

  isUpdateBoardModalOpen.value = !isUpdateBoardModalOpen.value;
}
</script>

<template>
  <div
    class="bg-white border-2 border-gray-400 rounded-lg p-6 space-y-4 min-h-[300px] max-h-[30vh] flex flex-col justify-between"
  >
    <div>
      <div class="flex justify-between">
        <h1 class="font-bold text-3xl">{{ board.name }}</h1>
        <h1 class="font-semibold">{{ board.role === 'admin' ? 'Admin' : 'Member' }}</h1>
      </div>
      <p class="text-sm text-gray-800">{{ board.description }}</p>
    </div>

    <div class="flex space-x-4 mt-auto">
      <button
        @click="viewBoard"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        View Board
      </button>
      <button
        v-if="board.role === 'admin'"
        @click="handleUpdateBoardModal"
        class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
      >
        Edit Details
      </button>
    </div>
  </div>

  <Modal :isOpen="isUpdateBoardModalOpen" :handleModal="handleUpdateBoardModal">
    <template #default>
      <div class="flex flex-col space-y-3 p-6">
        <h2 class="text-2xl font-semibold text-gray-800">Edit Board Details</h2>

        <label for="boardName" class="text-gray-700 mb-1">Board Name</label>
        <input
          id="boardName"
          v-model="editedBoard.name"
          type="text"
          class="px-4 py-3 border mb-6 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightblue"
          placeholder="Enter board name"
        />

        <label for="boardDescription" class="text-gray-700 mb-1">Board Description</label>
        <textarea
          id="boardDescription"
          v-model="editedBoard.description"
          class="px-4 py-3 border mb-8 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightblue"
          placeholder="Enter board description"
        ></textarea>

        <div class="flex justify-end space-x-4">
          <button
            @click="handleUpdateBoardModal"
            class="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            @click="handleUpdateBoard"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>
