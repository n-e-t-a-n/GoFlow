<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

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
    const router = useRouter();

    const viewTask = () => {
      router.push({ name: 'Task', params: { id: props.task.id } });
    };

    return {
      viewTask,
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
</template>
