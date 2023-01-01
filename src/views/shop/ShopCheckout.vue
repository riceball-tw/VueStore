<template>
  <form>
    <div class="overflow-x-auto w-full">
      <table v-if="orderData.order" class="table table-zebra w-full">
        <thead>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr v-for="product in orderData.order.products" :key="product.id">
            <td>{{ product.product.title }}</td>
            <td>{{ product.qty }} / {{ product.product.unit }}</td>
            <td>{{ product.total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">總計</td>
            <td>100</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <hr />
    <div class="overflow-x-auto w-full">
      <table class="table table-zebra w-full">
        <tbody v-if="orderData.order">
          <tr>
            <th width="100">Email</th>
            <td>{{ orderData.order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ orderData.order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ orderData.order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ orderData.order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!orderData.order.is_paid">尚未付款</span>
              <span v-else>付款完成</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </form>
  <div>
    <button v-if="!orderData?.order?.is_paid" class="btn btn-outline" type="button" @click="payOrder(orderId)">
      確認付款去
    </button>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRoute } from 'vue-router';

// Import
const axiosWithAuth = inject('axiosWithAuth');

const { orderId } = useRoute().params;
const orderData = ref({});

function renderOrder() {
  axiosWithAuth({
    method: 'get',
    url: `/order/${orderId}`,
  }).then((res) => {
    orderData.value = res.data;
  });
}

function payOrder(targetOrderId) {
  axiosWithAuth({
    method: 'post',
    url: `/pay/${targetOrderId}`,
  });
}

renderOrder();
</script>

<style lang="scss" scoped></style>
