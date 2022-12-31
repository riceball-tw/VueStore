<template>
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>我的最愛</th>
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
            <span v-if="favoriteProducts.includes(product.id)">是</span>
            <span v-else>否</span>
          </td>
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
              <button
                class="btn btn-outline"
                @click="
                  () => {
                    handleToggleFavoriteProduct(product.id, product.title);
                  }
                "
              >
                加到我的最愛
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
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import Pagination from '@/components/AppPagination.vue';
import { getFavoriteProducts, toggleFavoriteProduct } from '@/helper/handleFavoriteProduct';

// Import
const axiosWithAuth = inject('axiosWithAuth');

// UI Data
const products = ref([]);
const pagination = ref({});

// Other State
const loadingProduct = ref([]);
const favoriteProducts = ref(getFavoriteProducts());
const router = useRouter();

// Check single product
function productCheckMore(targetId) {
  router.push(`/product/${targetId}`);
}

// Add prodcut to cart
function addToCart(productId, quantity = 1) {
  loadingProduct.value = [...loadingProduct.value, productId];
  axiosWithAuth({
    method: 'post',
    url: `/cart`,
    data: { data: { product_id: productId, qty: quantity } },
  }).finally(() => {
    loadingProduct.value = loadingProduct.value.filter((product) => product !== productId);
  });
}

// Remotely get products by given page number, then render them
async function renderProducts(page = 1) {
  axiosWithAuth({
    method: 'get',
    url: `/admin/products/?page=${page}`,
  }).then((res) => {
    products.value = res.data.products;
    pagination.value = res.data.pagination;
  });
}

// Re-render target page provided by pagination component
function handlePaginationChange(page) {
  renderProducts(page);
}

function handleToggleFavoriteProduct(targetId, targetName) {
  toggleFavoriteProduct(targetId, targetName);
  favoriteProducts.value = getFavoriteProducts();
}

// Init
renderProducts();
</script>
