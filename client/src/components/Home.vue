<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  methods: {
    logout() {
      const token = localStorage.getItem('token');
  
      if (!token) {
        this.$router.push({ name: 'Login' });
        return;
      }

      fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem('token');
          
          this.$router.push({ name: 'Login' });
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
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
