<template>
  <Suspense>
    <template #default>
      <ShopCart />
    </template>
    <template #fallback>
      <h1>購物車加載中</h1>
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { useToast } from 'vue-toastification';
import ShopCart from '@/components/shop/ShopCart.vue';

onErrorCaptured((err) => {
  useToast().error(`${err}`);
});
</script>
