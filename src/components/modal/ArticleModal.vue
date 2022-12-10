<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
    <span class="modal__title">
      <slot name="title"></slot>
    </span>
    <form
      id="articleForm"
      class="flex flex-col"
      @submit.prevent="
        () => {
          close();
          modalSubmit();
        }
      "
    >
      <!-- title -->
      <label>
        標題
        <input v-model="tempArticle.title" type="text" placeholder="請輸入文章標題" required />
      </label>
      <!-- description -->
      <label>
        簡述
        <input v-model="tempArticle.description" type="text" placeholder="請輸入文章簡述" />
      </label>
      <!-- image -->
      <label>
        圖片
        <input v-model="tempArticle.image" type="text" placeholder="請輸入文章標題" />
      </label>
      <!-- tag -->
      <label>
        標籤
        <input v-model="tempArticle.tag" type="text" placeholder="請輸入文章標題" />
      </label>
      <!-- create_at -->
      <label>
        創建日期
        <input v-model.number="tempArticle.create_at" type="text" placeholder="請輸入文章標題" required />
      </label>
      <!-- author -->
      <label>
        作者
        <input v-model="tempArticle.author" type="text" placeholder="請輸入文章標題" required />
      </label>
      <!-- isPublic -->
      <label>
        是否公開
        <input v-model="tempArticle.isPublic" type="checkbox" placeholder="請輸入文章標題" />
      </label>
      <!-- content -->
      <label>
        內容
        <input v-model="tempArticle.content" type="text" placeholder="請輸入文章標題" required />
      </label>
    </form>

    <div class="modal__action">
      <button type="submit" form="articleForm">確認</button>
      <button @click="close()">取消</button>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, toRefs, unref } from 'vue';

const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps({
  article: {
    type: Object,
    default() {
      return {};
    },
  },
});

const tempArticle = ref({});
const { article } = toRefs(props);
tempArticle.value = unref(article);

if (!tempArticle.value.isPublic) {
  tempArticle.value.isPublic = false;
}
if (!tempArticle.value.create_at) {
  tempArticle.value.create_at = Math.floor(Date.now() / 1000);
}

function modalSubmit() {
  emit('confirm', unref(tempArticle));
}
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
