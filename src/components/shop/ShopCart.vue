<template>
  <h1>商品列表</h1>

  <div v-if="!cartsData.carts.length">目前購物車內無商品</div>

  <div>
    <button v-if="cartsData.carts.length" @click="deleteAllCart()">刪除全部購物車</button>
  </div>

  <table v-if="cartsData.carts.length">
    <thead>
      <tr>
        <th>品名</th>
        <th>數量</th>
        <th>單價</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cart in cartsData.carts" :key="cart.id">
        <td>{{ cart.product?.title ? cart.product.title : '無紀錄' }}</td>
        <td class="flex">
          <input
            type="number"
            :value="cart.qty"
            min="1"
            :disabled="loadingCart.includes(cart.id)"
            @change="
              (e) => {
                handleEditCart(cart.id, e.target.value);
              }
            "
          />/{{ cart.product?.unit ? cart.product.unit : '個' }}
        </td>
        <td>{{ cart.total }}</td>
        <td>
          <button @click="deleteCart(cart.id)">刪除</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Total: {{ cartsData.total }}</td>
        <td>FinalTotal: {{ cartsData.final_total }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';

// UI Data
const cartsData = ref([]);

// Component State
const loadingCart = ref([]);

// Remotely get carts, then render them
async function renderCarts() {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      cartsData.value = res.data.data;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function editCart(cartId, quantity = 1) {
  loadingCart.value = [...loadingCart.value, cartId];
  axios({
    method: 'put',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`,
    headers: { Authorization: getAuthToken() },
    data: {
      data: { product_id: 'cartId', qty: quantity },
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);

      useToast().success(`${res.data.message}`);
      renderCarts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    })
    .finally(() => {
      loadingCart.value = loadingCart.value.filter((cart) => cart !== cartId);
    });
}

function handleEditCart(cartId, newQuantity = 1) {
  editCart(cartId, parseInt(newQuantity, 10));
}

function deleteAllCart() {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/carts`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCarts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function deleteCart(cartId) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCarts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderCarts();
</script>
