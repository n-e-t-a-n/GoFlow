<script lang="ts">
import { defineComponent, ref } from 'vue';
import TaskCard from '@/components/TaskCard.vue';

import type { PropType } from 'vue';
import type { List, Task } from '@/types';

import Modal from '@/components/Modal.vue';

export default defineComponent({
  name: 'ListCard',
  components: {
    TaskCard,
    Modal,
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true,
    },
    tasks: {
      type: Array as PropType<Task[]>,
      required: true,
    },
  },
  setup(props) {
    const filteredTasks = props.tasks.filter((task) => task.task_list_id === props.list.id);
    const isEditModalVisible = ref(false);
    const newListTitle = ref<string>(props.list.name);

    const openEditModal = () => {
      newListTitle.value = props.list.name;
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
    };

    const updateListTitle = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/list/${props.list.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newListTitle.value,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('List title successfully edited:', data);

          closeEditModal();
          props.list.name = newListTitle.value;
        } else {
          console.error('Failed to edit list title');
        }
      } catch (error) {
        console.error('Error changing list title:', error);
      }
    };

    return {
      filteredTasks,
      isEditModalVisible,
      newListTitle,
      openEditModal,
      closeEditModal,
      updateListTitle,
    };
  },
});
</script>

<template>
  <div
    class="bg-gray-100 p-4 rounded-lg shadow-md min-w-[250px] max-w-[250px] mb-4 flex-shrink-0 w-full"
  >
    <h3 @click="openEditModal" class="text-xl font-semibold text-gray-800 mb-4">{{ list.name }}</h3>

    <div
      v-if="filteredTasks.length > 0"
      class="overflow-y-auto flex flex-col items-center justify-start gap-4 h-[50vh]"
    >
      <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" />
    </div>
    <div v-else class="text-gray-500">No tasks in this list</div>
  </div>

  <Modal :isOpen="isEditModalVisible" @update:isOpen="isEditModalVisible = $event">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit List Title</h2>

    <div class="mb-4">
      <input
        v-model="newListTitle"
        type="text"
        class="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter new list title"
      />
    </div>

    <div class="flex justify-between">
      <button
        @click="updateListTitle"
        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Save
      </button>
      <button
        @click="closeEditModal"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cancel
      </button>
    </div>
  </Modal>
</template>
