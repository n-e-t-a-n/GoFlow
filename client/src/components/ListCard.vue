<script lang="ts">
import { defineComponent } from 'vue';
import TaskCard from '@/components/TaskCard.vue';

import type { PropType } from 'vue';
import type { List, Task } from '@/types';

export default defineComponent({
  name: 'ListCard',
  components: {
    TaskCard,
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

    return {
      filteredTasks,
    };
  },
});
</script>

<template>
  <div class="bg-gray-100 p-4 rounded-lg shadow-md min-w-[250px] max-w-[250px] mb-4 flex-shrink-0 w-full">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ list.name }}</h3>

    <div v-if="filteredTasks.length > 0" class="overflow-y-auto flex flex-col items-center justify-start gap-4 h-[50vh]">
      <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task"/>
    </div>
    <div v-else class="text-gray-500">No tasks in this list</div>
  </div>
</template>
