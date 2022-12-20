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
import { useToast } from 'vue-toastification';
import DashboardProducts from '@/components/dashboard/AppProducts.vue';

onErrorCaptured((err) => {
  useToast().error(`${err}`);
});
</script>
