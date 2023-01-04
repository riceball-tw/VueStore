<template>
  <div class="flex justify-center px-4">
    <div class="steps max-w-[500px] w-full">
      <router-link
        v-for="(step, index) in stepsData"
        :key="step.title"
        class="step"
        :class="{ 'step-primary': index < props.currentStep }"
        :to="{ name: step.link }"
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
    title: '購物車',
    link: 'cart',
  },
  {
    title: '填寫訂單',
    link: 'cartInfo',
  },
  {
    title: '確認付款',
    link: 'cartInfo',
  },
];
</script>
