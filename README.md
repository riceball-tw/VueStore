![Logo Hero Image](https://i.imgur.com/ITlNhtx.jpg)

# 電商網站

後端與 API 來源自《[六角學院 Vue 3 實戰影音課程](https://www.hexschool.com/courses/vue3.html)》，於本專案中整合 API 並建構基礎的前後台 UI 供購買者、管理員操作使用。

## 如何執行專案

將下載專案 Zip 檔或將專案 Clone 至本地端

### 安裝專案 dependencies

yarn

###編譯及執行專案（Development 模式）

yarn dev

### 編譯及壓縮（Production 模式）

npm build

### 分析程式碼除錯

npm lint

## 主要功能

### 前台

- 商品展示
- 購物車（加入、調整數量、刪除單筆或全部購物車項目）
- 套用優惠券
- 結帳
- 部落格

### 後台

- 管理員登入、登出
- 產品管理
- 訂單管理
- 優惠券管理
- 文章管理

## 使用技術與文件

- [Vite](https://vitejs.dev/) - 以 Vue.js 開發 SPA 網站
- [Pinia](https://pinia.vuejs.org/) - Vue.js 狀態管理
- [Pinia plugin persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) - Pinia 狀態管理持久化
- [Tailwind](https://tailwindcss.com/) - Utility CSS Framework
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin) - 文章版面與樣式
- [Daisy UI](https://daisyui.com/) - 架構基礎 UI
- [ESlint(Airbnb)](https://eslint.org/)、[Prettier](https://prettier.io/) - 優化與統一代碼風格
- [CKEditor 5](https://ckeditor.com/ckeditor-5/) - 文章編輯器
- [Vue Router](https://router.vuejs.org/) - SPA 網站路由設置
- [Vue Toastification](https://vue-toastification.maronato.dev/) - 吐司彈跳框套件
- [Vue Final Modal](https://vue-final-modal.org/) - 彈跳框套件
- [Vue Tags Input](http://www.vue-tags-input.com/#/) - 標籤
- [Vue Loading Overlay Component](https://github.com/ankurk91/vue-loading-overlay) - 讀取效果
- [Vue Axios](https://github.com/imcvampire/vue-axios) - Axios Vue

## 參考資料

- [後端 API 文件](https://github.com/hexschool/vue3-course-api-wiki/wiki)
