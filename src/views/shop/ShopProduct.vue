<template>
  <Suspense>
    <template #default>
      <ShopSingleProduct />
    </template>
    <template #fallback>
      <h1>單一產品加載中</h1>
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { useToast } from 'vue-toastification';
import ShopSingleProduct from '@/components/shop/ShopSingleProduct.vue';

onErrorCaptured((err) => {
  useToast().error(`${err}`);
});
</script>
