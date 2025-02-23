<template>
  <div>
    <Navbar v-if="showNavbar" />
    <router-view></router-view>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();

    const showNavbar = computed(() => route.meta.requiresAuth);

    return {
      showNavbar,
    };
  },
};
</script>
