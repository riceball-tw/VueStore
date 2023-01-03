<template>
  <div class="w-full flex justify-center px-4">
    <div class="steps">
      <router-link
        v-for="(step, index) in stepsData"
        :key="step.title"
        class="step"
        :class="{ 'step-primary': index < props.currentStep }"
        :to="step.link"
      >
        {{ step.title }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    default: 0,
  },
});

const stepsData = [
  {
    title: '確認購物車品項',
    link: 'cart',
  },
  {
    title: '填寫訂單資料',
    link: 'cartInfo',
  },
  {
    title: '確認訂單資料並付款',
    link: 'checkout',
  },
];
</script>
