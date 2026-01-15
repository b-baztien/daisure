<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <UButton
        :to="`/transactions/${route.params.id}`"
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        กลับ
      </UButton>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        วิธีการชำระเงิน
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        โอนเงินตามข้อมูลด้านล่าง และอัพโหลดสลิป
      </p>
    </div>

    <div v-if="isLoading">
      <USkeleton class="h-96" />
    </div>

    <div v-else-if="instructions" class="space-y-6">
      <!-- Amount -->
      <UCard>
        <div class="text-center py-6">
          <p class="text-gray-600 dark:text-gray-400 mb-2">ยอดที่ต้องชำระ</p>
          <p class="text-5xl font-bold text-blue-600">
            ฿{{ formatNumber(instructions.totalAmount) }}
          </p>

          <!-- Breakdown -->
          <div class="mt-6 space-y-2 text-sm">
            <div class="flex justify-between max-w-sm mx-auto">
              <span class="text-gray-600">ราคาสินค้า</span>
              <span
                >฿{{ formatNumber(instructions.breakdown.productPrice) }}</span
              >
            </div>
            <div class="flex justify-between max-w-sm mx-auto">
              <span class="text-gray-600">ค่าธรรมเนียม</span>
              <span>฿{{ formatNumber(instructions.breakdown.escrowFee) }}</span>
            </div>
            <div class="flex justify-between max-w-sm mx-auto">
              <span class="text-gray-600">ค่าจัดส่ง</span>
              <span
                >฿{{ formatNumber(instructions.breakdown.shippingFee) }}</span
              >
            </div>
          </div>
        </div>
      </UCard>

      <!-- Bank Accounts -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">บัญชีรับโอน</h2>
        </template>

        <div class="space-y-6">
          <div
            v-for="(account, index) in instructions.bankAccounts"
            :key="index"
            class="p-4 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-2xl font-bold text-blue-600">
                  {{ account.bankName }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ account.bankCode }}
                </p>
              </div>
              <UBadge color="blue" variant="soft">แนะนำ</UBadge>
            </div>

            <div class="space-y-3">
              <!-- Account Number -->
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  เลขที่บัญชี
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-2xl font-mono font-bold">
                    {{ account.accountNumber }}
                  </p>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-clipboard-document"
                    size="xs"
                    @click="copyToClipboard(account.accountNumber)"
                  />
                </div>
              </div>

              <!-- Account Name -->
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ชื่อบัญชี
                </p>
                <p class="font-semibold mt-1">{{ account.accountName }}</p>
              </div>

              <!-- PromptPay -->
              <div v-if="account.promptPayId">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  พร้อมเพย์
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="font-mono">{{ account.promptPayId }}</p>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-clipboard-document"
                    size="xs"
                    @click="copyToClipboard(account.promptPayId!)"
                  />
                </div>
              </div>

              <!-- QR Code -->
              <div v-if="account.qrCodeUrl" class="text-center pt-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  สแกน QR Code เพื่อโอน
                </p>
                <img
                  :src="account.qrCodeUrl"
                  alt="QR Code"
                  class="w-48 h-48 mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Instructions -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">ขั้นตอนการชำระเงิน</h2>
        </template>

        <ol class="space-y-4">
          <li
            v-for="(step, index) in instructions.instructions"
            :key="index"
            class="flex gap-4"
          >
            <div
              class="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold"
            >
              {{ index + 1 }}
            </div>
            <p class="flex-1 pt-1">{{ step }}</p>
          </li>
        </ol>

        <UAlert
          color="yellow"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          class="mt-6"
        >
          <template #title> หมายเหตุสำคัญ </template>
          <template #description>
            {{ instructions.note }}
          </template>
        </UAlert>
      </UCard>

      <!-- Submit Button -->
      <div class="flex gap-4">
        <UButton :to="`/payments/${route.params.id}/submit`" size="lg" block>
          อัพโหลดสลิปการโอน
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const paymentStore = usePaymentStore();
const toast = useToast();

const { paymentInstructions: instructions, isLoading } =
  storeToRefs(paymentStore);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      title: "คัดลอกแล้ว",
      description: "คัดลอกข้อมูลไปยังคลิปบอร์ดแล้ว",
      color: "green",
    });
  } catch (error) {
    toast.add({
      title: "ไม่สามารถคัดลอกได้",
      color: "red",
    });
  }
};

onMounted(() => {
  paymentStore.fetchPaymentInstructions(route.params.id as string);
});
</script>
