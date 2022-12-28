<template>
  <vue-final-modal v-slot="{ close }" classes="flex justify-center items-center" v-bind="$attrs">
    <div class="modal-box text-center w-full">
      <div class="text-3xl font-bold mb-8">
        <slot name="title"></slot>
      </div>
      <div class="mb-8">
        <p class="text-xl">
          確定要刪除<em v-if="dashboardItem" class="not-italic font-bold"> {{ dashboardItem.title }} </em>項目？
        </p>
      </div>
      <div class="modal-action justify-center">
        <button class="btn btn-outline" type="button" @click="close()">取消</button>
        <button
          class="btn btn-error"
          @click="
            () => {
              close();
              confirmDelete();
            }
          "
        >
          確定
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
const emit = defineEmits(['confirm']);
defineProps({
  dashboardItem: {
    type: Object,
    default() {
      return {};
    },
  },
});

function confirmDelete() {
  emit('confirm');
}
</script>

<script>
export default {
  name: 'DashboardDeleteModal',
  inheritAttrs: false,
};
</script>
