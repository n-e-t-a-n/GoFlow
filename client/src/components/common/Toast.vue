<script lang="ts" setup>
import { computed } from 'vue';

interface ToastProps {
  message: string;
  type: 'info' | 'success' | 'error';
  visible: boolean;
}

const props = defineProps<ToastProps>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const toastClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-700 text-white';
    case 'error':
      return 'bg-red-700 text-white';
    case 'info':
    default:
      return 'bg-blue-700 text-white';
  }
});

function closeToast() {
  emit('close');
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed top-24 left-1/2 transform -translate-x-1/2 p-6 text-lg font-semibold rounded-lg z-50 space-x-3"
    :class="toastClass"
  >
    <span>{{ message }}</span>
    <button class="text-white font-bold" @click="closeToast">×</button>
  </div>
</template>
