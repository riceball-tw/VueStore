import { useToast } from 'vue-toastification';

// Set favoriteProducts(array) to localStorage
function setFavoriteProducts(favoriteProduct) {
  localStorage.setItem('favoriteProduct', JSON.stringify(favoriteProduct));
}

export function deleteAllFavoriteProducts() {
  localStorage.removeItem('favoriteProduct');
  useToast().info(`已將所有項目從收藏中移除 `);
  window.dispatchEvent(new Event('storeProducts'));
}

// Get favoriteProducts from localStorage
export function getFavoriteProducts() {
  return JSON.parse(localStorage.getItem('favoriteProduct')) ?? [];
}

// Check is targetId exist in favoriteProduct
export function checkIsProductFavorited(targetId) {
  return getFavoriteProducts().includes(targetId);
}

// Toggle favorite product, send toast notification and window event
export function toggleFavoriteProduct(targetId, targetName) {
  let favoriteProducts = getFavoriteProducts();

  if (checkIsProductFavorited(targetId)) {
    favoriteProducts = favoriteProducts.filter((item) => item !== targetId);
    useToast().info(`已將 ${targetName} 從收藏中移除 `);
  } else {
    favoriteProducts = [...favoriteProducts, targetId];
    useToast().info(`已將 ${targetName} 加入收藏 `);
  }

  // Set result
  setFavoriteProducts(favoriteProducts);
  window.dispatchEvent(new Event('storeProducts'));
}
