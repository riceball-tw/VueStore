<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="flex justify-center items-center">
    <div class="modal-box w-full max-w-none p-8">
      <div class="text-3xl font-bold mb-8">
        <slot name="title" />
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
        <div class="form-control w-full">
          <label for="title" class="label">
            <span class="label-text">名稱</span>
          </label>
          <input
            id="title"
            v-model="tempCoupon.title"
            class="input input-bordered w-full"
            type="text"
            placeholder="請輸入優惠券名稱……"
            required
          />
        </div>

        <!-- code -->
        <div class="form-control w-full">
          <label for="code" class="label">
            <span class="label-text">折扣碼</span>
          </label>
          <input
            id="code"
            v-model="tempCoupon.code"
            class="input input-bordered w-full"
            type="text"
            placeholder="請輸入優惠券折扣代碼……"
            required
          />
        </div>

        <!-- percent -->
        <div class="form-control w-full">
          <label for="percent" class="label">
            <span class="label-text">折扣數</span>
          </label>
          <div class="input-group">
            <input
              id="percent"
              v-model="tempCoupon.percent"
              class="input input-bordered w-full"
              type="number"
              min="1"
              placeholder="請輸入優惠券折扣數……"
              required
            />
            <span>%</span>
          </div>
        </div>
        <!-- due_date -->
        <div class="form-control w-full">
          <label for="dueDate" class="label">
            <span class="label-text">到期日</span>
          </label>
          <input
            id="dueDate"
            v-model="tempCoupon.due_date"
            type="date"
            class="input input-bordered w-full"
            placeholder="請輸入優惠券到期日……"
            required
          />
        </div>

        <!-- is_enabled -->
        <div class="form-control w-full">
          <label for="isEnabled" class="label">
            <span class="label-text">是否啟用</span>
            <input
              v-model="tempCoupon.is_enabled"
              class="toggle toggle-success"
              type="checkbox"
              :true-value="1"
              :false-value="0"
            />
          </label>
        </div>
      </form>
      <div class="modal-action flex flex-wrap gap-4">
        <button class="btn btn-primary btn-wide" form="couponModal" type="submit">確認</button>
        <button class="btn" @click="close()">取消</button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const tempCoupon = ref({});
tempCoupon.value = { ...props.coupon };

function formSubmit() {
  const newCoupon = {
    title: tempCoupon.value.title,
    is_enabled: tempCoupon.value.is_enabled ?? 0,
    percent: tempCoupon.value.percent,
    due_date: toUnixTimestamp(tempCoupon.value.due_date),
    code: tempCoupon.value.code,
  };
  emit('confirm', newCoupon);
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
