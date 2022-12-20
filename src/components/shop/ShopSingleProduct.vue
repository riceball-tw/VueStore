<template>
  <div>ShopSingleProduct.vue xx</div>
  {{ JSON.stringify(product) }}
</template>

<script setup>
import { useRoute } from 'vue-router';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { ref } from 'vue';

const { productId } = useRoute().params;
const product = ref({});

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
