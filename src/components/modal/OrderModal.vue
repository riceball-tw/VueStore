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
        <!-- create_at -->
        <div class="form-control w-full">
          <label for="createAt" class="label">
            <span class="label-text">創建日期</span>
          </label>
          <input
            id="createAt"
            v-model="tempOrder.create_at"
            type="date"
            class="input input-bordered w-full"
            placeholder="請輸入訂單創建日期……"
            required
          />
        </div>

        <!-- User name -->
        <div class="form-control w-full">
          <label for="userName" class="label">
            <span class="label-text">聯絡人</span>
          </label>
          <input
            id="userName"
            v-model="tempOrder.user.name"
            class="input input-bordered w-full"
            type="text"
            placeholder="請輸入名稱……"
            required
          />
        </div>

        <!-- User phone -->
        <div class="form-control w-full">
          <label for="userTel" class="label">
            <span class="label-text">電話</span>
          </label>
          <input
            id="userTel"
            v-model="tempOrder.user.tel"
            class="input input-bordered w-full"
            type="tel"
            placeholder="請輸入電話……"
            required
          />
        </div>

        <!-- User Email -->
        <div class="form-control w-full">
          <label for="userEmail" class="label">
            <span class="label-text">電子信箱</span>
          </label>
          <input
            id="userEmail"
            v-model="tempOrder.user.email"
            class="input input-bordered w-full"
            type="email"
            placeholder="請輸入電子信箱……"
            required
          />
        </div>

        <!-- Total -->
        <div class="form-control w-full">
          <label for="total" class="label">
            <span class="label-text">應付金額</span>
          </label>
          <div class="input-group">
            <input
              id="total"
              v-model.number="tempOrder.total"
              class="input input-bordered w-full"
              min="0"
              type="number"
              placeholder="請輸入應付金額……"
              required
            />
            <span>元</span>
          </div>
        </div>

        <!-- is_paid? -->
        <div class="form-control w-full">
          <label for="isEnabled" class="label">
            <span class="label-text">是否付款</span>
            <input
              id="isEnabled"
              v-model="tempOrder.is_paid"
              class="toggle toggle-success"
              type="checkbox"
              :true-value="true"
              :false-value="false"
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
  order: {
    type: Object,
    default() {
      return {};
    },
  },
});

const tempOrder = ref({});
tempOrder.value = { ...props.order };

function formSubmit() {
  const newOrder = {
    ...tempOrder.value,
  };
  newOrder.create_at = toUnixTimestamp(tempOrder.value.create_at);
  emit('confirm', newOrder);
}

onMounted(() => {
  if (tempOrder.value.create_at) {
    const isoString = new Date(tempOrder.value.create_at * 1000).toISOString();
    const formattedDate = new Date(isoString)
      .toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
    tempOrder.value.create_at = formattedDate;
  }
});
</script>
