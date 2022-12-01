<template>
  <h1>產品列表</h1>

  <div>
    <ProductModal v-model="show" @confirm="confirm" @cancel="cancel">
      <template v-slot:title>Hello, vue-final-modal</template>
    </ProductModal>

    <button @click="show = true">Open modal</button>
  </div>

  <table>
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.key">
        <td>{{ product.category }}</td>
        <td>{{ product.title }}</td>
        <td>{{ product.origin_price }}</td>
        <td>{{ product.price }}</td>
        <td>
          <span v-if="product.is_enabled">啟用</span>
          <span v-else="product.is_enabled">未啟用</span>
        </td>
        <td>
          <div><button>編輯</button> <button>刪除</button></div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue';
import getAuthToken from '@/helper/getAuthToken';
import ProductModal from '@/components/ProductModal.vue';

async function getProducts(authToken) {
  const response = await fetch(`${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products`, {
    method: 'GET',
    headers: { 'content-type': 'application/json', Authorization: authToken },
  });
  if (!response.ok) throw new Error(`發生錯誤，${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤，${responseJSON.message}`);
  return responseJSON;
}

const { products, pagination } = await getProducts(getAuthToken);
console.log(products);
const show = ref(false);
function confirm() {
  show.value = !show.value;
}

function cancel() {}
</script>
