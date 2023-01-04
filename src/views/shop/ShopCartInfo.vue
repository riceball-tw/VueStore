<template>
  <div class="container mx-auto py-16">
    <CheckoutStep :current-step="2" />

    <div class="flex flex-wrap px-4 gap-4 justify-center flex-row-reverse my-8">
      <!-- Sidebar -->
      <div class="min-w-[300px]">
        <h2 class="text-2xl mb-2">訂單細節</h2>

        <div v-if="carts.length === 0">
          <p class="py-8">購物車內尚無商品</p>
          <button class="btn btn-outline hover:btn-primary btn-block" @click="router.push({ name: `products` })">
            來去逛逛
          </button>
        </div>
        <ul class="menu">
          <li v-for="cart in carts" :key="cart.id" class="flex-row">
            <!-- Image -->
            <img width="150" class="bg-base-200" :src="cart.product.imageUrl" :alt="cart.product.title" />
            <router-Link :to="{ path: `/product/${cart.product.id}` }">
              <div class="flex flex-col">
                <!-- Title -->
                {{ cart.product.title }}
                <!-- Price -->
                <div>
                  <span class="text font-medium mr-2">{{ cart.product.price }}<span>$NTD</span></span>
                  <del class="opacity-40 inline-block">{{ cart.product.origin_price }}<span>$NTD</span></del>
                </div>
              </div>
            </router-Link>
          </li>
        </ul>
      </div>

      <!-- Main Form -->
      <form
        class="flex flex-col max-w-lg w-full"
        @submit.prevent="
          (e) => {
            createOrder({
              data: {
                user: {
                  name: e.target.name.value,
                  email: e.target.email.value,
                  tel: e.target.tel.value,
                  address: e.target.address.value,
                },
                message: e.target.message.value,
              },
            });
          }
        "
      >
        <h1 class="text-2xl mb-2">填寫訂購資訊</h1>
        <!-- Email -->
        <div class="form-control w-full">
          <label for="email" class="label">
            <span class="label-text">電子信箱</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            class="input input-bordered w-full"
            placeholder="請輸入您的電子信箱……"
            required
          />
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label for="name" class="label">
            <span class="label-text">姓名</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            class="input input-bordered w-full"
            placeholder="請輸入您的姓名……"
            required
          />
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label for="tel" class="label">
            <span class="label-text">電話</span>
          </label>
          <input
            id="tel"
            name="tel"
            type="tel"
            class="input input-bordered w-full"
            placeholder="請輸入您的電話……"
            required
          />
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label for="address" class="label">
            <span class="label-text">地址</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            class="input input-bordered w-full"
            placeholder="請輸入您的地址……"
            required
          />
        </div>

        <!-- Description -->
        <div class="form-control w-full">
          <label for="message" class="label">
            <span class="label-text">附註</span>
          </label>
          <textarea
            id="message"
            name="message"
            class="textarea input-bordered"
            placeholder="請輸入您的附註……"
          ></textarea>
        </div>

        <button :disabled="carts.length === 0" class="btn btn-outline mt-8" type="submit">確認付款去</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import CheckoutStep from '@/components/shop/ShopCheckoutStep.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');
const $loading = inject('$loading');
const router = useRouter();

// UI Data
const carts = ref([]);

function createOrder(orderData) {
  axiosWithAuth({
    method: 'post',
    url: `/order`,

    data: {
      ...orderData,
    },
  }).then((res) => {
    if (!res.data.success) {
      router.push({ name: 'products' });
      throw new Error(res.data.message);
    }
    router.push({ path: `checkout/${res.data.orderId}` });
  });
}

function renderCartDetail() {
  const loader = $loading.show();
  axiosWithAuth({
    method: 'get',
    url: `/cart`,
  })
    .then((res) => {
      carts.value = res.data.data.carts;
    })
    .finally(() => {
      loader.hide();
    });
}

// Init
renderCartDetail();
</script>
