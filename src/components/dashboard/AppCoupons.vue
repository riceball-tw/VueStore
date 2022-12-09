<template>
  <h1>優惠券列表</h1>
  <div>
    <button @click="openAddCouponModal()">新增優惠券</button>
  </div>
  <table>
    <thead>
      <tr>
        <th width="120">標題</th>
        <th width="120">是否啟用</th>
        <th width="120">折扣</th>
        <th width="120">到期日</th>
        <th width="120">折扣碼</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="coupon in coupons" :key="coupon.key">
        <td>{{ coupon.title }}</td>
        <td>{{ coupon.is_enabled }}</td>
        <td>{{ coupon.percent }}</td>
        <td>{{ coupon.due_date }}</td>
        <td>{{ coupon.code }}</td>
        <td>
          <div>
            <button @click="openEditCouponModal(coupon)">編輯</button>
            <button @click="openDeleteCouponModal(coupon)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { $vfm } from 'vue-final-modal';
import CouponModal from '@/components/modal/CouponModal.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import getAuthToken from '@/helper/getAuthToken';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { ref } from 'vue';

const coupons = ref([]);
const pagination = ref({});

function renderCoupons() {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupons`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      coupons.value = res.data.coupons;
      pagination.value = res.data.pagination;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function addCoupon(newCoupon) {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupon`,
    headers: {
      Authorization: getAuthToken,
    },
    data: newCoupon,
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCoupons();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
      return err;
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
    slots: {
      title: '新增優惠券',
    },
  });
}

function openEditCouponModal() {}

function deleteProduct(targetProductId) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/coupon/${targetProductId}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderCoupons();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
      return err;
    });
}

function openDeleteCouponModal(targetProduct) {
  $vfm.show({
    component: DashboardDeleteModal,
    bind: {
      dashboardItem: { ...targetProduct },
    },
    on: {
      confirm() {
        deleteProduct(targetProduct.id);
      },
    },
    slots: {
      title: '刪除優惠券',
    },
  });
}

renderCoupons();
</script>
