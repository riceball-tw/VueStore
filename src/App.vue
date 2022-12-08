<script setup>
import Navbar from '@/components/AppNavbar.vue';
import { ModalsContainer } from 'vue-final-modal';
</script>

<template>
  <Navbar />
  <router-view />
  <modals-container></modals-container>
</template>
