import { defineStore } from 'pinia';
import axiosConfig from '@/plugins/axiosConfig';

const { axiosWithAuth } = axiosConfig;

// eslint-disable-next-line import/prefer-default-export
export const useProductStore = defineStore('product', {
  state: () => ({
    isFetching: false,
    products: [],
    productIdsBeingLoaded: [],
    currentPage: 1,
    productsPerPage: 5,
    selectedCategory: 'all',
  }),
  getters: {
    categories(state) {
      return [...new Set(state.products.map((product) => product.category))];
    },

    pagination({ currentPage, productsPerPage }) {
      const maxPage = Math.round(this.categoryFilteredProducts.length / productsPerPage);
      return {
        total_pages: maxPage,
        current_page: currentPage,
        has_pre: currentPage !== 1,
        has_next: currentPage < maxPage,
        category: null,
      };
    },

    categoryFilteredProducts({ products, selectedCategory }) {
      if (selectedCategory === 'all') {
        return products;
      }
      return products.filter((product) => product.category === selectedCategory);
    },

    categoryFilteredInRangeProducts({ currentPage, productsPerPage }) {
      const minPage = currentPage * productsPerPage - productsPerPage;
      const maxPage = currentPage * productsPerPage;
      return this.categoryFilteredProducts.slice(minPage, maxPage);
    },
  },
  actions: {
    async fetchAllProducts() {
      this.$state.isFetching = true;
      const productRes = await axiosWithAuth({
        method: 'get',
        url: `products/all`,
      });
      this.$state.isFetching = false;
      this.$state.products = productRes.data.products;
    },
    async addProductToCart(productId, quantity = 1) {
      this.$state.productIdsBeingLoaded = [...this.$state.productIdsBeingLoaded, productId];

      await axiosWithAuth({
        method: 'post',
        url: `/cart`,
        data: { data: { product_id: productId, qty: quantity } },
      });
      this.$state.productIdsBeingLoaded = this.$state.productIdsBeingLoaded.filter((product) => product !== productId);
    },
  },
});
