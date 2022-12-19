import { createRouter, createWebHashHistory } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import authToken from '@/helper/getAuthToken';

const router = createRouter({
  routes: [
    { path: '', name: 'home', component: () => import('@/views/AppHome.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AppAbout.vue') },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/AppDashboard.vue'),
      meta: {
        needsAuth: true,
      },
      children: [
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/AppProducts.vue'),
        },
        {
          path: 'coupons',
          name: 'coupons',
          component: () => import('@/views/AppCoupons.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/AppOrders.vue'),
        },
        {
          path: 'articles',
          name: 'articles',
          component: () => import('@/views/AppArticles.vue'),
        },
      ],
    },
    { path: '/login', name: 'login', component: () => import('@/views/AppLogin.vue') },
  ],
  history: createWebHashHistory(),
});

router.beforeEach(async (to) => {
  if (!to.meta.needsAuth) {
    return true;
  }
  return axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/user/check`,
    headers: { Authorization: authToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`通過登入驗證，為您跳轉至 ${to.name} 頁面`);
      return true;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
      router.push({ name: 'login' });
      return false;
    });
});

export default router;
