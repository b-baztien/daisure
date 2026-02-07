<template>
  <div v-if="transaction" class="max-w-4xl mx-auto py-8 px-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ transaction.product.name }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ transaction.transactionNumber }}
      </p>
      <BadgeTransaction
        v-if="transaction.status !== TransactionStatus.INITIATED"
        :status="transaction.status"
      />
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <UCard v-if="transaction.product.images?.length">
        <div class="grid grid-cols-2 gap-2">
          <img
            v-for="(img, index) in transaction.product.images"
            :key="index"
            :src="img"
            :alt="`Product image ${index + 1}`"
            class="w-full h-48 object-cover rounded-lg"
          />
        </div>
      </UCard>

      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">รายละเอียดสินค้า</h2>
          </template>

          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">คำอธิบาย</p>
              <p class="whitespace-pre-line">
                {{ transaction.product.description }}
              </p>
            </div>

            <div v-if="transaction.product.category">
              <p class="text-sm text-gray-600 dark:text-gray-400">หมวดหมู่</p>
              <p class="font-semibold">{{ transaction.product.category }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">ผู้ขาย</p>
              <p class="font-semibold">
                {{ transaction.seller?.displayName }}
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">สรุปยอดชำระ</h2>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">ราคาสินค้า</span>
              <span>{{
                formatCurrency(transaction.payment.productPrice)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ค่าธรรมเนียม</span>
              <span>{{ formatCurrency(transaction.payment.escrowFee) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ค่าจัดส่ง</span>
              <span>{{ formatCurrency(transaction.payment.shippingFee) }}</span>
            </div>
            <UDivider />
            <div class="flex justify-between text-lg font-bold">
              <span>รวมทั้งสิ้น</span>
              <span class="text-blue-600">
                {{ formatCurrency(transaction.payment.totalAmount) }}
              </span>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="space-y-4">
            <div
              class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <UIcon
                name="i-heroicons-shield-check"
                class="w-5 h-5 text-blue-600"
              />
              <span
                >ปลอดภัยด้วยระบบ Escrow
                ผู้ซื้อจะได้รับสินค้าก่อนจึงปล่อยเงินให้ผู้ขาย</span
              >
            </div>

            <template v-if="isAuthenticated">
              <UButton
                v-if="transaction.status === 'initiated'"
                block
                size="lg"
                icon="i-heroicons-shopping-cart"
                :loading="isJoining"
                @click="joinTransaction"
              >
                ซื้อสินค้านี้
              </UButton>

              <UAlert
                v-else
                color="warning"
                variant="soft"
                icon="i-heroicons-information-circle"
                title="รายการนี้มีผู้ซื้อแล้ว"
                description="ไม่สามารถเข้าร่วมรายการได้"
              />
            </template>

            <template v-else>
              <UButton
                block
                size="lg"
                icon="i-heroicons-arrow-right-end-on-rectangle"
                :to="`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`"
              >
                เข้าสู่ระบบเพื่อซื้อสินค้า
              </UButton>
              <p class="text-sm text-center text-gray-500">
                คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถทำการซื้อได้
              </p>
            </template>
          </div>
        </UCard>
      </div>
    </div>
  </div>

  <div v-else-if="pending" class="max-w-4xl mx-auto py-8 px-4">
    <div class="space-y-6">
      <USkeleton class="h-12 w-1/2 mx-auto" />
      <div class="grid md:grid-cols-2 gap-6">
        <USkeleton class="h-64" />
        <div class="space-y-6">
          <USkeleton class="h-48" />
          <USkeleton class="h-32" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="max-w-4xl mx-auto py-8 px-4">
    <UCard>
      <div class="text-center py-12">
        <UIcon
          name="i-heroicons-exclamation-circle"
          class="w-16 h-16 mx-auto mb-4 text-red-600"
        />
        <h3 class="text-lg font-semibold mb-2">ไม่พบรายการ</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          ลิงก์นี้ไม่ถูกต้องหรือรายการถูกลบแล้ว
        </p>
        <UButton to="/"> กลับหน้าหลัก </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

const route = useRoute();
const alert = useAlert();
const { isAuthenticated } = useAuth();

const token = useRouteParams<string>("token");
const { data: transaction, pending } =
  useTransactionService().getTransactionByShareToken(token.value);

const isJoining = ref(false);

const formatCurrency = (num: number) => {
  return `฿${new Intl.NumberFormat("th-TH").format(num)}`;
};

const joinTransaction = async () => {
  isJoining.value = true;
  try {
    const { apiFetch } = useApi();
    const result = await apiFetch<Transaction>(
      `/transactions/share/${token.value}/join`,
      { method: "POST" },
    );

    alert.success("เข้าร่วมรายการสำเร็จ!");
    return navigateTo(`/transactions/${result._id}`);
  } catch (error: any) {
    alert.error(error.data?.message || "ไม่สามารถเข้าร่วมรายการได้");
  } finally {
    isJoining.value = false;
  }
};
</script>
