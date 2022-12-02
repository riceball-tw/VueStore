import { createRouter, createWebHashHistory } from 'vue-router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import authToken from '@/helper/getAuthToken';

const routes = [
  { path: '', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/About.vue') },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      needsAuth: true,
    },
    children: [
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/Products.vue'),
      },
    ],
  },
  { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

async function checkAuth() {
  const response = await fetch(`${import.meta.env.VITE_APP_API}/api/user/check`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authToken,
    },
  });
  if (!response.ok) throw new Error(`發生錯誤：${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤：${responseJSON.message}`);
  return responseJSON;
}

router.beforeEach(async (to) => {
  // No need auth just pass
  if (!to.meta.needsAuth) {
    return true;
  }
  // Check auth
  const authResult = await checkAuth()
    .then((responseJSON) => {
      Toastify({
        text: `歡迎登入 ${to.name}`,
        duration: 2000,
      }).showToast();
      return true;
    })
    .catch((err) => {
      Toastify({
        text: `${err.message}`,
        duration: 2000,
      }).showToast();
      router.push({ name: 'login' });
    });

  return authResult;
});

export default router;
