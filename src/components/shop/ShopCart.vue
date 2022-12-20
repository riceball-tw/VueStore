<template>
  <h1>商品列表</h1>
  <table>
    <thead>
      <tr>
        <th width="120">圖片</th>
        <th width="120">商品名稱</th>
        <th width="120">價格</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cart in carts" :key="cart.id">
        <td>{{ cart.product.imageUrl }}</td>
        <td>{{ cart.product.title }}</td>
        <td>{{ cart.total }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';

// UI Data
const carts = ref([]);

// Remotely get carts, then render them
async function renderCarts() {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      carts.value = res.data.data.carts;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderCarts();
</script>
