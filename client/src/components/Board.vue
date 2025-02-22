<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import ListCard from '@/components/ListCard.vue';

import type { List, Task, BoardData } from '@/types';

export default defineComponent({
  name: 'Board',
  components: {
    ListCard,
  },
  setup() {
    const route = useRoute();
    const tasks = ref<Task[]>([]);
    const lists = ref<List[]>([]);

    onMounted(() => {
      const boardID = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

      if (boardID) {
        fetchBoardData(boardID);
      }
    });

    const fetchBoardData = async (boardID: string) => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://127.0.0.1:8000/api/v1/task/${boardID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: BoardData = await response.json();

          lists.value = data.lists;
          tasks.value = data.tasks;
        } else {
          console.error('Failed to fetch lists');
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    return {
      tasks,
      lists,
    };
  },
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Board Tasks</h1>

    <div class="mt-6 flex overflow-x-auto gap-4 pb-2 justify-start">
      <div v-for="list in lists" :key="list.id" class="flex-shrink-0">
        <ListCard :list="list" :tasks="tasks" />
      </div>
    </div>
  </div>
</template>
