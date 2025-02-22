<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import type { PropType } from 'vue';

export default defineComponent({
  name: 'BoardCard',
  props: {
    board: {
      type: Object as PropType<{ id: string; name: string; description: string }>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const viewBoard = () => {
      router.push({ name: 'Board', params: { id: props.board.id } });
    };

    return {
      viewBoard,
    };
  },
});
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <h3 class="text-xl font-semibold text-gray-800">{{ board.name }}</h3>
    <p class="text-gray-600">{{ board.description }}</p>
    <button
      @click="viewBoard"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
    >
      View Board
    </button>
  </div>
</template>
