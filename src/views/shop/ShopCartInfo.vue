<template>
  <div class="container mx-auto my-8">
    <div class="flex justify-center">
      <CheckoutStep current-step="2" />
    </div>

    <div class="flex gap-4 justify-center flex-row-reverse my-8">
      <!-- Sidebar -->
      <div class="min-w-[300px]">
        <h2 class="text-2xl">訂單細節</h2>

        <div v-if="carts.length === 0">
          <p class="py-8">購物車內尚無商品</p>
          <button class="btn btn-outline hover:btn-success btn-block" @click="router.push({ name: `products` })">
            去採購
          </button>
        </div>
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
        <h2 class="text-2xl">訂購人資訊</h2>
        <!-- Email -->
        <div class="form-control w-full">
          <label for="email" class="label">
            <span class="label-text">E-mail</span>
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

        <button :disabled="carts.length === 0" class="btn btn-outline" type="submit">確認付款去</button>
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
    if (!res.success) {
      router.push({ name: 'products' });
      return;
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
