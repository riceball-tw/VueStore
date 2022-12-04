<template>
  <h1>產品列表</h1>

  <div>
    <productModal v-model="modalState" :product="tempProduct" @confirm="updateProduct" @cancel="closeModal">
      <template #title>產品</template>
    </productModal>

    <productDeleteModal
      v-model="deleteModalState"
      :product="tempProduct"
      @confirm="updateDeleteProduct"
      @cancel="closeDeleteModal"
    >
      <template #title>刪除產品</template>
    </productDeleteModal>

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
        <td>{{ $unitFilters.currency(product.origin_price) }}</td>
        <td>{{ $unitFilters.currency(product.price) }}</td>
        <td>
          <span v-if="product.is_enabled">啟用</span>
          <span v-else>未啟用</span>
        </td>
        <td>
          <div>
            <button @click="openModal(false, product)">編輯</button>
            <button @click="openDeleteProductModal(product)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <Pagination :pages="pagination" @page-change="pageChange" />
</template>

<script setup>
import { ref } from 'vue';
import productModal from '@/components/ProductModal.vue';
import productDeleteModal from '@/components/ProductDeleteModal.vue';
import Pagination from '@/components/Pagination.vue';
import getAuthToken from '@/helper/getAuthToken';
import { useToast } from 'vue-toastification';

const tempProduct = ref({});
const modalState = ref(false);
const deleteModalState = ref(false);
const products = ref([]);
const pagination = ref({});
let productModalIsNew = false;

async function getProducts(authToken = getAuthToken, page = 1) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products/?page=${page}`,
    {
      method: 'GET',
      headers: { 'content-type': 'application/json', Authorization: authToken },
    },
  );
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

async function deleteProduct(authToken, targetProductID) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${targetProductID}`,
    {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: authToken,
      },
    },
  );
  if (!response.ok) throw new Error(`發生錯誤，${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤，${responseJSON.message}`);
  return responseJSON;
}

function pageChange(page) {
  renderProducts(page);
}

function closeModal() {
  modalState.value = false;
}

function closeDeleteModal() {
  deleteModalState.value = false;
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

function openDeleteProductModal(targetProduct) {
  tempProduct.value = { ...targetProduct };
  deleteModalState.value = true;
}

async function renderProducts(page) {
  const remoteProducts = await getProducts(getAuthToken, page).catch((err) => {
    useToast().error(`${err.message}`);
  });

  products.value = remoteProducts.products;
  pagination.value = remoteProducts.pagination;
}

async function updateDeleteProduct(targetProduct) {
  await deleteProduct(getAuthToken, targetProduct.id)
    .then((responseJSON) => {
      useToast().success(`${responseJSON.message}`);
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });

  closeDeleteModal();
  renderProducts();
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
        useToast().success(`${responseJSON.message}`);
      })
      .catch((err) => {
        useToast().error(`${err.message}`);
      });
  } else {
    await editProduct(getAuthToken, newProduct)
      .then((responseJSON) => {
        useToast().success(`${responseJSON.message}`);
      })
      .catch((err) => {
        useToast().error(`${err.message}`);
      });
  }

  closeModal();
  renderProducts();
}

renderProducts();
</script>
