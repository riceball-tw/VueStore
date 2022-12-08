<template>
  <h1>產品列表</h1>

  <div>
    <button @click="openAddProductModal()">新增產品</button>
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
            <button @click="openEditProductModal(product)">編輯</button>
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
import { $vfm } from 'vue-final-modal';
import ProductModal from '@/components/modal/ProductModal.vue';
import ProductDeleteModal from '@/components/modal/ProductDeleteModal.vue';
import Pagination from '@/components/AppPagination.vue';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';

// UI Data
const products = ref([]);
const pagination = ref({});

// Remotely get products by given page number, then render them
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

  products.value = remoteProducts.products;
  pagination.value = remoteProducts.pagination;
}

function paginationChange(page) {
  renderProducts(page);
}

// Remotely create product from input data
async function addProduct(targetProduct) {
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
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
      return err;
    });
}

function openAddProductModal(targetProduct) {
  $vfm.show({
    component: ProductModal,
    bind: {
      product: { ...targetProduct },
    },
    on: {
      confirm(data) {
        data.close();

        // Turn modal input to usable format for addProduct
        const newProduct = {
          data: {
            ...data.product,
          },
        };
        addProduct(newProduct);
      },
      cancel(close) {
        close();
      },
    },
  });
}

// Remotely edit product from input data
async function editProduct(targetProduct) {
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
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function openEditProductModal(targetProduct) {
  $vfm.show({
    component: ProductModal,
    bind: {
      product: { ...targetProduct },
    },
    on: {
      confirm(data) {
        data.close();

        // Turn modal input to usable format for editProduct
        const newProduct = {
          data: {
            ...data.product,
          },
        };
        editProduct(newProduct);
      },
      cancel(close) {
        close();
      },
    },
  });
}

// Remotely delete poduct by given id
async function deleteProduct(productId) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${productId}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderProducts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function openDeleteProductModal(targetProduct) {
  $vfm.show({
    component: ProductDeleteModal,
    bind: {
      product: { ...targetProduct },
    },
    on: {
      confirm(data) {
        data.close();
        deleteProduct(data.product.id);
      },
      cancel(close) {
        close();
      },
    },
  });
}

await renderProducts();
</script>
