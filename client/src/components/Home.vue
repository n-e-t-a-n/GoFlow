<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  methods: {
    logout() {
      localStorage.removeItem('token');

      this.$router.push({ name: 'Login' });
    },
  },
});
</script>

<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the homepage! You are logged in.</p>
    <button @click="logout">Logout</button>
  </div>
</template>
