<template>
  <ul class="bg-red-300">
    <li><router-link :to="{ name: 'home' }">Home</router-link></li>
    <li><router-link :to="{ name: 'about' }">About</router-link></li>
    <li><router-link :to="{ name: 'dashboard' }">Dashboard</router-link></li>
    <li><router-link :to="{ name: 'login' }">Login</router-link></li>
    <li><router-link :to="{ name: 'login' }" @click="logoutClicked">Logout</router-link></li>
  </ul>
</template>

<script setup>
import getAuthToken from '@/helper/getAuthToken';
import { useToast } from 'vue-toastification';
import axios from 'axios';

function logoutClicked() {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/logout`,
    headers: {
      Authorization: getAuthToken(),
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}
</script>
