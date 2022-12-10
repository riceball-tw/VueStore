<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
    <div class="modal__title">
      <slot name="title"></slot>
    </div>
    <form
      id="couponModal"
      @submit.prevent="
        () => {
          close();
          formSubmit();
        }
      "
    >
      <!-- Title -->
      <label>
        名稱
        <input v-model="tempCoupon.title" type="text" placeholder="請輸入優惠券名稱……" required />
      </label>
      <!-- is_enabled -->
      <label>
        已啟用
        <input v-model="tempCoupon.is_enabled" type="number" placeholder="請輸入優惠券啟用狀態……" required />
      </label>
      <!-- percent -->
      <label>
        折扣數
        <input v-model="tempCoupon.percent" type="number" placeholder="請輸入優惠券折扣數……" required />
      </label>
      <!-- due_date -->
      <label>
        到期日
        <input v-model="tempCoupon.due_date" type="date" placeholder="請輸入優惠券到期日……" required />
      </label>
      <!-- code -->
      <label>
        折扣碼
        <input v-model="tempCoupon.code" type="text" placeholder="請輸入優惠券折扣代碼……" required />
      </label>
    </form>
    <div class="modal__action">
      <button form="couponModal" type="submit">確認</button>
      <button @click="close()">取消</button>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, toRefs, unref, onMounted } from 'vue';
import { toUnixTimestamp } from '@/helper/unitFilter';

const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps({
  coupon: {
    type: Object,
    default() {
      return {};
    },
  },
});

const { coupon } = toRefs(props);
const tempCoupon = ref({});
tempCoupon.value = coupon;

function formSubmit() {
  tempCoupon.value.due_date = toUnixTimestamp(tempCoupon.value.due_date);
  emit('confirm', unref(tempCoupon));
}

onMounted(() => {
  if (tempCoupon.value.due_date) {
    const isoString = new Date(tempCoupon.value.due_date * 1000).toISOString();
    const formattedDate = new Date(isoString)
      .toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
    tempCoupon.value.due_date = formattedDate;
  }
});
</script>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
