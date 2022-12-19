<template>
  <h1>訂單列表</h1>
  <div>
    <button @click="openDeleteAllOrdersModal()">刪除全部訂單</button>
  </div>

  <table>
    <thead>
      <tr>
        <th width="120">購買時間</th>
        <th width="120">E-mail</th>
        <th width="120">購買款項</th>
        <th width="120">應付金額</th>
        <th width="120">是否付款</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.key">
        <td>{{ order.create_at }}</td>
        <td>{{ order.user.email }}</td>
        <td>{{}}</td>
        <td>{{ order.products.total }}</td>
        <td>
          <div>
            <button @click="openEditCouponModal(coupon)">編輯</button>
            <button @click="openDeleteCouponModal(coupon)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  {{ JSON.stringify(orders) }}
  {{ JSON.stringify(pagination) }}

  <Pagination :pages="pagination" @pagination-change="paginationChange" />
</template>

<script setup>
import { $vfm } from 'vue-final-modal';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import getAuthToken from '@/helper/getAuthToken';
import Pagination from '@/components/AppPagination.vue';
import axios from 'axios';

// UI Data
const orders = ref([]);
const pagination = ref({});

function renderOrders(page = 1) {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/orders?page=${page}`,
    headers: {
      Authorization: getAuthToken(),
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      orders.value = res.data.orders;
      pagination.value = res.data.pagination;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function paginationChange(page) {
  renderOrders(page);
}

function deleteAllOrders() {}

function openDeleteAllOrdersModal() {}
await renderOrders();
</script>
