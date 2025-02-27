<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

import { useRouter } from 'vue-router';

import { Modal } from '@/components/common';

import { updateBoard } from '@/helpers/database';

export default defineComponent({
  name: 'BoardCard',
  components: {
    Modal,
  },
  props: {
    board: {
      type: Object as PropType<{
        id?: string;
        name?: string;
        description?: string;
        role?: string;
      }>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const name = ref(props.board.name || '');
    const description = ref(props.board.description || '');
    const role = props.board.role;

    const editedName = ref(props.board.name || '');
    const editedDescription = ref(props.board.description || '');

    const isUpdateBoardModalOpen = ref(false);
    const isAdmin = ref(props.board.role);

    const viewBoard = () => {
      router.push(`/board/${props.board.id}`);
    };

    const handleUpdateBoard = () => {
      updateBoard(
        name,
        description,
        editedName,
        editedDescription,
        isUpdateBoardModalOpen,
        props.board.id,
      );
    };

    const handleUpdateBoardModal = () => {
      if (!isUpdateBoardModalOpen) {
        editedName.value = props.board.name || '';
        editedDescription.value = props.board.description || '';
      }

      isUpdateBoardModalOpen.value = !isUpdateBoardModalOpen.value;
    };

    return {
      isUpdateBoardModalOpen,
      handleUpdateBoardModal,
      handleUpdateBoard,
      editedName,
      editedDescription,
      viewBoard,
      isAdmin,
      name,
      description,
      role,
    };
  },
});
</script>

<template>
  <div
    class="bg-white border-2 border-gray-400 rounded-lg p-6 space-y-4 min-h-[300px] max-h-[30vh] flex flex-col justify-between"
  >
    <div>
      <div class="flex justify-between">
        <h1 class="font-bold text-3xl">{{ name }}</h1>
        <h1 class="font-semibold">{{ role === 'admin' ? 'Admin' : 'Member' }}</h1>
      </div>
      <p class="text-sm text-gray-800">{{ description }}</p>
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
          v-model="editedName"
          type="text"
          class="px-4 py-3 border mb-6 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightblue"
          placeholder="Enter board name"
        />

        <label for="boardDescription" class="text-gray-700 mb-1">Board Description</label>
        <textarea
          id="boardDescription"
          v-model="editedDescription"
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
