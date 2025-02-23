<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Navbar',
  components: {},
  setup() {
    const router = useRouter();

    const goToHome = () => {
        router.push({ name: 'Home' });
    }

    const logout = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push({ name: 'Login' });
        return;
      }

      fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.ok) {
            localStorage.removeItem('token');
            router.push({ name: 'Login' });
          } else {
            console.error('Logout failed');
          }
        })
        .catch((error) => {
          console.error('Error during logout:', error);
        });
    };
   
    return {
      goToHome,
      logout,
    };
  },
});
</script>

<template>
    <div class="bg-blue-500 p-4 flex justify-between items-center">
    <div
      @click="goToHome">
      <img src="../assets/images/logo.png" alt="Logo" class="h-8" />
    </div>

    <div>
      <button
        @click="logout"
        class="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  </div>
</template>