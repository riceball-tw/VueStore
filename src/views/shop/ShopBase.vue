<script setup>
import Navbar from '@/components/AppNavbar.vue';
import Footer from '@/components/AppFooter.vue';
</script>

<template>
  <Navbar />
  <div class="min-h-screen">
    <router-view />
  </div>
  <Footer />
</template>
