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
import { ref, inject } from 'vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');

const { productId } = useRoute().params;
const product = ref({});
const loadingProduct = ref('');

function addToCart(quantity = 1) {
  loadingProduct.value = productId;
  axiosWithAuth({
    method: 'post',
    url: `/cart`,
    data: { data: { product_id: productId, qty: quantity } },
  }).finally(() => {
    loadingProduct.value = '';
  });
}

async function renderProducts() {
  axiosWithAuth({
    method: 'get',
    url: `/product/${productId}`,
  }).then((res) => {
    product.value = res.data.product;
  });
}

renderProducts();
</script>
