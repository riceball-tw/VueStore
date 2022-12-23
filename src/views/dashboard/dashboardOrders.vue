<template>
  <Suspense>
    <template #default>
      <DashboardOrders />
    </template>
    <template #fallback>
      <h1>產品加載中</h1>
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { useToast } from 'vue-toastification';
import DashboardOrders from '@/components/dashboard/AppOrders.vue';

onErrorCaptured((err) => {
  useToast().error(`${err}`);
});
</script>
