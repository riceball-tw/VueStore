<template>
  <div class="container mx-auto flex gap-8">
    <!-- Product Images -->
    <div class="max-w-[600px]">
      <img :src="product.imageUrl" :alt="product.title" />

      <div class="flex">
        <img v-for="image in product.imagesUrl" :key="image" width="100" :src="image" :alt="image" />
      </div>
      <div>這部分可能用個 Slider</div>
    </div>
    <!-- Product Info -->
    <div>
      <!-- Category -->
      <div class="badge">
        {{ product.category }}
      </div>
      <!-- Title -->
      <div class="flex items-center">
        <h1 class="text-5xl font-bold">
          {{ product.title }}
        </h1>
        <button
          type="button"
          class="btn btn-ghost btn-square"
          @click="
            () => {
              isProductFavorited = !isProductFavorited;
              toggleFavoriteProduct(product.id, product.title);
            }
          "
        >
          <svg
            v-if="isProductFavorited"
            title="Solid Heart"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <svg v-else title="Outlined Heart" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path
              d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Zm0-2.7q2.4-2.15 3.95-3.688 1.55-1.537 2.45-2.674.9-1.138 1.25-2.026.35-.887.35-1.762 0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662-1 .663-1.375 1.688h-1.9q-.375-1.025-1.375-1.688-1-.662-2.175-.662-1.5 0-2.5 1t-1 2.5q0 .875.35 1.762.35.888 1.25 2.026.9 1.137 2.45 2.674Q9.6 16.15 12 18.3Zm0-6.825Z"
            />
          </svg>
        </button>
      </div>
      <!-- Description -->
      <p>
        {{ product.description }}
      </p>
      <!-- Price -->
      <div class="line-through">NT$ {{ product.origin_price }}</div>
      <div>NT$ {{ product.price }}</div>

      <form
        class="flex gap-4"
        @submit.prevent="
          (e) => {
            addToCart(parseInt(e.target.productCount.value));
          }
        "
      >
        <!-- Product Count -->
        <input
          id="productCount"
          name="productCount"
          class="input input-bordered w-full"
          type="number"
          min="1"
          value="1"
          placeholder="請輸入優惠券名稱……"
          required
        />
        <button class="btn btn-success" type="submit" :disabled="loadingProduct === productId">
          <span v-if="loadingProduct !== productId">新增至購物車</span>
          <div v-else>
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
              <path
                d="M7 13.5q.625 0 1.062-.438Q8.5 12.625 8.5 12t-.438-1.062Q7.625 10.5 7 10.5t-1.062.438Q5.5 11.375 5.5 12t.438 1.062Q6.375 13.5 7 13.5Zm5 0q.625 0 1.062-.438.438-.437.438-1.062t-.438-1.062Q12.625 10.5 12 10.5t-1.062.438Q10.5 11.375 10.5 12t.438 1.062q.437.438 1.062.438Zm5 0q.625 0 1.062-.438.438-.437.438-1.062t-.438-1.062Q17.625 10.5 17 10.5t-1.062.438Q15.5 11.375 15.5 12t.438 1.062q.437.438 1.062.438ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
              />
            </svg>
          </div>
        </button>
      </form>

      <div class="prose" v-html="product.content"></div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, inject } from 'vue';
import { toggleFavoriteProduct, checkIsProductFavorited } from '@/helper/handleFavoriteProduct';

// Import
const axiosWithAuth = inject('axiosWithAuth');

// UI Data
const { productId } = useRoute().params;
const product = ref({});

// UI State
const loadingProduct = ref('');
const isProductFavorited = ref(checkIsProductFavorited(productId));

function addToCart(quantity = 1) {
  loadingProduct.value = productId;
  axiosWithAuth({
    method: 'post',
    url: `/cart`,
    data: { data: { product_id: productId, qty: quantity } },
  }).finally(() => {
    loadingProduct.value = '';
  });
}

async function getProduct() {
  axiosWithAuth({
    method: 'get',
    url: `/product/${productId}`,
  }).then((res) => {
    product.value = res.data.product;
  });
}

getProduct();
</script>
