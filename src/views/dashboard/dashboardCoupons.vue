<template>
  <div class="flex justify-between w-full mb-8">
    <h1 class="text-4xl font-bold">後台優惠券資訊</h1>

    <button class="btn btn-primary" @click="openAddCouponModal()">新增優惠券</button>
  </div>
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead class="sticky top-0 z-20">
        <tr>
          <th>索引</th>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>折扣碼</th>
          <th>啟用狀態</th>
          <th>行動</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coupon, index) in coupons" :key="coupon.id">
          <th>
            {{ pagination.current_page === 1 ? index + 1 : index + 1 + pagination.current_page * 10 - 10 }}
          </th>
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.percent }}%</td>
          <td>{{ $unitFilters.toReadableDate(coupon.due_date) }}</td>
          <td>{{ coupon.code }}</td>
          <td>
            <span v-if="coupon.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-warning">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline btn-square" @click="openEditCouponModal(coupon)">
                <svg title="編輯" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path
                    d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"
                  />
                </svg>
              </button>
              <button class="btn btn-outline btn-square hover:btn-error -ml-px" @click="openDeleteCouponModal(coupon)">
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
import { ref, inject } from 'vue';
import { $vfm } from 'vue-final-modal';
import CouponModal from '@/components/modal/CouponModal.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import Pagination from '@/components/AppPagination.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');

// UI Data
const coupons = ref([]);
const pagination = ref({});

// Remotely get coupons by given page number, then render them
function renderCoupons(page = 1) {
  axiosWithAuth({
    method: 'get',
    url: `/admin/coupons/?page=${page}`,
  }).then((res) => {
    coupons.value = res.data.coupons;
    pagination.value = res.data.pagination;
  });
}

// Re-render target page provided by pagination component
function paginationChange(page) {
  renderCoupons(page);
}

function addCoupon(newCoupon) {
  axiosWithAuth({
    method: 'post',
    url: `/admin/coupon`,
    data: newCoupon,
  }).then(() => {
    renderCoupons();
  });
}

function openAddCouponModal() {
  $vfm.show({
    component: CouponModal,
    on: {
      confirm(modalData) {
        const newCoupon = {
          data: {
            ...modalData,
          },
        };

        addCoupon(newCoupon);
      },
    },
    slots: { title: '新增優惠券' },
  });
}

function editCoupon(targetCoupon) {
  axiosWithAuth({
    method: 'put',
    url: `/admin/coupon/${targetCoupon.id}`,
    data: targetCoupon,
  }).then(() => {
    renderCoupons();
  });
}

function openEditCouponModal(targetCoupon) {
  $vfm.show({
    component: CouponModal,
    bind: {
      coupon: { ...targetCoupon },
    },
    on: {
      confirm(modalData) {
        const newCoupon = {
          data: {
            ...modalData,
          },
        };

        editCoupon(newCoupon);
      },
    },
    slots: { title: '編輯優惠券' },
  });
}

function deleteCoupon(targetCouponId) {
  axiosWithAuth({
    method: 'delete',
    url: `/admin/coupon/${targetCouponId}`,
  }).then(() => {
    renderCoupons();
  });
}

function openDeleteCouponModal(targetCoupon) {
  $vfm.show({
    component: DashboardDeleteModal,
    bind: { dashboardItem: { ...targetCoupon } },
    on: {
      confirm() {
        deleteCoupon(targetCoupon.id);
      },
    },
    slots: { title: '刪除優惠券' },
  });
}

renderCoupons();
</script>
