<script setup></script>

<template>
  <router-view />
  <ul class="bg-red-300">
    <li><router-link :to="{ name: 'products' }">Products</router-link></li>
    <li><router-link :to="{ name: 'coupons' }">Coupons</router-link></li>
  </ul>
</template>
