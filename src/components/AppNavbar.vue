<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>

        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li><router-link :to="{ name: 'about' }">關於我們</router-link></li>
          <li><router-link :to="{ name: 'products' }">所有產品</router-link></li>
          <li><router-link :to="{ name: 'blog' }">產品文章</router-link></li>
          <li><router-link :to="{ name: 'contact' }">聯絡我們</router-link></li>
        </ul>
      </div>
      <router-link :to="{ name: 'home' }" class="btn btn-ghost normal-case text-xl">
        <img width="180" height="48" src="/vueStore.svg" alt="Vue Store Logo" />
      </router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><router-link :to="{ name: 'about' }">關於我們</router-link></li>
        <li><router-link :to="{ name: 'products' }">所有產品</router-link></li>
        <li><router-link :to="{ name: 'blog' }">產品文章</router-link></li>
        <li><router-link :to="{ name: 'contact' }">聯絡我們</router-link></li>
      </ul>
    </div>
    <div class="navbar-end">
      <ul class="flex">
        <li>
          <router-link class="btn btn-square btn-ghost" :to="{ name: 'cart' }">
            <svg title="購物車 Cart" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
              <path
                d="M7 22q-.825 0-1.412-.587Q5 20.825 5 20q0-.825.588-1.413Q6.175 18 7 18t1.412.587Q9 19.175 9 20q0 .825-.588 1.413Q7.825 22 7 22Zm10 0q-.825 0-1.412-.587Q15 20.825 15 20q0-.825.588-1.413Q16.175 18 17 18t1.413.587Q19 19.175 19 20q0 .825-.587 1.413Q17.825 22 17 22ZM6.15 6l2.4 5h7l2.75-5ZM5.2 4h14.75q.575 0 .875.512.3.513.025 1.038l-3.55 6.4q-.275.5-.738.775Q16.1 13 15.55 13H8.1L7 15h12v2H7q-1.125 0-1.7-.988-.575-.987-.05-1.962L6.6 11.6 3 4H1V2h3.25Zm3.35 7h7Z"
              />
            </svg>
          </router-link>
        </li>
        <li>
          <div class="dropdown dropdown-end">
            <button href="#" class="btn btn-ghost btn-square">
              <div class="indicator">
                <label tabindex="0" class="">
                  <svg
                    title="喜愛產品 Favorite"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                  >
                    <path
                      d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Zm0-2.7q2.4-2.15 3.95-3.688 1.55-1.537 2.45-2.674.9-1.138 1.25-2.026.35-.887.35-1.762 0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662-1 .663-1.375 1.688h-1.9q-.375-1.025-1.375-1.688-1-.662-2.175-.662-1.5 0-2.5 1t-1 2.5q0 .875.35 1.762.35.888 1.25 2.026.9 1.137 2.45 2.674Q9.6 16.15 12 18.3Zm0-6.825Z"
                    />
                  </svg>
                  <span class="badge badge-sm indicator-item">{{ favoriteProductIDs.length }}</span>
                </label>
              </div>
            </button>

            <ul
              tabindex="0"
              class="overflow-y-auto overflow-hidden max-h-[600px] flex-nowrap menu menu-normal dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box min-w-max"
            >
              <li v-if="hasFavoriteProduct">
                <div class="p-8">我的最愛目前還沒有商品</div>
                <router-link class="btn btn-ghost hover:btn-primary" :to="{ name: 'products' }">來去找找</router-link>
              </li>

              <li v-for="product in favoriteProducts" :key="product.id">
                <router-link :to="{ path: `/product/${product.id}` }">
                  <!-- Image -->
                  <img width="100" :src="product.imageUrl" :alt="product.title" />
                  <!-- Info -->
                  <div class="flex flex-col w-full">
                    <!-- Title -->
                    <div class="text-lg whitespace-nowrap">
                      {{ product.title }}
                    </div>
                    <!-- Price -->
                    <div>
                      <span class="text font-medium mr-2">{{ product.price }}<span>$NTD</span></span>
                      <del class="opacity-40 inline-block">{{ product.origin_price }}<span>$NTD</span></del>
                    </div>
                    <!-- Action -->
                    <div class="card-actions">
                      <button
                        type="button"
                        class="btn ml-auto btn-sm btn-outline hover:btn-error"
                        @click.stop.prevent="favoriteProductStore.toggleFavoriteProduct(product.id)"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </router-link>
              </li>
              <button
                v-if="!hasFavoriteProduct"
                class="btn btn-block btn-outline hover:btn-error"
                @click="favoriteProductStore.clearFavoriteProducts"
              >
                刪除全部
              </button>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFavoriteProductStore } from '@/stores/favoriteProductStore';
import { useProductStore } from '@/stores/productStore';
import { storeToRefs } from 'pinia';

const favoriteProductStore = useFavoriteProductStore();
const productStore = useProductStore();

const { products } = storeToRefs(productStore);
const { favoriteProductIDs } = storeToRefs(favoriteProductStore);
const hasFavoriteProduct = computed(() => !favoriteProductIDs.value.length);
const favoriteProducts = computed(() => {
  if (!products.value.length) {
    productStore.fetchAllProducts();
    return products.value.filter((product) => favoriteProductIDs.value.includes(product.id));
  }
  return products.value.filter((product) => favoriteProductIDs.value.includes(product.id));
});
</script>
