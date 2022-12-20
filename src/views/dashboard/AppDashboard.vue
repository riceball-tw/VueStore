<template>
  <router-view />
  <ul class="bg-red-400">
    <li><router-link :to="{ name: 'products' }">Products</router-link></li>
    <li><router-link :to="{ name: 'coupons' }">Coupons</router-link></li>
    <li><router-link :to="{ name: 'orders' }">Orders</router-link></li>
    <li><router-link :to="{ name: 'articles' }">Articles</router-link></li>
  </ul>
</template>
