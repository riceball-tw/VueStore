<template>
  <div class="container mx-auto">
    <CheckoutStep :current-step="1" />
    <div v-if="!cartsData?.carts?.length">目前購物車內無商品</div>
    <!-- Section Title -->
    <div class="flex justify-between w-full mb-8 px-4">
      <h1 class="text-4xl font-bold">用戶購物車</h1>
      <div class="btn-group">
        <button
          v-if="cartsData?.carts?.length"
          type="button"
          class="btn btn-outline hover:btn-error"
          @click="deleteAllCart()"
        >
          清空購物車
        </button>
        <button class="btn btn-success" type="button" @click="checkoutCart()">填寫資料</button>
      </div>
    </div>

    <div class="flex flex-col items-start lg:flex-row gap-4 px-4 mb-8">
      <!-- Cart Info -->
      <div class="overflow-x-auto w-full">
        <table v-if="cartsData?.carts?.length" class="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>圖片</th>
              <th>品項</th>
              <th>數量</th>
              <th class="text-right">單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cart in cartsData.carts" :key="cart.id" class="hover">
              <td>
                <button class="btn btn-outline btn-square hover:btn-error" @click="handleDeleteCart(cart)">
                  <svg title="Trash Can 刪除" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                    <path
                      d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"
                    />
                  </svg>
                </button>
              </td>
              <td>
                <img class="inline-block" width="150" :src="cart.product.imageUrl" :alt="cart.product.title" />
              </td>
              <td>
                {{ cart.product?.title ? cart.product.title : '無紀錄' }}
              </td>
              <td>
                <label class="input-group">
                  <input
                    class="input input-bordered"
                    type="number"
                    min="1"
                    :value="cart.qty"
                    :disabled="loadingCart.includes(cart.id)"
                    @change="
                      (e) => {
                        handleEditCart(cart.id, e.target.value);
                      }
                    "
                  />
                  <span>{{ cart.product?.unit ? cart.product.unit : '個' }}</span>
                </label>
              </td>
              <td class="text-right">
                <span v-if="isUsingDiscount">
                  <del class="opacity-40">{{ cart.total }}<span>$NTD</span></del>

                  <div class="text-lg font-bold">{{ cart.final_total }}<span>$NTD</span></div>
                </span>
                <span v-else>{{ cart.total }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="text-right">
              <td colspan="5" class="text-2xl">
                <div v-if="isUsingDiscount">
                  <del class="opacity-60 font-normal text-xl">總計： {{ cartsData.total }} $NTD</del>
                  <div>折扣後價格： {{ cartsData.final_total }} $NTD</div>
                </div>
                <div v-else>總計： {{ cartsData.total }} $NTD</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Coupon form -->
      <div class="items-center card p-4 bg-base-200 w-full justify-center max-w-auto lg:max-w-[300px]">
        <div class="flex flex-col justify-center items-center">
          <svg
            class="transform-gpu rotate-12 mb-4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
          >
            <path
              d="m18.8 32.1 5.2-4.05 5.2 4.05-2-6.4 4.9-4.1h-6L24 15.5l-2.1 6.1h-6l4.9 4.1ZM7 40q-1.3 0-2.15-.85Q4 38.3 4 37v-7.65q1.85-.4 3.075-1.875T8.3 24q0-2-1.225-3.5T4 18.65V11q0-1.3.85-2.15Q5.7 8 7 8h34q1.3 0 2.15.85Q44 9.7 44 11v7.65q-1.85.35-3.075 1.85T39.7 24q0 2 1.225 3.475T44 29.35V37q0 1.3-.85 2.15Q42.3 40 41 40Zm0-3h34v-5.45q-1.9-1.3-3.1-3.25-1.2-1.95-1.2-4.3 0-2.35 1.2-4.3 1.2-1.95 3.1-3.25V11H7v5.45q1.95 1.3 3.125 3.25T11.3 24q0 2.35-1.175 4.3Q8.95 30.25 7 31.55Zm17-13Z"
            />
          </svg>
          <h2 class="font-medium mb-8 text-2xl text-center whitespace-nowrap">使用優惠券<br />獲得更優惠的價格！</h2>
        </div>

        <form
          v-if="cartsData?.carts?.length"
          class="w-full flex"
          @submit.prevent="
            (e) => {
              submitCoupon(e.target);
            }
          "
        >
          <div class="input-group">
            <input
              id="couponCode"
              class="input input-bordered w-full"
              name="couponCode"
              type="text"
              placeholder="請輸入優惠券代碼……"
              required
            />
            <button class="btn" type="submit">使用優惠</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { $vfm } from 'vue-final-modal';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import CheckoutStep from '@/components/shop/ShopCheckoutStep.vue';
import DashboardDeleteModal from '@/components/modal/DashboardDeleteModal.vue';

// Import
const axiosWithAuth = inject('axiosWithAuth');
const router = useRouter();
const $loading = inject('$loading');

// UI Data
const cartsData = ref([]);

// Component State
const loadingCart = ref([]);
const isUsingDiscount = computed(() => cartsData.value.total !== cartsData.value.final_total);

// Remotely get carts, then render them
async function renderCarts() {
  const loader = $loading.show();
  axiosWithAuth({
    method: 'get',
    url: `/cart`,
  })
    .then((res) => {
      cartsData.value = res.data.data;
    })
    .finally(() => {
      loader.hide();
    });
}

function editCart(cartId, quantity = 1) {
  loadingCart.value = [...loadingCart.value, cartId];
  axiosWithAuth({
    method: 'put',
    url: `/cart/${cartId}`,
    data: {
      data: { product_id: 'cartId', qty: quantity },
    },
  })
    .then(() => {
      renderCarts();
    })
    .finally(() => {
      loadingCart.value = loadingCart.value.filter((cart) => cart !== cartId);
    });
}

function checkoutCart() {
  if (cartsData.value.carts.length) {
    router.push({ name: 'cartInfo' });
  } else {
    useToast().warning(`購物車內尚無商品`);
  }
}

function handleEditCart(cartId, newQuantity = 1) {
  editCart(cartId, parseInt(newQuantity, 10));
}

function deleteCart(cartId) {
  axiosWithAuth({
    method: 'delete',
    url: `/cart/${cartId}`,
  }).then(() => {
    renderCarts();
  });
}

function handleDeleteCart(targetCart) {
  $vfm.show({
    component: DashboardDeleteModal,
    bind: {
      dashboardItem: { title: targetCart.product.title },
    },
    on: {
      confirm() {
        deleteCart(targetCart.id);
      },
    },
    slots: { title: '刪除產品' },
  });
}

function deleteAllCart() {
  axiosWithAuth({
    method: 'delete',
    url: `/carts`,
  }).then((res) => {
    renderCarts();
  });
}

async function submitCoupon(targetForm) {
  axiosWithAuth({
    method: 'post',
    url: `/coupon`,
    data: {
      data: {
        code: targetForm.couponCode.value,
      },
    },
  }).then(() => {
    renderCarts();
    targetForm.reset();
  });
}

renderCarts();
</script>
