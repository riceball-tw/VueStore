<template>
  <form>
    <table v-if="orderData.order">
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
    <hr />
    <table>
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
  </form>
  <div>
    <button v-if="!orderData?.order?.is_paid" type="button" @click="payOrder(orderId)">確認付款去</button>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';
import { ref } from 'vue';

const { orderId } = useRoute().params;
const orderData = ref({});

function renderOrder() {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/order/${orderId}`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      orderData.value = res.data;
    })

    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function payOrder(targetOrderId) {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/pay/${targetOrderId}`,
    headers: { Authorization: getAuthToken() },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
    })

    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

renderOrder();
</script>

<style lang="scss" scoped></style>
