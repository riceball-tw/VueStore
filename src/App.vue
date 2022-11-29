<script setup>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

async function login(form) {
  const response = await fetch(`${import.meta.env.VITE_APP_API}/admin/signin`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: `{"username":"${form.loginEmail.value}","password":"${form.loginPassword.value}"}`,
  });
  if (!response.ok) throw new Error(`發生錯誤：${response.status}`);
  const responseJSON = await response.json();
  if (!responseJSON.success) throw new Error(`發生錯誤：${responseJSON.message}`);
  return responseJSON;
}

async function loginSubmit(form) {
  login(form)
    .then((responseJSON) => {
      const { token, expired } = responseJSON;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
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

<template>
  <div class="bg-green-100 min-h-screen flex justify-center items-center">
    <section>
      <h2 class="text-4xl font-bold">Login</h2>
      <form
        @submit.prevent="
          (e) => {
            loginSubmit(e.target);
          }
        "
      >
        <label
          >Email address
          <input name="loginEmail" required="" type="email" placeholder="Email address" />
        </label>
        <label>
          Password
          <input name="loginPassword" required="" type="password" placeholder="Password" />
        </label>
        <button type="submit">登入</button>
      </form>
    </section>
  </div>
</template>
