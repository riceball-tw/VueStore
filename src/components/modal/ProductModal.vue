<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
    <span class="modal__title">
      <slot name="title"></slot>
    </span>
    <form
      id="productForm"
      @submit.prevent="
        () => {
          close();
          modalSubmit();
        }
      "
    >
      <!-- Image -->
      <div>
        <label>
          輸入圖片網址
          <input type="text" placeholder="請輸入圖片連結" />
        </label>
        <label>
          或 上傳圖片
          <input ref="fileInput" type="file" @change="uploadFile" />
        </label>
        <img :src="tempProduct.imageUrl" alt="" />

        <div>
          <input type="url" placeholder="請輸入連結" /> <button type="button">移除</button>
          <button>新增圖片</button>
        </div>
      </div>

      <!-- Info -->
      <div>
        <label>
          標題
          <input v-model="tempProduct.title" type="text" placeholder="請輸入標題" required />
        </label>

        <label>
          分類
          <input v-model="tempProduct.category" type="text" placeholder="請輸入分類" required />
        </label>
        <label>
          單位
          <input v-model="tempProduct.unit" type="text" placeholder="請輸入單位" required />
        </label>

        <div>
          <label>
            原價
            <input v-model.number="tempProduct.origin_price" type="number" placeholder="請輸入原價" required />
          </label>
          <label>
            售價
            <input v-model.number="tempProduct.price" type="number" placeholder="請輸入售價" required />
          </label>
        </div>

        <label>
          產品描述
          <textarea placeholder="請輸入產品描述"></textarea>
        </label>
        <label>
          說明內容
          <textarea placeholder="請輸入產品說明內容"></textarea>
        </label>

        <!-- isEnabled? -->
        <div>
          <label>是否啟用<input type="checkbox" /></label>
        </div>
      </div>
    </form>

    <div class="modal__action">
      <button type="submit" form="productForm">確認</button>
      <button @click="close()">取消</button>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, toRefs, unref } from 'vue';

const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps({
  product: {
    type: Object,
    default() {
      return {};
    },
  },
});

const tempProduct = ref({});
const { product } = toRefs(props);
tempProduct.value = product;

function modalSubmit() {
  emit('confirm', unref(tempProduct));
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
