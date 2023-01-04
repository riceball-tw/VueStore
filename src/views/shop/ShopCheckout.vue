<template>
  <div class="container mx-auto flex flex-col gap-4">
    <CheckoutStep :current-step="3" />
    <!-- Section Title -->
    <div class="flex justify-between w-full py-8 px-4">
      <h1 class="text-4xl font-bold">確認付款</h1>
      <div class="btn-group">
        <button :disabled="isPaid || isPaying" class="btn btn-primary" type="button" @click="payOrder(orderId)">
          <span v-if="isPaying">付款中……</span>
          <span v-else>付款</span>
        </button>
      </div>
    </div>

    <div class="flex gap-4">
      <!-- Product Info -->
      <div class="overflow-x-auto w-full">
        <table v-if="orderData.order" class="table w-full">
          <thead>
            <tr>
              <th>品名</th>
              <th>數量</th>
              <th class="text-right">單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in orderData.order.products" :key="product.id">
              <td>{{ product.product.title }}</td>
              <td>{{ product.qty }} / {{ product.product.unit }}</td>
              <td class="text-right">{{ product.total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="text-right text-lg font-bold" colspan="3">總價：{{ orderData.order.total }} $NTD</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Payment Info -->
      <div class="overflow-x-auto w-full max-w-[300px]">
        <table class="table w-full">
          <thead>
            <tr>
              <th>資訊</th>
              <th>內容</th>
            </tr>
          </thead>
          <tbody v-if="orderData.order">
            <tr>
              <th>電子信箱</th>
              <td>{{ orderData.order.user.email }}</td>
            </tr>
            <tr>
              <th>姓名</th>
              <td>{{ orderData.order.user.name }}</td>
            </tr>
            <tr>
              <th>電話</th>
              <td>{{ orderData.order.user.tel }}</td>
            </tr>
            <tr>
              <th>地址</th>
              <td>{{ orderData.order.user.address }}</td>
            </tr>
          </tbody>
          <tfoot class="">
            <tr>
              <th>付款狀態</th>
              <td>
                <span v-if="isPaid">付款完成</span>
                <span v-else>尚未付款</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import CheckoutStep from '@/components/shop/ShopCheckoutStep.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');

const { orderId } = useRoute().params;
const orderData = ref({});

const isPaid = computed(() => orderData.value?.order?.is_paid);
const isPaying = ref(false);

function renderOrder() {
  axiosWithAuth({
    method: 'get',
    url: `/order/${orderId}`,
  }).then((res) => {
    orderData.value = res.data;
  });
}

function payOrder(targetOrderId) {
  isPaying.value = true;
  axiosWithAuth({
    method: 'post',
    url: `/pay/${targetOrderId}`,
  }).then(() => {
    isPaying.value = false;
    renderOrder();
  });
}

renderOrder();
</script>

<style lang="scss" scoped></style>
