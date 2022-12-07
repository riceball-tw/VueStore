<template>
  <nav aria-label="Page navigation example">
    <ul>
      <li>
        <a href="#" aria-label="Previous" @click.prevent="pagePrev(pages)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="page in pages.total_pages" :key="page" :class="{ 'bg-red-300': page === pages.current_page }">
        <a href="#" @click.prevent="pageChange(page)">
          {{ page }}
        </a>
      </li>
      <li>
        <a href="#" aria-label="Next" @click.prevent="pageNext(pages)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useToast } from 'vue-toastification';

const emit = defineEmits(['pagination-change']);

defineProps({
  pages: {
    type: Object,
    default() {
      return {};
    },
  },
});

function pagePrev(pagesData) {
  if (pagesData.has_pre) {
    emit('pagination-change', pagesData.current_page - 1);
  } else {
    useToast().warning('已經沒有上一頁了');
  }
}

function pageNext(pagesData) {
  if (pagesData.has_next) {
    emit('pagination-change', pagesData.current_page + 1);
  } else {
    useToast().warning('已經沒有下一頁了');
  }
}

function pageChange(targetPage) {
  emit('pagination-change', targetPage);
}
</script>
