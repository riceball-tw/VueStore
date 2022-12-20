<script setup></script>

<template>
  <router-view />
  <ul class="bg-red-400">
    <li><router-link :to="{ name: 'home' }">Home</router-link></li>
    <li><router-link :to="{ name: 'cart' }">Cart</router-link></li>
  </ul>
</template>
