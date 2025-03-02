import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as {
      id: number;
      message: string;
      type: 'info' | 'success' | 'error';
      visible: boolean;
    }[],
  }),
  actions: {
    showToast(message: string, type: 'info' | 'success' | 'error' = 'success') {
      const toast = {
        id: Date.now(),
        message,
        type,
        visible: true,
      };
      this.toasts.push(toast);
      setTimeout(() => {
        this.hideToast(toast.id);
      }, 4000);
    },
    hideToast(id: number) {
      const toast = this.toasts.find((t) => t.id === id);
      if (toast) {
        toast.visible = false;
      }
    },
  },
});
