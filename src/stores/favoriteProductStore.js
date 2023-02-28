import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

// eslint-disable-next-line import/prefer-default-export
export const useFavoriteProductStore = defineStore('favoriteProduct', {
  state: () => ({
    favoriteProductIDs: [],
  }),
  persist: true,
  getters: {},
  actions: {
    toggleFavoriteProduct(targetId) {
      if (this.$state.favoriteProductIDs.includes(targetId)) {
        this.$state.favoriteProductIDs = this.$state.favoriteProductIDs.filter((productId) => productId !== targetId);
      } else {
        this.$state.favoriteProductIDs = [...this.$state.favoriteProductIDs, targetId];
      }
    },

    clearFavoriteProducts() {
      this.$state.favoriteProductIDs = [];
    },

    toastFavoriteProduct(targetId, targetTitle) {
      if (this.$state.favoriteProductIDs.includes(targetId)) {
        useToast().info(`已將 ${targetTitle} 從收藏中移除 `);
      } else {
        useToast().info(`已將 ${targetTitle} 加入收藏 `);
      }
    },
  },
});
