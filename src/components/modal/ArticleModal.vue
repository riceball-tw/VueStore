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

          <textarea ref="editorComponent" v-model="tempArticle.content"></textarea>
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

// Import
const axiosWithAuth = inject('axiosWithAuth');

const editorComponent = ref(null);
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
const isUploadingImage = ref(false);
tempArticle.value = { ...props.article };

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
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve) => {
            this.sendRequest(file, resolve);
          }),
      );
    }

    sendRequest(file, resolve) {
      const data = new FormData();
      data.append('upload', file);
      axiosWithAuth({
        method: 'post',
        url: `/admin/upload`,
        data,
      }).then((res) => {
        this.loader.image = res.data.image;
        resolve({ default: res.data.image });
      });
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
      // Configure the URL to the upload script in your back-end here!
      new MyUploadAdapter(loader);
  }

  ClassicEditor.create(editorComponent.value, {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'blockQuote',
      '|',
      'uploadImage',
      'link',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    initialData: tempArticle.value.content,
  })
    .then((editor) => {
      window.editor = editor;
      editor.model.document.on('change:data', () => {
        tempArticle.value.content = editor.getData();
      });
    })
    .catch((error) => {
      console.error('There was a problem initializing the editor.', error);
    });

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
</style>
<style>
/* Set CKEditor height in Vue.js [duplicate] */
/* https://stackoverflow.com/questions/53935399/set-ckeditor-height-in-vue-js */
.ck-editor__editable {
  min-height: 200px;
}

.ck-editor {
  max-width: 800px;
}

:root {
  /* Overrides the border radius setting in the theme. */
  --ck-border-radius: 4px;

  /* Overrides the default font size in the theme. */
  --ck-font-size-base: 14px;

  /* Helper variables to avoid duplication in the colors. */
  --ck-custom-background: hsl(270, 1%, 29%);
  --ck-custom-foreground: hsl(255, 3%, 18%);
  --ck-custom-border: hsl(300, 1%, 22%);
  --ck-custom-white: hsl(0, 0%, 100%);

  /* -- Overrides generic colors. ------------------------------------------------------------- */

  --ck-color-base-foreground: var(--ck-custom-background);
  --ck-color-focus-border: hsl(208, 90%, 62%);
  --ck-color-text: hsl(0, 0%, 98%);
  --ck-color-shadow-drop: hsla(0, 0%, 0%, 0.2);
  --ck-color-shadow-inner: hsla(0, 0%, 0%, 0.1);

  /* -- Overrides the default .ck-button class colors. ---------------------------------------- */

  --ck-color-button-default-background: var(--ck-custom-background);
  --ck-color-button-default-hover-background: hsl(270, 1%, 22%);
  --ck-color-button-default-active-background: hsl(270, 2%, 20%);
  --ck-color-button-default-active-shadow: hsl(270, 2%, 23%);
  --ck-color-button-default-disabled-background: var(--ck-custom-background);

  --ck-color-button-on-background: var(--ck-custom-foreground);
  --ck-color-button-on-hover-background: hsl(255, 4%, 16%);
  --ck-color-button-on-active-background: hsl(255, 4%, 14%);
  --ck-color-button-on-active-shadow: hsl(240, 3%, 19%);
  --ck-color-button-on-disabled-background: var(--ck-custom-foreground);

  --ck-color-button-action-background: hsl(168, 76%, 42%);
  --ck-color-button-action-hover-background: hsl(168, 76%, 38%);
  --ck-color-button-action-active-background: hsl(168, 76%, 36%);
  --ck-color-button-action-active-shadow: hsl(168, 75%, 34%);
  --ck-color-button-action-disabled-background: hsl(168, 76%, 42%);
  --ck-color-button-action-text: var(--ck-custom-white);

  --ck-color-button-save: hsl(120, 100%, 46%);
  --ck-color-button-cancel: hsl(15, 100%, 56%);

  /* -- Overrides the default .ck-dropdown class colors. -------------------------------------- */

  --ck-color-dropdown-panel-background: var(--ck-custom-background);
  --ck-color-dropdown-panel-border: var(--ck-custom-foreground);

  /* -- Overrides the default .ck-splitbutton class colors. ----------------------------------- */

  --ck-color-split-button-hover-background: var(--ck-color-button-default-hover-background);
  --ck-color-split-button-hover-border: var(--ck-custom-foreground);

  /* -- Overrides the default .ck-input class colors. ----------------------------------------- */

  --ck-color-input-background: var(--ck-custom-foreground);
  --ck-color-input-border: hsl(257, 3%, 43%);
  --ck-color-input-text: hsl(0, 0%, 98%);
  --ck-color-input-disabled-background: hsl(255, 4%, 21%);
  --ck-color-input-disabled-border: hsl(250, 3%, 38%);
  --ck-color-input-disabled-text: hsl(0, 0%, 46%);

  /* -- Overrides the default .ck-list class colors. ------------------------------------------ */

  --ck-color-list-background: var(--ck-custom-background);
  --ck-color-list-button-hover-background: var(--ck-color-base-foreground);
  --ck-color-list-button-on-background: var(--ck-color-base-active);
  --ck-color-list-button-on-background-focus: var(--ck-color-base-active-focus);
  --ck-color-list-button-on-text: var(--ck-color-base-background);

  /* -- Overrides the default .ck-balloon-panel class colors. --------------------------------- */

  --ck-color-panel-background: var(--ck-custom-background);
  --ck-color-panel-border: var(--ck-custom-border);

  /* -- Overrides the default .ck-toolbar class colors. --------------------------------------- */

  --ck-color-toolbar-background: var(--ck-custom-background);
  --ck-color-toolbar-border: var(--ck-custom-border);

  /* -- Overrides the default .ck-tooltip class colors. --------------------------------------- */

  --ck-color-tooltip-background: hsl(252, 7%, 14%);
  --ck-color-tooltip-text: hsl(0, 0%, 93%);

  /* -- Overrides the default colors used by the ckeditor5-image package. --------------------- */

  --ck-color-image-caption-background: hsl(0, 0%, 97%);
  --ck-color-image-caption-text: hsl(0, 0%, 20%);

  /* -- Overrides the default colors used by the ckeditor5-widget package. -------------------- */

  --ck-color-widget-blurred-border: hsl(0, 0%, 87%);
  --ck-color-widget-hover-border: hsl(43, 100%, 68%);
  --ck-color-widget-editable-focus-background: var(--ck-custom-white);

  /* -- Overrides the default colors used by the ckeditor5-link package. ---------------------- */

  --ck-color-link-default: hsl(190, 100%, 75%);
}
</style>
