<template>
  <h1>訂單列表</h1>
  <div>
    <button @click="openDeleteAllOrdersModal()">刪除全部訂單</button>
  </div>

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
      Authorization: getAuthToken,
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
