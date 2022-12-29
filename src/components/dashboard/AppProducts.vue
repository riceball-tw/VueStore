<template>
  <div class="flex justify-between w-full mb-8">
    <h1 class="text-4xl font-bold">後台產品資訊</h1>
    <button class="btn btn-primary" type="button" @click="openAddProductModal()">新增產品</button>
  </div>

  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead class="sticky top-0 z-20">
        <tr>
          <th>索引</th>
          <th>首圖</th>
          <th>名稱</th>
          <th>分類</th>
          <th>原價 / 售價</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.key">
          <th>
            {{ pagination.current_page === 1 ? index + 1 : index + 1 + pagination.current_page * 10 - 10 }}
          </th>
          <td>
            <img width="150" :src="product.imageUrl" :alt="product.title" />
          </td>
          <td>{{ product.title }}</td>
          <td>{{ product.category }}</td>
          <td>{{ $unitFilters.currency(product.origin_price) }} 元 / {{ $unitFilters.currency(product.price) }} 元</td>
          <td>
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-warning">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline btn-square" @click="openEditProductModal(product)">
                <svg title="編輯" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path
                    d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"
                  />
                </svg>
              </button>
              <button
                class="btn btn-outline btn-square hover:btn-error -ml-px"
                @click="openDeleteProductModal(product)"
              >
                <svg title="刪除" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path
                    d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pages="pagination" @pagination-change="paginationChange" />
</template>

<script setup>
import { ref, inject } from 'vue';
import { $vfm } from 'vue-final-modal';
import ProductModal from '@/components/modal/ProductModal.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import Pagination from '@/components/AppPagination.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');

// UI Data
const products = ref([]);
const pagination = ref({});

// Remotely get products by given page number, then render them
async function renderProducts(page = 1) {
  axiosWithAuth({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/products/?page=${page}`,
  }).then((res) => {
    products.value = res.data.products;
    pagination.value = res.data.pagination;
  });
}

// Re-render target page provided by pagination component
function paginationChange(page) {
  renderProducts(page);
}

// Remotely create product from input data
function addProduct(targetProduct) {
  axiosWithAuth({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product`,
    data: {
      ...targetProduct,
    },
  }).then(() => {
    renderProducts();
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
    slots: { title: '新增產品' },
  });
}

// Remotely edit product from input data
function editProduct(targetProduct) {
  axiosWithAuth({
    method: 'put',
    url: `/admin/product/${targetProduct.data.id}`,
    data: { ...targetProduct },
  }).then(() => {
    renderProducts();
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
    slots: { title: '編輯產品' },
  });
}

// Remotely delete poduct by given id
function deleteProduct(productId) {
  axiosWithAuth({
    method: 'delete',
    url: `/admin/product/${productId}`,
  }).then(() => {
    renderProducts();
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
    slots: { title: '刪除產品' },
  });
}

// Init Render
renderProducts();
</script>
