<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" classes="flex justify-center items-center">
    <div class="modal-box w-full max-w-none p-8">
      <div class="text-3xl font-bold mb-8">
        <slot name="title" />
      </div>
      <form
        id="productForm"
        class="mb-8 flex flex-col md:flex-row gap-8"
        @submit.prevent="
          () => {
            close();
            modalSubmit();
          }
        "
      >
        <!-- Image Sidebar -->
        <div class="flex gap-4 flex-col">
          <img v-if="tempProduct.imageUrl" :src="tempProduct.imageUrl" />
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

            <span class="tracking-widest">請上傳首頁圖片</span>
          </label>

          <!-- Image Url -->
          <div class="form-control w-full">
            <label for="imageUrl" class="label">
              <span class="label-text">圖片連結</span>
            </label>

            <div class="flex gap-2">
              <input
                id="imageUrl"
                v-model="tempProduct.imageUrl"
                class="input input-bordered w-full"
                type="text"
                placeholder="請輸入圖片連結……"
              />
              <button
                v-if="tempProduct.imageUrl"
                type="button"
                class="btn btn-outline btn-square"
                @click="
                  () => {
                    tempProduct.imageUrl = '';
                  }
                "
              >
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
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

          <hr class="divider border-none" />

          <template v-for="(image, index) in tempProduct.imagesUrl" :key="index">
            <img v-if="tempProduct.imagesUrl[index]" :src="tempProduct.imagesUrl[index]" />
            <label
              v-else
              :for="`imagesUrl-${index}`"
              class="text-sm flex flex-col items-center justify-center p-8 bg-base-300 rounded-lg cursor-pointer"
            >
              <svg class="mb-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path
                  d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30Zm2.8-4.85h24.45l-7.35-9.8-6.6 8.55-4.65-6.35ZM9 39V9v30Z"
                />
              </svg>
              <span class="tracking-widest">請上傳產品圖片</span>
            </label>
            <!-- Image Url -->
            <div class="form-control w-full">
              <label for="imageUrl" class="label">
                <span class="label-text">圖片連結</span>
              </label>

              <div class="flex gap-2">
                <input
                  v-model="tempProduct.imagesUrl[index]"
                  class="input input-bordered w-full"
                  type="text"
                  placeholder="請輸入圖片連結……"
                />
                <button
                  v-if="tempProduct.imagesUrl[index]"
                  type="button"
                  class="btn btn-outline btn-square"
                  @click="
                    () => {
                      tempProduct.imagesUrl[index] = '';
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
              <label for="imageUpload" class="label">
                <span class="label-text">或上傳新圖片</span>
              </label>
              <input
                :id="`imagesUrl-${index}`"
                name="imageFile"
                class="file-input input-bordered w-full"
                type="file"
                @change="
                  (e) => {
                    uploadMultipleImageFile(e.target.files[0], index);
                  }
                "
              />
            </div>
          </template>

          <button type="button" class="btn btn-full btn-outline" @click="handleAddMultiImage">新增圖片</button>
        </div>

        <!-- Area 02 -->
        <div class="flex gap-4 flex-col w-full">
          <!-- Title -->
          <div class="form-control w-full">
            <label for="title" class="label">
              <span class="label-text">標題</span>
            </label>
            <input
              id="title"
              v-model="tempProduct.title"
              class="input input-bordered w-full"
              type="text"
              placeholder="請輸入標題……"
              required
            />
          </div>

          <div>
            <div class="flex gap-4 flex-wrap md:flex-nowrap">
              <!-- Category -->
              <div class="form-control w-full">
                <label for="category" class="label">
                  <span class="label-text">分類</span>
                </label>

                <input
                  id="category"
                  v-model="tempProduct.category"
                  class="input input-bordered w-full"
                  type="text"
                  placeholder="請輸入分類……"
                  required
                />
              </div>

              <!-- Unit -->
              <div class="form-control w-full">
                <label for="unit" class="label">
                  <span class="label-text">產品單位</span>
                </label>
                <input
                  id="unit"
                  v-model="tempProduct.unit"
                  class="input input-bordered w-full"
                  type="text"
                  placeholder="請輸入產品單位……"
                  required
                />
              </div>
            </div>
          </div>

          <div class="flex gap-4 flex-wrap md:flex-nowrap">
            <!-- Original Price -->
            <div class="form-control w-full">
              <label for="originalPrice" class="label">
                <span class="label-text">原價</span>
              </label>
              <div class="input-group">
                <input
                  id="originalPrice"
                  v-model.number="tempProduct.origin_price"
                  class="input input-bordered w-full"
                  type="number"
                  placeholder="請輸入原價……"
                  min="1"
                  required
                />
                <span>元</span>
              </div>
            </div>

            <!-- Price -->
            <div class="form-control w-full">
              <label for="price" class="label">
                <span class="label-text">售價</span>
              </label>
              <div class="input-group">
                <input
                  id="price"
                  v-model.number="tempProduct.price"
                  class="input input-bordered w-full"
                  type="number"
                  placeholder="請輸入售價……"
                  min="1"
                  required
                />
                <span>元</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="form-control w-full">
            <label for="description" class="label">
              <span class="label-text">產品描述</span>
            </label>
            <textarea
              id="description"
              v-model="tempProduct.description"
              class="textarea input-bordered"
              placeholder="請輸入產品描述……"
            ></textarea>
          </div>

          <!-- Content -->
          <div class="form-control w-full">
            <label for="content" class="label">
              <span class="label-text">說明內容</span>
            </label>
            <textarea
              id="content"
              v-model="tempProduct.content"
              class="textarea input-bordered"
              placeholder="請輸入產品說明內容……"
            ></textarea>
          </div>

          <!-- isEnabled? -->
          <div class="form-control w-full">
            <label for="isEnabled" class="label">
              <span class="label-text">是否啟用</span>
              <input
                id="isEnabled"
                v-model="tempProduct.is_enabled"
                class="toggle toggle-success"
                type="checkbox"
                :true-value="1"
                :false-value="0"
              />
            </label>
          </div>
        </div>
      </form>

      <div class="modal-action flex flex-wrap gap-4">
        <button class="btn btn-primary btn-wide" type="submit" form="productForm">確認</button>
        <button class="btn" @click="close()">取消</button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import getAuthToken from '@/helper/getAuthToken';

const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps({
  product: {
    type: Object,
    default() {
      return {
        id: '',
        imageUrl: '',
        imagesUrl: [],
        description: '',
        content: '',
        is_enabled: 0,
      };
    },
  },
});

const tempProduct = ref({});
tempProduct.value = { ...props.product };

function modalSubmit() {
  const newProduct = {
    // required
    id: tempProduct.value.id,
    title: tempProduct.value.title,
    category: tempProduct.value.category,
    unit: tempProduct.value.unit,
    origin_price: tempProduct.value.origin_price,
    price: tempProduct.value.price,
    // Optional
    imagesUrl: tempProduct.value.imagesUrl,
    description: tempProduct.value.description,
    content: tempProduct.value.content,
    is_enabled: tempProduct.value.is_enabled,
    imageUrl: tempProduct.value.imageUrl,
  };
  emit('confirm', newProduct);
}

function handleAddMultiImage() {
  // Backend doesn't accept store empty array, So we need to detect it
  if (!tempProduct.value.imagesUrl) {
    tempProduct.value.imagesUrl = [];
  }
  tempProduct.value.imagesUrl.push('');
}

function uploadImageFile(imageFile) {
  const imageFormData = new FormData();
  imageFormData.append('file-to-upload', imageFile);

  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/upload`,
    headers: {
      Authorization: getAuthToken(),
    },
    data: imageFormData,
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      tempProduct.value.imageUrl = res.data.imageUrl;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function uploadMultipleImageFile(imageFile, updateIndex) {
  const imageFormData = new FormData();
  imageFormData.append('file-to-upload', imageFile);

  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/upload`,
    headers: {
      Authorization: getAuthToken(),
    },
    data: imageFormData,
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      tempProduct.value.imagesUrl[updateIndex] = res.data.imageUrl;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>
