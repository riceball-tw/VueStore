<template>
  <Suspense>
    <template #default>
      <DashboardProducts />
    </template>
    <template #fallback>
      <h1>產品加載中</h1>
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import DashboardProducts from '@/components/DashboardProducts.vue';
import { useToast } from 'vue-toastification';

onErrorCaptured((err) => {
  useToast().error(`${err}`);
});
</script>
