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
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import Pagination from '@/components/AppPagination.vue';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';

// UI Data
const products = ref([]);
const pagination = ref({});

// Remotely get products by given page number, then render them
function renderProducts(page = 1) {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products/?page=${page}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      products.value = res.data.products;
      pagination.value = res.data.pagination;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function paginationChange(page) {
  renderProducts(page);
}

// Remotely create product from input data
function addProduct(targetProduct) {
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

function openAddProductModal() {
  $vfm.show({
    component: ProductModal,
    on: {
      confirm(modalData) {
        const newProduct = {
          data: {
            ...modalData,
          },
        };
        addProduct(newProduct);
      },
    },
    slots: {
      title: '新增產品',
    },
  });
}

// Remotely edit product from input data
function editProduct(targetProduct) {
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
      confirm(modalData) {
        const newProduct = {
          data: {
            ...modalData,
          },
        };
        editProduct(newProduct);
      },
    },
    slots: {
      title: '編輯產品',
    },
  });
}

// Remotely delete poduct by given id
function deleteProduct(productId) {
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
    component: DashboardDeleteModal,
    bind: {
      dashboardItem: { ...targetProduct },
    },
    on: {
      confirm() {
        deleteProduct(targetProduct.id);
      },
    },
    slots: {
      title: '刪除產品',
    },
  });
}

await renderProducts();
</script>
