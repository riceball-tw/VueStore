<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <ul class="bg-red-300">
    <li><router-link :to="{ name: 'home' }">Home</router-link></li>
    <li><router-link :to="{ name: 'about' }">About</router-link></li>
    <li><router-link :to="{ name: 'dashboard' }">Dashboard</router-link></li>
    <li><router-link :to="{ name: 'login' }">Login</router-link></li>
    <li><router-link :to="{ name: 'login' }">Logout</router-link></li>
  </ul>
</template>
