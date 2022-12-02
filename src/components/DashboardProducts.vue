<template>
  <h1>產品列表</h1>

  <div>
    <productModal v-model="modalState" :product="tempProduct" @confirm="updateProduct" @cancel="closeModal">
      <template #title>產品</template>
    </productModal>

    <button @click="openModal(true)">新增產品</button>
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
          <div><button @click="openModal(false, product)">編輯</button> <button>刪除</button></div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue';
import productModal from '@/components/productModal.vue';
import getAuthToken from '@/helper/getAuthToken';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const tempProduct = ref({});
const modalState = ref(false);
const products = ref([]);
const pagination = ref({});
let productModalIsNew = false;

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

async function createProduct(authToken, newProduct) {
  const response = await fetch(`${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify(newProduct),
  });
  if (!response.ok) throw new Error(`發生錯誤，${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤，${responseJSON.message}`);
  return responseJSON;
}

async function editProduct(authToken, targetProduct) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${targetProduct.data.id}`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify(targetProduct),
    },
  );
  if (!response.ok) throw new Error(`發生錯誤，${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤，${responseJSON.message}`);
  return responseJSON;
}

function closeModal() {
  modalState.value = false;
}

function openModal(isNewProductModal, targetProduct) {
  if (isNewProductModal) {
    tempProduct.value = {};
  } else {
    tempProduct.value = { ...targetProduct };
  }
  productModalIsNew = isNewProductModal;
  modalState.value = true;
}

async function renderProducts() {
  const remoteProducts = await getProducts(getAuthToken).catch((err) => {
    Toastify({
      text: `${err.message}`,
      duration: 2000,
    }).showToast();
  });

  products.value = remoteProducts.products;
}

async function updateProduct(userInput) {
  const newProduct = {
    data: {
      ...userInput,
    },
  };

  if (productModalIsNew) {
    await createProduct(getAuthToken, newProduct)
      .then((responseJSON) => {
        Toastify({
          text: `${responseJSON.message}`,
          duration: 2000,
        }).showToast();
      })
      .catch((err) => {
        Toastify({
          text: `${err.message}`,
          duration: 2000,
        }).showToast();
      });
  } else {
    console.log(newProduct.data.id);
    await editProduct(getAuthToken, newProduct)
      .then((responseJSON) => {
        Toastify({
          text: `${responseJSON.message}`,
          duration: 2000,
        }).showToast();
      })
      .catch((err) => {
        Toastify({
          text: `${err.message}`,
          duration: 2000,
        }).showToast();
      });
  }

  closeModal();
  renderProducts();
}
renderProducts();
</script>
