<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
    <slot name="title"></slot>
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
        <input v-model="tempCoupon.title" type="text" placeholder="請輸入優惠券名稱……" required />
      </label>
      <!-- is_enabled -->
      <input v-model="tempCoupon.is_enabled" type="number" placeholder="請輸入優惠券名稱……" required />
      <!-- percent -->
      <input v-model="tempCoupon.percent" type="number" placeholder="請輸入優惠券名稱……" required />
      <!-- due_date -->
      <input v-model="tempCoupon.due_date" type="date" placeholder="請輸入優惠券名稱……" required />
      <!-- code -->
      <input v-model="tempCoupon.code" type="text" placeholder="請輸入優惠券名稱……" required />
    </form>
    <div class="modal__action">
      <button form="couponModal" type="submit">confirm</button>
      <button @click="close()">cancel</button>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, toRefs, unref } from 'vue';

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
  // Convert due_date to unix timestamp
  tempCoupon.value.due_date = new Date(tempCoupon.value.due_date).getTime() / 1000;
  emit('confirm', unref(tempCoupon));
}
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
