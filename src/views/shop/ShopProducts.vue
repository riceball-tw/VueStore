<template>
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>產品圖片</th>
          <th>產品名稱</th>
          <th>產品價格</th>
          <th>產品原價</th>
          <th>行動</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            <img width="300" :src="product.imageUrl" :alt="product.title" />
          </td>
          <td>{{ product.title }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.origin_price }}</td>

          <td>
            <div class="btn-group">
              <button class="btn btn-outline" @click="productCheckMore(product.id)">查看更多</button>
              <button
                class="btn btn-outline -ml-px"
                :disabled="loadingProduct.includes(product.id)"
                @click="addToCart(product.id)"
              >
                <div v-if="loadingProduct.includes(product.id)">Loading...</div>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pages="pagination" @pagination-change="handlePaginationChange" />
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import axios from 'axios';
import getAuthToken from '@/helper/getAuthToken';
import Pagination from '@/components/AppPagination.vue';

// UI Data
const products = ref([]);
const pagination = ref({});

// Other State
const loadingProduct = ref([]);
const router = useRouter();

// Check single product
function productCheckMore(targetId) {
  router.push(`/product/${targetId}`);
}

// Add prodcut to cart
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

// Re-render target page provided by pagination component
function handlePaginationChange(page) {
  renderProducts(page);
}

// Init
renderProducts();
</script>
