<template>
  <div class="flex justify-center">
    <CheckOutStep current-step="2" />
  </div>
  <div class="flex gap-4 justify-center flex-row-reverse my-8">
    <div>
      <h2 class="text-2xl">訂單細節</h2>
      <p>之後補上</p>
    </div>

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
        <textarea id="message" name="message" class="textarea input-bordered" placeholder="請輸入您的附註……"></textarea>
      </div>

      <button class="btn btn-outline" type="submit">確認付款去</button>
    </form>
  </div>
</template>

<script setup>
import CheckOutStep from '@/components/ShopCheckoutStep.vue';
import axios from 'axios';
import getAuthToken from '@/helper/getAuthToken';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const router = useRouter();

function createOrder(orderData) {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/order`,
    headers: { Authorization: getAuthToken() },
    data: {
      ...orderData,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      router.push({ path: `checkout/${res.data.orderId}` });
    })

    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}
</script>
