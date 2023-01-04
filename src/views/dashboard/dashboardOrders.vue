<template>
  <div class="flex justify-between w-full mb-8">
    <h1 class="text-4xl font-bold">後台訂單資訊</h1>

    <button class="btn btn-error" @click="openDeleteAllOrdersModal()">刪除全部訂單</button>
  </div>

  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead class="sticky top-0 z-20">
        <tr>
          <th>索引</th>
          <th>訂單編號</th>
          <th>訂單日期</th>
          <th>聯絡人 / 電話</th>
          <th>電子郵件</th>
          <th>應付金額</th>
          <th>訂單狀態</th>
          <th>行動</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="order.id">
          <th>
            {{ pagination.current_page === 1 ? index + 1 : index + 1 + pagination.current_page * 10 - 10 }}
          </th>
          <td>{{ order.id }}</td>
          <td>{{ $unitFilters.toReadableDate(order.create_at) }}</td>
          <td>{{ order?.user?.name }} / {{ order?.user?.tel }}</td>
          <td>{{ order?.user?.email }}</td>
          <td>{{ $unitFilters.currency(order.total) }}</td>
          <td :class="order.is_paid ? 'text-success' : 'text-error'">
            {{ order.is_paid ? '已付款' : '未付款' }}
          </td>

          <td>
            <div class="btn-group">
              <button class="btn btn-outline btn-square" @click="openEditOrderModal(order)">
                <svg title="編輯" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path
                    d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"
                  />
                </svg>
              </button>
              <button class="btn btn-outline btn-square -ml-px hover:btn-error" @click="openDeleteOrderModal(order)">
                <svg title="刪除" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path
                    d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Pagination :pages="pagination" @pagination-change="paginationChange" />
</template>

<script setup>
import { $vfm } from 'vue-final-modal';
import { ref, inject } from 'vue';
import Pagination from '@/components/AppPagination.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import OrderModal from '@/components/modal/OrderModal.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');
const $loading = inject('$loading');

// UI Data
const orders = ref([]);
const pagination = ref({});

// Remotely get orders by given page number, then render them
function renderOrders(page = 1) {
  const loader = $loading.show();
  axiosWithAuth({
    method: 'get',
    url: `/admin/orders?page=${page}`,
  })
    .then((res) => {
      orders.value = res.data.orders;
      pagination.value = res.data.pagination;
    })
    .finally(() => {
      loader.hide();
    });
}

// Remotely delete coupon by given id
function deleteOrder(orderId) {
  axiosWithAuth({
    method: 'delete',
    url: `/admin/order/${orderId}`,
  }).then(() => {
    renderOrders();
  });
}

function openDeleteOrderModal(targetOrder) {
  $vfm.show({
    component: DashboardDeleteModal,
    bind: {
      dashboardItem: { title: targetOrder.id },
    },
    on: {
      confirm() {
        deleteOrder(targetOrder.id);
      },
    },
    slots: { title: '刪除訂單' },
  });
}

// Remotely edit order from input data
function editOrder(targetOrder) {
  axiosWithAuth({
    method: 'put',
    url: `/admin/order/${targetOrder.data.id}`,
    data: { ...targetOrder },
  }).then(() => {
    renderOrders();
  });
}

function openEditOrderModal(targetOrder) {
  $vfm.show({
    component: OrderModal,
    bind: {
      order: { ...targetOrder },
    },
    on: {
      confirm(modalData) {
        const newProduct = {
          data: {
            ...modalData,
          },
        };
        editOrder(newProduct);
      },
    },
    slots: { title: '編輯訂單' },
  });
}

// Re-render target page provided by pagination component
function paginationChange(page) {
  renderOrders(page);
}

// Remotely delete all order
function deleteAllOrders() {
  axiosWithAuth({
    method: 'delete',
    url: `/admin/orders/all`,
  }).then(() => {
    renderOrders();
  });
}

function openDeleteAllOrdersModal() {
  $vfm.show({
    component: DashboardDeleteModal,
    on: {
      confirm() {
        deleteAllOrders();
      },
    },
    slots: { title: '刪除產品' },
  });
}
renderOrders();
</script>
