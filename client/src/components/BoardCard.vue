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
      router.push({ name: 'Board', params: { id: props.board.id, role: props.board.pivot.role } });
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
  <div class="bg-white p-4 rounded-lg duration-300">
    <h3 class="text-xl font-semibold text-gray-800">{{ board.name }}</h3>
    <p class="text-gray-600">{{ board.description }}</p>
    <button
      @click="viewBoard"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200 mb-8"
    >
      View Board
    </button>
    <button
      v-if="board.pivot.role === 'admin'"
      @click="openEditModal"
      class="mt-4 ml-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-700 transition duration-200 mb-8"
    >
      Edit Details
    </button>

    <Modal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event">
      <template #default>
        <div class="flex flex-col space-y-4">
          <h2 class="text-xl font-semibold">Edit Board Details</h2>
          <label for="boardName" class="text-gray-700">Board Name</label>
          <input
            id="boardName"
            v-model="editedName"
            type="text"
            class="px-4 py-2 border rounded-md"
            placeholder="Enter board name"
          />
          <label for="boardDescription" class="text-gray-700">Board Description</label>
          <textarea
            id="boardDescription"
            v-model="editedDescription"
            class="px-4 py-2 border rounded-md"
            placeholder="Enter board description"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button
              @click="isModalOpen = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button @click="saveChanges" class="px-4 py-2 bg-blue-500 text-white rounded-md">
              Save Changes
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
