<template>
  <footer class="footer p-10 bg-base-200 text-base-content">
    <div>
      <img width="96" height="96" src="/vueStore-small.svg" alt="Vue Store Logo Small" />
      <p>VueStore Industries Ltd.<br />Providing reliable tech since 1992</p>
    </div>
    <div>
      <span class="footer-title">了解更多</span>
      <router-link :to="{ name: 'about' }">關於我們</router-link>
      <router-link :to="{ name: 'products' }">所有產品</router-link>
      <router-link :to="{ name: 'blog' }">產品文章</router-link>
      <router-link :to="{ name: 'contact' }">聯絡我們</router-link>
    </div>
    <div>
      <span class="footer-title">友站連結</span>
      <a target="_blank" href="https://www.webdong.dev">webdong</a>
      <a target="_blank" href="https://www.tridong.com">tridong</a>
    </div>

    <div>
      <span class="footer-title">後台</span>
      <router-link :to="{ name: 'dashboardHome' }" class="link link-hover">後台首頁</router-link>
      <router-link :to="{ name: 'login' }" class="link link-hover">後台登入</router-link>
    </div>
  </footer>
</template>
