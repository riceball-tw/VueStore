<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="flex justify-center items-center">
    <div style="max-width: 1200px" class="modal-box w-full max-w-none p-8">
      <div class="text-3xl font-bold mb-8">
        <slot name="title" />
      </div>
      <form
        id="articleForm"
        class="flex gap-4 flex-col xl:flex-row"
        @submit.prevent="
          () => {
            close();
            modalSubmit();
          }
        "
      >
        <div>
          <!-- Title -->
          <div class="form-control w-full">
            <label for="title" class="label">
              <span class="label-text">標題</span>
            </label>
            <input
              id="title"
              v-model="tempArticle.title"
              class="input input-bordered w-full"
              type="text"
              placeholder="請輸入文章標題……"
              required
            />
          </div>

          <!-- Tag -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">標籤</span>
            </label>
            <vue-tags-input
              v-model="tag"
              placeholder="請輸入標籤……"
              :tags="tempArticle.tag"
              @tags-changed="(newTags) => (tempArticle.tag = newTags)"
            />
          </div>

          <!-- Author -->
          <div class="form-control w-full">
            <label for="author" class="label">
              <span class="label-text">作者</span>
            </label>
            <input
              id="author"
              v-model="tempArticle.author"
              class="input input-bordered w-full"
              type="text"
              placeholder="請輸入文章作者……"
              required
            />
          </div>

          <!-- create_at -->
          <div class="form-control w-full">
            <label for="createAt" class="label">
              <span class="label-text">創建日期</span>
            </label>
            <input
              id="createAt"
              v-model="tempArticle.create_at"
              type="date"
              class="input input-bordered w-full"
              placeholder="請輸入優惠券到期日……"
              required
            />
          </div>

          <!-- Description -->
          <div class="form-control w-full">
            <label for="description" class="label">
              <span class="label-text">簡述</span>
            </label>
            <textarea
              id="description"
              v-model="tempArticle.description"
              class="textarea input-bordered"
              placeholder="請輸入文章簡述……"
            ></textarea>
          </div>

          <!-- isPublic? -->
          <div class="form-control w-full">
            <label for="isPublic" class="label">
              <span class="label-text">是否公開</span>
              <input
                id="isPublic"
                v-model="tempArticle.isPublic"
                class="toggle toggle-success"
                type="checkbox"
                :true-value="true"
                :false-value="false"
              />
            </label>
          </div>
        </div>
        <div>
          <!-- Image Input -->
          <div class="max-w-[500px]">
            <img v-if="tempArticle.image" :src="tempArticle.image" />
            <label
              v-else
              for="imageUpload"
              class="text-sm flex flex-col items-center justify-center p-8 bg-base-300 rounded-lg cursor-pointer"
            >
              <svg class="mb-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path
                  d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30Zm2.8-4.85h24.45l-7.35-9.8-6.6 8.55-4.65-6.35ZM9 39V9v30Z"
                />
              </svg>

              <span class="tracking-widest">
                <span v-if="!isUploadingImage">請上傳首頁圖片</span>
                <span v-else>圖片上傳中……</span>
              </span>
            </label>

            <!-- Image Url -->
            <div class="form-control w-full">
              <label for="image" class="label">
                <span class="label-text">圖片連結</span>
              </label>

              <div class="flex gap-2">
                <input
                  id="image"
                  v-model="tempArticle.image"
                  :disabled="isUploadingImage"
                  class="input input-bordered w-full"
                  type="text"
                  placeholder="請輸入圖片連結……"
                />
                <button
                  v-if="tempArticle.image"
                  type="button"
                  class="btn btn-outline btn-square"
                  @click="
                    () => {
                      tempArticle.image = '';
                    }
                  "
                >
                  <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                    <path
                      d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Image Upload -->
            <div class="form-control w-full hidden">
              <input
                id="imageUpload"
                name="imageFile"
                class="file-input input-bordered w-full"
                type="file"
                @change="
                  (e) => {
                    uploadImageFile(e.target.files[0]);
                  }
                "
              />
            </div>
          </div>

          <label for="content" class="label">
            <span class="label-text">說明內容</span>
          </label>

          <ckeditor v-model="tempArticle.content" :editor="ClassicEditor" :config="ckeditorConfig()"></ckeditor>
        </div>
      </form>

      <div class="modal-action flex flex-wrap gap-4">
        <button class="btn btn-primary btn-wide" type="submit" form="articleForm">確認</button>
        <button class="btn" @click="close()">取消</button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue';
import { toUnixTimestamp } from '@/helper/unitFilter';
import VueTagsInput from '@sipec/vue3-tags-input';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ckeditorConfig from '@/helper/ckeditorConfig';

// Import
const axiosWithAuth = inject('axiosWithAuth');

const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps({
  article: {
    type: Object,
    default() {
      return {};
    },
  },
});

const tempArticle = ref({ ...props.article });
const isUploadingImage = ref(false);
const tag = ref('');

if (!tempArticle.value.isPublic) {
  tempArticle.value.isPublic = false;
}

function uploadImageFile(imageFile) {
  const imageFormData = new FormData();
  imageFormData.append('file-to-upload', imageFile);
  isUploadingImage.value = true;
  axiosWithAuth({
    method: 'post',
    url: `/admin/upload`,
    data: imageFormData,
  })
    .then((res) => {
      tempArticle.value.image = res.data.imageUrl;
    })
    .finally(() => {
      isUploadingImage.value = false;
    });
}

function modalSubmit() {
  const newArticle = {
    id: tempArticle.value.id,
    title: tempArticle.value.title,
    author: tempArticle.value.author,
    description: tempArticle.value.description,
    content: tempArticle.value.content,
    create_at: toUnixTimestamp(tempArticle.value.create_at),
    image: tempArticle.value.image,
    tag: tempArticle.value.tag,
    isPublic: tempArticle.value.isPublic,
  };
  emit('confirm', newArticle);
}

onMounted(() => {
  if (tempArticle.value.create_at) {
    const isoString = new Date(tempArticle.value.create_at * 1000).toISOString();
    const formattedDate = new Date(isoString)
      .toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
    tempArticle.value.create_at = formattedDate;
  }
});
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>
<style lang="css">
/* style the background and the text color of the input ... */
.vue-tags-input {
  background: transparent !important;
}
.vue-tags-input,
.ti-focus,
.ti-input {
  border: none !important;
}

.ck-editor__editable {
  min-height: 200px;
}

.ck-editor {
  max-width: 800px;
}
</style>
