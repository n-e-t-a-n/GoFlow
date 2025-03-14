import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Board from '@/components/Board.vue';

import Register from '../components/Register.vue';
import Login from '../components/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/board/:id',
    name: 'Board',
    component: Board,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const token: string | null = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    if (!token) {
      next({ name: 'Login' });
      return;
    }

    const isValidToken = await checkTokenValidity(token);

    if (!isValidToken) {
      next({ name: 'Login' });
      return;
    }
  }

  if (!to.meta.requiresAuth) {
    let isValidToken;

    if (token) isValidToken = await checkTokenValidity(token);

    if (token && isValidToken) {
      next({ name: 'Home' });
    }
  }

  next();
});

export default router;

async function checkTokenValidity(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}
