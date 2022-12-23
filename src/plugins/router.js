import { createRouter, createWebHashHistory } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import getAuthToken from '@/helper/getAuthToken';

const router = createRouter({
  routes: [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/shop/ShopHome.vue'),
      children: [
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/shop/ShopCart.vue'),
        },
        {
          path: 'cartInfo',
          name: 'cartInfo',
          component: () => import('@/views/shop/ShopCartInfo.vue'),
        },
        {
          path: 'products',
          name: 'userProducts',
          component: () => import('@/views/shop/ShopProducts.vue'),
        },
        {
          path: 'product/:productId',
          name: 'product',
          component: () => import('@/views/shop/ShopProduct.vue'),
        },
        {
          path: 'checkout/:orderId',
          name: 'checkout',
          component: () => import('@/views/shop/ShopCheckout.vue'),
        },
      ],
    },
    { path: '/about', name: 'about', component: () => import('@/views/shop/ShopAbout.vue') },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/AppDashboard.vue'),
      meta: {
        needsAuth: true,
      },
      children: [
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/dashboard/AppProducts.vue'),
        },
        {
          path: 'coupons',
          name: 'coupons',
          component: () => import('@/views/dashboard/AppCoupons.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/dashboard/AppOrders.vue'),
        },
        {
          path: 'articles',
          name: 'articles',
          component: () => import('@/views/dashboard/AppArticles.vue'),
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
    headers: { Authorization: getAuthToken() },
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
