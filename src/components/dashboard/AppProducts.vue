<template>
  <h1>產品列表</h1>

  <div>
    <productModal
      v-model="productModalState"
      :product="tempProduct"
      @confirm="updateProduct"
      @cancel="closeProductModal"
    >
      <template #title>產品</template>
    </productModal>

    <productDeleteModal
      v-model="deleteProductModalState"
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
  <Pagination :pages="pagination" @pagination-change="paginationChange" />
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import productDeleteModal from '@/components/modal/ProductDeleteModal.vue';
import productModal from '@/components/modal/ProductModal.vue';
import Pagination from '@/components/AppPagination.vue';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';

// Modal state
const productModalState = ref(false);
const deleteProductModalState = ref(false);
let productModalIsNew = false;

// UI Data
const products = ref([]);
const pagination = ref({});

// Data waiting to pass to modal
const tempProduct = ref({});

// Render products by given page number
async function renderProducts(page = 1) {
  const remoteProducts = await axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products/?page=${page}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      return res.data;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });

  // Update current data
  products.value = remoteProducts.products;
  pagination.value = remoteProducts.pagination;
}

function paginationChange(page) {
  renderProducts(page);
}

function closeProductModal() {
  productModalState.value = false;
}

function closeDeleteModal() {
  deleteProductModalState.value = false;
}

function openModal(isNewProductModal, targetProduct) {
  if (isNewProductModal) {
    tempProduct.value = {};
  } else {
    tempProduct.value = { ...targetProduct };
  }
  productModalIsNew = isNewProductModal;
  productModalState.value = true;
}

function openDeleteProductModal(targetProduct) {
  tempProduct.value = { ...targetProduct };
  deleteProductModalState.value = true;
}

async function updateDeleteProduct(targetProduct) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${targetProduct.id}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderProducts();
      closeDeleteModal();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

async function updateProduct(userInput) {
  // Product info from modal input
  const targetProduct = {
    data: {
      ...userInput,
    },
  };

  if (productModalIsNew) {
    // Remotely create product from input data
    axios({
      method: 'post',
      url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product`,
      headers: {
        Authorization: getAuthToken,
      },
      data: {
        ...targetProduct,
      },
    })
      .then((res) => {
        if (!res.data.success) throw new Error(`${res.data.message}`);
        useToast().success(`${res.data.message}`);
        renderProducts();
        closeProductModal();
      })
      .catch((err) => {
        useToast().error(`${err.message}`);
        return err;
      });
    return;
  }

  // Remotely edit product from input data
  axios({
    method: 'put',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${targetProduct.data.id}`,
    headers: {
      Authorization: getAuthToken,
    },
    data: { ...targetProduct },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderProducts();
      closeProductModal();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderProducts();
</script>
