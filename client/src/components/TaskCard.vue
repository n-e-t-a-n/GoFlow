<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { PropType } from 'vue';
import type { Task } from '@/types';

export default defineComponent({
  name: 'TaskCard',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  setup(props) {
    const isModalVisible = ref(false);
    const taskDetails = ref<Task | null>(null); 

    const viewTask = () => {
      taskDetails.value = props.task; 
      isModalVisible.value = true; 
    };

    const closeModal = () => {
      isModalVisible.value = false; 
      taskDetails.value = null; 
    };

    return {
      viewTask,
      closeModal,
      isModalVisible,
      taskDetails,
    };
  },
});
</script>

<template>
  <div
    @click="viewTask"
    class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-[85%] max-w-[300px] min-h-30 overflow-hidden cursor-pointer"
  >
    <h3 class="text-xl font-semibold text-gray-800 truncate">{{ task.title }}</h3>
    <div class="mt-2">
      <p class="text-sm text-gray-500">
        <strong>Priority:</strong>
        <span
          :class="{
            'text-red-500': task.priority === 'high',
            'text-yellow-500': task.priority === 'medium',
            'text-green-500': task.priority === 'low',
            'text-gray-500': task.priority === 'top',
          }"
          >{{ task.priority || 'No priority set' }}</span
        >
      </p>
      <p class="text-sm text-gray-500">
        <strong>Status:</strong>
        <span
          :class="{
            'text-blue-500': task.status === 'pending',
            'text-yellow-500': task.status === 'in_progress',
            'text-green-500': task.status === 'completed',
            'text-gray-500': task.status === 'on_hold',
          }"
          >{{ task.status || 'No status set' }}</span
        >
      </p>
      <p class="text-sm text-gray-500">
        <strong>Due Date:</strong>
        {{ task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date' }}
      </p>
    </div>
  </div>

  <div
    v-if="isModalVisible"
    class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg max-w-lg w-full">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ taskDetails?.title }}</h2>

      <div class="mb-4">
        <p>
          <strong>Priority:</strong>
          <span
            :class="{
              'text-red-500': taskDetails?.priority === 'high',
              'text-yellow-500': taskDetails?.priority === 'medium',
              'text-green-500': taskDetails?.priority === 'low',
              'text-gray-500': taskDetails?.priority === 'top',
            }"
            >{{ taskDetails?.priority || 'No priority set' }}</span
          >
        </p>
        <p>
          <strong>Status:</strong>
          <span
            :class="{
              'text-blue-500': taskDetails?.status === 'pending',
              'text-yellow-500': taskDetails?.status === 'in_progress',
              'text-green-500': taskDetails?.status === 'completed',
              'text-gray-500': taskDetails?.status === 'on_hold',
            }"
            >{{ taskDetails?.status || 'No status set' }}</span
          >
        </p>
        <p>
          <strong>Due Date:</strong>
          {{
            taskDetails?.due_date
              ? new Date(taskDetails?.due_date).toLocaleDateString()
              : 'No due date'
          }}
        </p>
        <p>
          <strong>Description:</strong>
          {{ taskDetails?.description || 'No description available' }}
        </p>
      </div>

      <button
        @click="closeModal"
        class="mt-4 bg-gray-500 text-white p-2 rounded-lg w-full hover:bg-gray-600 transition"
      >
        Close
      </button>
    </div>
  </div>
</template>
