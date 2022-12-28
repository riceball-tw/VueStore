<template>
  <nav v-if="pages.total_pages && pages.total_pages !== 1" aria-label="Page Navigation">
    <div class="btn-group mt-8">
      <button class="btn" href="#" aria-label="Previous" @click.prevent="pagePrev(pages)">
        <span aria-hidden="true">&laquo;</span>
      </button>
      <button
        v-for="page in pages.total_pages"
        :key="page.id"
        class="btn"
        :class="{ 'btn-active': page === pages.current_page }"
        href="#"
        @click.prevent="pageChange(page)"
      >
        {{ page }}
      </button>

      <button class="btn" aria-label="Next" @click.prevent="pageNext(pages)">
        <span aria-hidden="true">&raquo;</span>
      </button>
    </div>
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
