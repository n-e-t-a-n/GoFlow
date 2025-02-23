<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import Modal from './Modal.vue';

import type { PropType } from 'vue';

export default defineComponent({
  name: 'BoardCard',
  components: {
    Modal,
  },
  props: {
    board: {
      type: Object as PropType<{
        id: string;
        name: string;
        description: string;
        pivot: { role: string };
      }>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const isModalOpen = ref(false);
    const editedName = ref(props.board.name);
    const editedDescription = ref(props.board.description);

    const viewBoard = () => {
      router.push({ name: 'Board', params: { id: props.board.id } });
    };

    const openEditModal = () => {
      isModalOpen.value = true;
    };

    const saveChanges = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/v1/board/${props.board.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: editedName.value,
              description: editedDescription.value,
            }),
          },
        );

        if (response.ok) {
          const updatedBoard = await response.json();

          props.board.name = updatedBoard.board.name;
          props.board.description = updatedBoard.board.description;

          isModalOpen.value = false;
        } else {
          console.error('Failed to update board details');
        }
      } catch (error) {
        console.error('Error updating board details:', error);
      }
    };

    return {
      isModalOpen,
      editedName,
      editedDescription,
      viewBoard,
      openEditModal,
      saveChanges,
    };
  },
});
</script>

<template>
  <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
    <h1 class="font-semibold text-gray-800">{{ board.name }}</h1>
    <p class="text-sm">{{ board.description }}</p>

    <div class="flex space-x-4">
      <button
        @click="viewBoard"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        View Board
      </button>
      <button
        v-if="board.pivot.role === 'admin'"
        @click="openEditModal"
        class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
      >
        Edit Details
      </button>
    </div>

    <Modal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event">
      <template #default>
        <div class="flex flex-col space-y-6 p-6">
          <h2 class="text-2xl font-semibold text-gray-800">Edit Board Details</h2>

          <label for="boardName" class="text-gray-700">Board Name</label>
          <input
            id="boardName"
            v-model="editedName"
            type="text"
            class="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter board name"
          />

          <label for="boardDescription" class="text-gray-700">Board Description</label>
          <textarea
            id="boardDescription"
            v-model="editedDescription"
            class="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter board description"
          ></textarea>

          <div class="flex justify-end space-x-4">
            <button
              @click="isModalOpen = false"
              class="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
