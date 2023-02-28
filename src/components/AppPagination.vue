<template>
  <nav
    v-if="pages.total_pages && pages.total_pages !== 1"
    class="flex justify-center items-center pb-8"
    aria-label="Page Navigation"
  >
    <div class="btn-group">
      <button v-if="pages.has_pre" class="btn" href="#" aria-label="Previous" @click.prevent="pagePrev(pages)">
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

      <button v-if="pages.has_next" class="btn" aria-label="Next" @click.prevent="pageNext(pages)">
        <span aria-hidden="true">&raquo;</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
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
  emit('pagination-change', pagesData.current_page - 1);
}

function pageNext(pagesData) {
  emit('pagination-change', pagesData.current_page + 1);
}

function pageChange(targetPage) {
  emit('pagination-change', targetPage);
}
</script>
