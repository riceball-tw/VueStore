<script setup>
import Navbar from '@/components/AppNavbar.vue';
import Footer from '@/components/AppFooter.vue';
</script>

<template>
  <Navbar />
  <div class="min-h-screen">
    <div class="text-center p-32">
      <div class="mb-8">
        <h1 class="text-9xl font-bold mb-8">404</h1>
        <p class="text-xl tracking-widest">無法找到該頁面</p>
      </div>
      <router-link class="btn btn-outline hover:btn-primary" :to="{ name: 'products' }">回到商城</router-link>
    </div>
  </div>
  <Footer />
</template>
