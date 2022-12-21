<template>
  {{ JSON.stringify(product) }}
  <hr />
  <button :disabled="loadingProduct === productId" @click="addToCart()">
    <div v-if="loadingProduct === productId">Loading...</div>
    新增至購物車
  </button>
</template>

<script setup>
import { useRoute } from 'vue-router';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { ref } from 'vue';

const { productId } = useRoute().params;
const product = ref({});
const loadingProduct = ref('');

function addToCart(quantity = 1) {
  loadingProduct.value = productId;
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`,
    headers: { Authorization: getAuthToken() },
    data: { data: { product_id: productId, qty: quantity } },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    })
    .finally(() => {
      loadingProduct.value = '';
    });
}

async function renderProducts() {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/product/${productId}`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      product.value = res.data.product;
    })

    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderProducts();
</script>
