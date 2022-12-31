import { useToast } from 'vue-toastification';

function setFavoriteProduct(id) {
  localStorage.setItem('favoriteProduct', JSON.stringify(id));
}

export function getFavoriteProducts() {
  return JSON.parse(localStorage.getItem('favoriteProduct')) ?? [];
}

export function checkIsProductFavorited(targetId) {
  return getFavoriteProducts().includes(targetId);
}

export function toggleFavoriteProduct(targetId, targetName) {
  let favoriteProducts = getFavoriteProducts();
  if (favoriteProducts.includes(targetId)) {
    favoriteProducts = favoriteProducts.filter((item) => item !== targetId);
    useToast().info(`已將 ${targetName} 從收藏中移除 `);
  } else {
    favoriteProducts = [...favoriteProducts, targetId];
    useToast().info(`已將 ${targetName} 加入收藏 `);
  }
  setFavoriteProduct(favoriteProducts);
}
