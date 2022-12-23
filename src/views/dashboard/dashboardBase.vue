<template>
  <router-view />
  <ul class="bg-red-400">
    <li><router-link :to="{ name: 'dashboardProducts' }">Products</router-link></li>
    <li><router-link :to="{ name: 'dashboardCoupons' }">Coupons</router-link></li>
    <li><router-link :to="{ name: 'dashboardOrders' }">Orders</router-link></li>
    <li><router-link :to="{ name: 'dashboardArticles' }">Articles</router-link></li>
  </ul>
</template>
