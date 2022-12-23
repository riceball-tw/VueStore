<template>
  <Suspense>
    <template #default>
      <ShopCartInfo />
    </template>
    <template #fallback>
      <h1>購物車加載中</h1>
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { useToast } from 'vue-toastification';
import ShopCartInfo from '@/components/shop/ShopCartInfo.vue';

onErrorCaptured((err) => {
  useToast().error(`${err}`);
});
</script>
