<template>
  <div class="flex justify-center">
    <CheckOutStep current-step="1" />
  </div>
  <div class="flex justify-between w-full mb-8">
    <h1 class="text-4xl font-bold">用戶購物車</h1>
    <div class="btn-group">
      <button v-if="cartsData?.carts?.length" type="button" class="btn btn-error" @click="deleteAllCart()">
        清空購物車
      </button>
      <button class="btn btn-success" type="button" @click="checkoutCart()">結帳</button>
    </div>
  </div>

  <div v-if="!cartsData?.carts?.length">目前購物車內無商品</div>

  <!-- Coupon Code Submit Form -->
  <form
    v-if="cartsData?.carts?.length"
    class="flex items-end gap-2 p-4"
    @submit.prevent="
      (e) => {
        submitCoupon(e.target);
      }
    "
  >
    <div class="form-control w-full">
      <label for="couponCode" class="label">
        <span class="label-text"> 優惠券代碼 </span>
      </label>
      <input
        id="couponCode"
        class="input input-bordered"
        name="couponCode"
        type="text"
        placeholder="請輸入優惠券代碼……"
        required
      />
    </div>
    <button class="btn" type="submit">使用優惠券</button>
  </form>

  <div class="overflow-x-auto w-full">
    <table v-if="cartsData?.carts?.length" class="table table-zebra w-full">
      <thead>
        <tr>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cart in cartsData.carts" :key="cart.id">
          <td>{{ cart.product?.title ? cart.product.title : '無紀錄' }}</td>
          <td class="flex">
            <input
              type="number"
              :value="cart.qty"
              min="1"
              :disabled="loadingCart.includes(cart.id)"
              @change="
                (e) => {
                  handleEditCart(cart.id, e.target.value);
                }
              "
            />/{{ cart.product?.unit ? cart.product.unit : '個' }}
          </td>
          <td>
            <del v-if="cart.total !== cart.final_total">{{ cart.total }}</del>
            <span v-else>{{ cart.total }}</span>
          </td>
          <td v-if="cart.total !== cart.final_total">折扣價：{{ cart.final_total }}</td>

          <td>
            <button class="btn btn-error" @click="handleDeleteCart(cart)">刪除</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>總計: {{ cartsData.total }}</td>
          <td v-if="cartsData.total !== cartsData.final_total">折扣價: {{ cartsData.final_total }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import CheckOutStep from '@/components/ShopCheckoutStep.vue';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { $vfm } from 'vue-final-modal';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// UI Data
const cartsData = ref([]);

// Component State
const loadingCart = ref([]);

// Remotely get carts, then render them
async function renderCarts() {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      cartsData.value = res.data.data;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function editCart(cartId, quantity = 1) {
  loadingCart.value = [...loadingCart.value, cartId];
  axios({
    method: 'put',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`,
    headers: { Authorization: getAuthToken() },
    data: {
      data: { product_id: 'cartId', qty: quantity },
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);

      useToast().success(`${res.data.message}`);
      renderCarts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    })
    .finally(() => {
      loadingCart.value = loadingCart.value.filter((cart) => cart !== cartId);
    });
}

function checkoutCart() {
  router.push({ name: 'cartInfo' });
}

function handleEditCart(cartId, newQuantity = 1) {
  editCart(cartId, parseInt(newQuantity, 10));
}

function deleteCart(cartId) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`,
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCarts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function handleDeleteCart(targetCart) {
  $vfm.show({
    component: DashboardDeleteModal,
    bind: {
      dashboardItem: { title: targetCart.id },
    },
    on: {
      confirm() {
        deleteCart(targetCart.id);
      },
    },
    slots: {
      title: '刪除產品',
    },
  });
}

function deleteAllCart() {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/carts`,
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCarts();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

async function submitCoupon(targetForm) {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/coupon`,
    data: {
      data: {
        code: targetForm.couponCode.value,
      },
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCarts();
      targetForm.reset();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderCarts();
</script>
