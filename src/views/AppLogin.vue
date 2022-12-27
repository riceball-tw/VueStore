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
      router.push({ name: 'dashboardHome' });
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-base-300">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">登入後台</h2>
        <form
          id="loginForm"
          class="mb-8"
          @submit.prevent="
            (e) => {
              loginSubmit(e.target);
            }
          "
        >
          <!-- Email -->
          <div class="form-control w-full">
            <label for="email" class="label">
              <span class="label-text">電子信箱</span>
            </label>
            <input
              id="email"
              name="loginEmail"
              class="input input-bordered w-full"
              type="email"
              placeholder="請輸入電子信箱……"
              required
            />
          </div>

          <!-- Password -->
          <div class="form-control w-full">
            <label for="loginPassword" class="label">
              <span class="label-text">密碼</span>
            </label>
            <input
              id="loginPassword"
              name="loginPassword"
              class="input input-bordered w-full"
              type="password"
              placeholder="請輸入密碼……"
              required
            />
          </div>
        </form>
        <div class="card-actions justify-end">
          <button form="loginForm" class="btn btn-outline btn-block" type="submit">登入</button>
          <router-link class="btn btn-outline btn-block" :to="{ name: 'home' }">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
              <path d="m12 20-8-8 8-8 1.425 1.4-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            返回商城</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
