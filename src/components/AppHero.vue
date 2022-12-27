<template>
  <div class="hero bg-base-200">
    <div class="hero-content py-8 text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">{{ title }}</h1>
        <p class="py-6">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
    default() {
      return '預設標題';
    },
  },
  description: {
    type: String,
    default() {
      return '';
    },
  },
});
</script>
