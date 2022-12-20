<script setup>
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

async function loginSubmit(form) {
  const userInfo = {
    username: form.loginEmail.value,
    password: form.loginPassword.value,
  };

  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/admin/signin`,
    data: userInfo,
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      useToast().success(`${res.data.message}`);
      router.push({ name: 'products' });
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}
</script>

<template>
  <form
    class="bg-red-100 p-16"
    @submit.prevent="
      (e) => {
        loginSubmit(e.target);
      }
    "
  >
    <label>
      電子信箱
      <input name="loginEmail" required="" type="email" placeholder="Email address" />
    </label>
    <label>
      密碼
      <input name="loginPassword" required="" type="password" placeholder="Password" />
    </label>
    <button type="submit">登入</button>
  </form>
</template>
