<template>
  <h1>商品列表</h1>

  <div v-if="!cartsData?.carts?.length">目前購物車內無商品</div>

  <button v-if="cartsData?.carts?.length" @click="deleteAllCart()">刪除全部購物車</button>
  <form
    v-if="cartsData?.carts?.length"
    @submit.prevent="
      (e) => {
        submitCoupon(e.target);
      }
    "
  >
    <label>
      優惠券代碼
      <input name="couponCode" type="text" placeholder="請輸入優惠券代碼……" required />
    </label>
    <button type="submit">使用優惠券</button>
  </form>

  <table v-if="cartsData?.carts?.length">
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
        <td>
          <del v-if="cart.total !== cart.final_total">{{ cart.total }}</del>
          <span v-else>{{ cart.total }}</span>
        </td>
        <td v-if="cart.total !== cart.final_total">折扣價：{{ cart.final_total }}</td>

        <td>
          <button @click="deleteCart(cart.id)">刪除</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>總計: {{ cartsData.total }}</td>
        <td v-if="cartsData.total !== cartsData.final_total">折扣價: {{ cartsData.final_total }}</td>
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

function deleteCart(cartId) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`,
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

function deleteAllCart() {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/carts`,
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

async function submitCoupon(targetForm) {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/coupon`,
    data: {
      data: {
        code: targetForm.couponCode.value,
      },
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCarts();
      targetForm.reset();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderCarts();
</script>
