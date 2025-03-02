<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

import { Navbar, Toast } from '@/components/common';

import { useToastStore } from '@/stores/useToastStore';

const route = useRoute();

const showNavbar = computed(() => route.meta.requiresAuth);

const { toasts, hideToast } = useToastStore();
</script>

<template>
  <div>
    <Navbar v-if="showNavbar" />

    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :visible="toast.visible"
      @close="hideToast(toast.id)"
    />

    <router-view></router-view>
  </div>
</template>
