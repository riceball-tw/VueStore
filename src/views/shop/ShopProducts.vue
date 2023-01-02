<template>
  <Hero title="所有產品" description="一些關於這個商店的描述的描述可撰寫於此" />
  <div class="container mx-auto flex flex-col gap-8">
    <div class="flex flex-col md:flex-row gap-8 mt-8">
      <!-- Products Sidebar -->
      <div class="">
        <h2 class="sr-only">產品分類</h2>
        <ul class="menu bg-base-100 min-w-[250px] p-2 rounded-box sticky top-0">
          <li>
            <button :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">全部</button>
          </li>
          <li v-for="category in categories" :key="category">
            <button
              :class="{ active: selectedCategory === category }"
              type="button"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Product Gallery -->
      <div ref="galleryElement" class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <h2 class="sr-only">產品清單</h2>
        <div v-for="product in products" :key="product.id" class="card bg-base-100 shadow-xl">
          <figure><img class="bg-base-200 w-full" :src="product.imageUrl" :alt="product.title" /></figure>
          <div class="card-body">
            <!-- Title -->
            <router-Link :to="{ path: `/product/${product.id}` }">
              <h2 class="card-title">
                {{ product.title }}
              </h2>
            </router-Link>
            <!-- Category -->
            <div class="badge badge-secondary">
              {{ product.category }}
            </div>
            <!-- Description -->
            <p>{{ product.description }}</p>
            <!-- Price -->
            <div>
              <div class="line-through">NT$ {{ product.origin_price }}</div>
              <div class="font-bold">NT$ {{ product.price }}</div>
            </div>
            <div class="card-actions justify-end">
              <div class="btn-group [&>.btn]:border-l-0 [&>.btn:first-child]:border-l">
                <button
                  class="btn btn-outline"
                  :disabled="loadingProduct.includes(product.id)"
                  @click="addToCart(product.id)"
                >
                  <div v-if="loadingProduct.includes(product.id)">
                    <svg title="Pending... 等待圖示" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                      <path
                        d="M7 13.5q.625 0 1.062-.438Q8.5 12.625 8.5 12t-.438-1.062Q7.625 10.5 7 10.5t-1.062.438Q5.5 11.375 5.5 12t.438 1.062Q6.375 13.5 7 13.5Zm5 0q.625 0 1.062-.438.438-.437.438-1.062t-.438-1.062Q12.625 10.5 12 10.5t-1.062.438Q10.5 11.375 10.5 12t.438 1.062q.437.438 1.062.438Zm5 0q.625 0 1.062-.438.438-.437.438-1.062t-.438-1.062Q17.625 10.5 17 10.5t-1.062.438Q15.5 11.375 15.5 12t.438 1.062q.437.438 1.062.438ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
                      />
                    </svg>
                  </div>
                  <div v-else>加到購物車</div>
                </button>
                <button
                  class="btn btn-outline"
                  @click="
                    () => {
                      handleToggleFavoriteProduct(product.id, product.title);
                    }
                  "
                >
                  <span v-if="favoriteProducts.includes(product.id)"
                    ><svg
                      title="Solid Heart 實心的愛心"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="currentColor"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </span>
                  <span v-else>
                    <svg
                      title="Outlined Heart 空心的愛心"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="currentColor"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination :pages="pagination" @pagination-change="handlePaginationChange" />
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue';
import { getFavoriteProducts, toggleFavoriteProduct } from '@/helper/handleFavoriteProduct';
import Pagination from '@/components/AppPagination.vue';
import Hero from '@/components/AppHero.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');
const $loading = inject('$loading');

// UI Data
const products = ref([]); // Display products
const pagination = ref({}); // Display pagination
const cloudProducts = ref([]); // Store allProducts
const selectedCategory = ref('all'); // Current Category
const categories = ref([]); // Current available categories
const galleryElement = ref(null); // Gallery DOM Element
const favoriteProducts = ref(getFavoriteProducts());

// Other State
const loadingProduct = ref([]);
const productsPerPage = 10;

// Watch selectedCategory, load corresponding products & pagination
watch(selectedCategory, (next) => {
  setTimeout(() => {
    galleryElement.value.scrollIntoView({ behavior: 'smooth' });
  }, 100);
  if (next === 'all') {
    products.value = generateProducts(cloudProducts.value);
    pagination.value = generatePagination(cloudProducts.value.length);
  } else {
    products.value = generateProducts(getProductsSortedbyCategory());
    pagination.value = generatePagination(getProductsSortedbyCategory().length);
  }
});

function getProductsSortedbyCategory(category = selectedCategory.value) {
  return cloudProducts.value.filter((product) => product.category === category);
}

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

function generateMaxPage(productCount, perPage = productsPerPage) {
  return Math.round(productCount / perPage);
}

function generatePagination(productCount, currentPage = 1) {
  const maxPage = generateMaxPage(productCount);
  return {
    total_pages: maxPage,
    current_page: currentPage,
    has_pre: currentPage !== 1,
    has_next: currentPage < maxPage,
    category: null,
  };
}

function generateProducts(allProducts, currentPage = 1) {
  const maxPage = currentPage * productsPerPage;
  const minPage = currentPage * productsPerPage - productsPerPage;
  return allProducts.slice(minPage, maxPage);
}

function generateCategories(allProducts) {
  return [...new Set(allProducts.map((product) => product.category))];
}

function renderProducts(currentPage = 1) {
  const loader = $loading.show();
  axiosWithAuth({
    method: 'get',
    url: `products/all`,
  })
    .then((res) => {
      products.value = generateProducts(res.data.products, currentPage);
      cloudProducts.value = res.data.products;
      categories.value = generateCategories(res.data.products);
      pagination.value = generatePagination(res.data.products.length, currentPage);
    })
    .finally(() => {
      loader.hide();
    });
}

// Re-render target page provided by pagination component
function handlePaginationChange(page) {
  if (selectedCategory.value === 'all') {
    products.value = generateProducts(cloudProducts.value, page);
    pagination.value = generatePagination(cloudProducts.value.length, page);
  } else {
    products.value = generateProducts(getProductsSortedbyCategory(), page);
    pagination.value = generatePagination(getProductsSortedbyCategory().length, page);
  }

  setTimeout(() => {
    galleryElement.value.scrollIntoView({
      behavior: 'smooth',
    });
  }, 100);
}

function handleToggleFavoriteProduct(targetId, targetName) {
  toggleFavoriteProduct(targetId, targetName);
  favoriteProducts.value = getFavoriteProducts();
}

// When FavoriteProducts update...
window.addEventListener('storeProducts', () => {
  favoriteProducts.value = getFavoriteProducts();
  renderProducts();
});

// Init
renderProducts();
</script>
