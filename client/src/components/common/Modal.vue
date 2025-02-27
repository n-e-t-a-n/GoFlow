<script lang="ts">
export default {
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    handleModal: {
      type: Function,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.handleModal();
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
    <div class="relative bg-white rounded-lg p-6 w-1/3 border-2">
      <button @click="closeModal" class="absolute top-3 right-6">
        <span class="text-2xl">&times;</span>
      </button>
      <div class="max-h-[80vh] overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
