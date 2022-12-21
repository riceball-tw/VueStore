<template>
  <h1>商店產品列表</h1>

  <table>
    <thead>
      <tr>
        <th width="120">產品圖片</th>
        <th width="120">產品名稱</th>
        <th width="120">產品價格</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>
          <img :src="product.imageUrl" :alt="product.title" />
        </td>
        <td>{{ product.title }}</td>
        <td>{{ product.price }}</td>
        <td>
          <div>
            <button @click="productCheckMore(product.id)">查看更多</button>
            <button :disabled="loadingProduct.includes(product.id)" @click="addToCart(product.id)">
              <div v-if="loadingProduct.includes(product.id)">Loading...</div>
              加到購物車
            </button>
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
import { useRouter } from 'vue-router';

const router = useRouter();

// UI Data
const products = ref([]);
const pagination = ref({});

const loadingProduct = ref([]);

function productCheckMore(targetId) {
  router.push(`/product/${targetId}`);
}

function addToCart(productId, quantity = 1) {
  loadingProduct.value = [...loadingProduct.value, productId];
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
      loadingProduct.value = loadingProduct.value.filter((product) => product !== productId);
    });
}

// Remotely get products by given page number, then render them
async function renderProducts(page = 1) {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products/?page=${page}`,
    headers: { Authorization: getAuthToken() },
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
      Authorization: getAuthToken(),
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

renderProducts();
</script>
