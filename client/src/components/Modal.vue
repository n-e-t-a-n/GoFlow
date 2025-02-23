<script>
export default {
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit('update:isOpen', false);
    },
  },
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center"
    @click.self="closeModal"
  >
    <div class="relative bg-white rounded-lg p-6 w-1/3 shadow-lg">
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <span class="text-xl">&times;</span>
      </button>
      <div class="max-h-[80vh] overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
