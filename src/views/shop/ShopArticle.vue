<template>
  <div class="container mx-auto">
    {{ article }}
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
