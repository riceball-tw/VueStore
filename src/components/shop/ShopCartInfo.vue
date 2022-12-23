<template>
  <div>
    <ShopCart />
    <form
      class="flex flex-col"
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
      <label>
        E-mail
        <input name="email" type="email" placeholder="請輸入您的電子信箱……" required />
      </label>

      <label>
        姓名
        <input name="name" type="text" placeholder="請輸入您的姓名……" required />
      </label>
      <label>
        電話
        <input name="tel" type="tel" placeholder="請輸入您的地址……" required />
      </label>
      <label>
        地址
        <input name="address" type="text" placeholder="請輸入您的姓名……" required />
      </label>
      <label>
        附註
        <input name="message" type="text" placeholder="請輸入您的附註……" />
      </label>
      <button type="submit">確認付款去</button>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import getAuthToken from '@/helper/getAuthToken';
import { useToast } from 'vue-toastification';
import ShopCart from '@/components/shop/ShopCart.vue';
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
