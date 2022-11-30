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
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

async function logout(authToken) {
  const response = await fetch(`${import.meta.env.VITE_APP_API}/logout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: authToken },
  });
  if (!response.ok) throw new Error(`發生錯誤，${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤，${responseJSON.message}`);
  return responseJSON;
}

function logoutClicked() {
  logout(getAuthToken)
    .then((responseJSON) => {
      Toastify({
        text: `${responseJSON.message}`,
        duration: 2000,
      }).showToast();
    })
    .catch((err) => {
      Toastify({
        text: `${err.message}`,
        duration: 2000,
      }).showToast();
    });
}
</script>
