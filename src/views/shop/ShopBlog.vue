<template>
  <Hero title="部落格" description="一些關於這個網站的部落格描述可撰寫於此。" />

  <div class="flex flex-wrap m-8 gap-4">
    <div v-for="article in articles" :key="article.id" class="card">
      <div class="card w-96 bg-base-100 shadow-xl">
        {{ image }}
        <figure><img :src="article.image" :alt="article.title" /></figure>
        <div class="card-body">
          <h2 class="card-title">{{ article.title }}</h2>
          <div class="flex gap-2">
            <span v-for="tag in article.tag" :key="tag.text" class="badge badge-ghost">
              {{ tag.text }}
            </span>
          </div>
          <p>{{ article.description }}</p>
          <div class="card-actions justify-end">
            <router-link :to="`article/${article.id}`" class="btn btn-primary">了解更多</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Hero from '@/components/AppHero.vue';
import { ref, inject } from 'vue';

// UI Data
const articles = ref([]);

const axiosWithAuth = inject('axiosWithAuth');

function renderArticles() {
  axiosWithAuth({
    method: 'get',
    url: `articles`,
  }).then((res) => {
    articles.value = res.data.articles;
  });
}

renderArticles();
</script>
