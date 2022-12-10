<template>
  <h1>文章列表</h1>
  <div>
    <button @click="openAddArticleModal()">新增文章</button>
  </div>

  <table>
    <thead>
      <tr>
        <th width="120">標題</th>
        <th width="120">簡述</th>
        <th width="120">圖片</th>
        <th width="120">標籤</th>
        <th width="120">創建時間</th>
        <th width="120">作者</th>
        <th width="120">是否公開</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="article in articles" :key="article.key">
        <td>{{ article.title }}</td>
        <td>{{ article.description }}</td>
        <td>{{ article.image }}</td>
        <td>{{ article.tag }}</td>
        <td>{{ $unitFilters.toReadableDate(article.create_at) }}</td>
        <td>{{ article.author }}</td>
        <td>{{ article.isPublic }}</td>
        <td>
          <div>
            <button @click="openEditArticleModal(article)">編輯</button>
            <button @click="openDeleteArticleModal(article)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <Pagination :pages="pagination" @pagination-change="paginationChange" />
</template>

<script setup>
import { $vfm } from 'vue-final-modal';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import ArticleModal from '@/components/modal/ArticleModal.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';
import getAuthToken from '@/helper/getAuthToken';
import Pagination from '@/components/AppPagination.vue';
import axios from 'axios';

// UI Data
const articles = ref([]);
const pagination = ref({});

function renderArticles(page = 1) {
  axios({
    method: 'get',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/articles/?page=${page}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      articles.value = res.data.articles;
      pagination.value = res.data.pagination;
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function paginationChange(page) {
  renderArticles(page);
}

// Remotely create article from input data
function addArticle(targetArticle) {
  axios({
    method: 'post',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/article`,
    headers: {
      Authorization: getAuthToken,
    },
    data: {
      ...targetArticle,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderArticles();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
      return err;
    });
}

function openAddArticleModal() {
  $vfm.show({
    component: ArticleModal,
    on: {
      confirm(modalData) {
        const newProduct = {
          data: {
            ...modalData,
          },
        };
        addArticle(newProduct);
      },
    },
    slots: {
      title: '新增文章',
    },
  });
}

// Remotely edit article from input data
function editArticle(targetArticle) {
  axios({
    method: 'put',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/product/${targetArticle.data.id}`,
    headers: {
      Authorization: getAuthToken,
    },
    data: { ...targetArticle },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderArticles();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
    });
}

function openEditArticleModal(targetArticle) {
  $vfm.show({
    component: ArticleModal,
    bind: {
      article: { ...targetArticle },
    },
    on: {
      confirm(modalData) {
        const newProduct = {
          data: {
            ...modalData,
          },
        };
        editArticle(newProduct);
      },
    },
    slots: {
      title: '編輯文章',
    },
  });
}

// Remotely delete article by given id
function deleteArticle(articleId) {
  axios({
    method: 'delete',
    url: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/admin/article/${articleId}`,
    headers: {
      Authorization: getAuthToken,
    },
  })
    .then((res) => {
      if (!res.data.success) throw new Error(`${res.data.message}`);
      useToast().success(`${res.data.message}`);
      renderArticles();
    })
    .catch((err) => {
      useToast().error(`${err.message}`);
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
    slots: {
      title: '刪除文章',
    },
  });
}

renderArticles();
</script>
