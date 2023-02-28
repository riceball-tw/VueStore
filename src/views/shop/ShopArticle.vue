<template>
  <div class="prose container mx-auto">
    <!-- {{ article }} -->
    <img class="mx-auto mb-8" :src="article.image" :alt="article.title" />

    <h1>
      {{ article.title }}
    </h1>
    <div v-html="article.content"></div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, inject } from 'vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');

const { articleId } = useRoute().params;
const article = ref({});

async function renderArticle() {
  axiosWithAuth({
    method: 'get',
    url: `/article/${articleId}`,
  }).then((res) => {
    article.value = res.data.article;
  });
}

renderArticle();
</script>
