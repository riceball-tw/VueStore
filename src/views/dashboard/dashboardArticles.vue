<template>
  <!-- Section Title -->
  <div class="flex justify-between w-full mb-8">
    <h1 class="text-4xl font-bold">後台文章資訊</h1>
    <button type="button" class="btn btn-primary" @click="openAddArticleModal()">新增文章</button>
  </div>
  <!-- Table -->
  <div v-if="articles.length" class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>索引</th>
          <th>圖片</th>
          <th>標題</th>
          <th>簡述</th>
          <th>標籤</th>
          <th>創建時間</th>
          <th>作者</th>
          <th>是否公開</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in articles" :key="article.key">
          <th>{{ pagination.current_page === 1 ? index + 1 : index + 1 + pagination.current_page * 10 - 10 }}</th>
          <td>
            <img class="rounded" width="150" :src="article.image" :alt="article.image ? article.title : 'x'" />
          </td>
          <td class="whitespace-normal prose">{{ article.title }}</td>
          <td class="whitespace-normal prose">{{ article.description }}</td>
          <td v-if="article?.tag?.length">
            <div class="gap-2 flex">
              <span v-for="tag in article.tag" :key="tag" class="badge-lg badge badge-outline">
                {{ tag.text }}
              </span>
            </div>
          </td>
          <td v-else>無標籤</td>
          <td>{{ $unitFilters.toReadableDate(article.create_at) }}</td>
          <td>{{ article.author }}</td>
          <td>
            <span v-if="article.isPublic" class="text-success">公開</span>
            <span v-else class="text-warning">不公開</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline btn-square" @click="openEditArticleModal(article)">
                <svg
                  v-if="loadingSpecificArticleId.includes(article.id)"
                  fill="currentColor"
                  title="Pending 等待"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                >
                  <path
                    d="M7 13.5q.625 0 1.062-.438Q8.5 12.625 8.5 12t-.438-1.062Q7.625 10.5 7 10.5t-1.062.438Q5.5 11.375 5.5 12t.438 1.062Q6.375 13.5 7 13.5Zm5 0q.625 0 1.062-.438.438-.437.438-1.062t-.438-1.062Q12.625 10.5 12 10.5t-1.062.438Q10.5 11.375 10.5 12t.438 1.062q.437.438 1.062.438Zm5 0q.625 0 1.062-.438.438-.437.438-1.062t-.438-1.062Q17.625 10.5 17 10.5t-1.062.438Q15.5 11.375 15.5 12t.438 1.062q.437.438 1.062.438ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
                  />
                </svg>

                <svg
                  v-else
                  title="Edit 編輯"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                >
                  <path
                    d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"
                  />
                </svg>
              </button>
              <button
                class="btn btn-outline btn-square hover:btn-error -ml-px"
                @click="openDeleteArticleModal(article)"
              >
                <svg title="Delete 刪除" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path
                    d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Pagination :pages="pagination" @pagination-change="paginationChange" />
</template>

<script setup>
import { ref, inject } from 'vue';
import { $vfm } from 'vue-final-modal';
import ArticleModal from '@/components/modal/ArticleModal.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import Pagination from '@/components/AppPagination.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');
const $loading = inject('$loading');

// UI Data
const articles = ref([]);
const pagination = ref({});

// UI State
const loadingSpecificArticleId = ref([]);

// Remotely get articles by given page number, then render them
function renderArticles(page = 1) {
  const loader = $loading.show();
  axiosWithAuth({
    method: 'get',
    url: `admin/articles/?page=${page}`,
  })
    .then((res) => {
      articles.value = res.data.articles;
      pagination.value = res.data.pagination;
    })
    .finally(() => {
      loader.hide();
    });
}

// Re-render target page provided by pagination component
function paginationChange(page) {
  renderArticles(page);
}

// Remotely create article from input data
function addArticle(targetArticle) {
  axiosWithAuth({
    method: 'post',
    url: `admin/article`,
    data: { ...targetArticle },
  }).then(() => {
    renderArticles();
  });
}

function openAddArticleModal() {
  $vfm.show({
    component: ArticleModal,
    on: {
      confirm(modalData) {
        addArticle({ data: { ...modalData } });
      },
    },
    slots: { title: '新增文章' },
  });
}

// Remotely edit article from input data
function editArticle(targetArticle) {
  axiosWithAuth({
    method: 'put',
    url: `/admin/article/${targetArticle.data.id}`,
    data: targetArticle,
  }).then(() => {
    renderArticles();
  });
}

// Remotely get 1 specific article
async function getSpecificArticle(articleId) {
  const specificArticle = await axiosWithAuth({
    method: 'get',
    url: `/admin/article/${articleId}`,
  })
    .then((res) => res.data.article)
    .finally(() => {
      loadingSpecificArticleId.value = loadingSpecificArticleId.value.filter((id) => id !== articleId);
    });

  return specificArticle;
}

async function openEditArticleModal(targetArticle) {
  loadingSpecificArticleId.value.push(targetArticle.id);
  const fullTargetArticle = await getSpecificArticle(targetArticle.id);

  $vfm.show({
    component: ArticleModal,
    bind: { article: { ...fullTargetArticle } },
    on: {
      confirm(modalData) {
        editArticle({ data: { ...modalData } });
      },
    },
    slots: { title: '編輯文章' },
  });
}

// Remotely delete article by given id
function deleteArticle(articleId) {
  axiosWithAuth({
    method: 'delete',
    url: `/admin/article/${articleId}`,
  }).then(() => {
    renderArticles();
  });
}

function openDeleteArticleModal(targetArticle) {
  $vfm.show({
    component: DashboardDeleteModal,
    bind: {
      dashboardItem: { ...targetArticle },
    },
    on: {
      confirm() {
        deleteArticle(targetArticle.id);
      },
    },
    slots: { title: '刪除文章' },
  });
}

// Init Render
renderArticles();
</script>
