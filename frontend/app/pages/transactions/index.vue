<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          จัดการรายการซื้อขายของคุณ
        </p>
      </div>

      <UButton to="/transactions/create" icon="i-heroicons-plus" size="lg">
        สร้างรายการใหม่
      </UButton>
    </div>

    <!-- Filters -->
    <UCard class="mb-6">
      <div class="grid md:grid-cols-4 gap-4">
        <!-- Search -->
        <UInput
          v-model="search"
          placeholder="ค้นหารายการ..."
          icon="i-heroicons-magnifying-glass"
        />

        <!-- Status Filter -->
        <USelectMenu
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="สถานะทั้งหมด"
        />

        <!-- Role Filter -->
        <USelectMenu
          v-model="roleFilter"
          :options="roleOptions"
          placeholder="ทั้งหมด"
        />

        <!-- Reset -->
        <UButton color="gray" variant="outline" @click="resetFilters">
          รีเซ็ตตัวกรอง
        </UButton>
      </div>
    </UCard>

    <!-- Transactions List -->
    <div v-if="isLoading" class="space-y-4">
      <USkeleton class="h-32" v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="filteredTransactions.length > 0" class="space-y-4">
      <UCard
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo(`/transactions/${transaction.id}`)"
      >
        <div class="flex items-center gap-4">
          <!-- Image -->
          <img
            :src="transaction.product.images[0]"
            :alt="transaction.product.name"
            class="w-20 h-20 object-cover rounded-lg"
          />

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 min-w-0">
                <h3
                  class="font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{ transaction.product.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ transaction.transactionNumber }}
                </p>
              </div>
              <UBadge
                :color="getStatusColor(transaction.status)"
                variant="soft"
              >
                {{ getStatusText(transaction.status) }}
              </UBadge>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(transaction.createdAt) }}
              </div>
              <div class="font-semibold text-lg text-gray-900 dark:text-white">
                ฿{{ formatNumber(transaction.payment.totalAmount) }}
              </div>
            </div>
          </div>

          <!-- Arrow -->
          <UIcon
            name="i-heroicons-chevron-right"
            class="w-5 h-5 text-gray-400"
          />
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else>
      <div class="text-center py-12">
        <UIcon
          name="i-heroicons-inbox"
          class="w-16 h-16 mx-auto mb-4 text-gray-400"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ไม่พบรายการ
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          เริ่มต้นสร้างรายการแรกของคุณ
        </p>
        <UButton to="/transactions/create"> สร้างรายการใหม่ </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const transactionStore = useTransactionStore();
const { filteredTransactions, isLoading } = storeToRefs(transactionStore);

const search = ref("");
const statusFilter = ref(null);
const roleFilter = ref(null);

const statusOptions = [
  { label: "ทั้งหมด", value: null },
  { label: "รอชำระเงิน", value: "pending_payment" },
  { label: "รอตรวจสอบ", value: "payment_verification" },
  { label: "รอจัดส่ง", value: "awaiting_shipment" },
  { label: "จัดส่งแล้ว", value: "shipped" },
  { label: "สำเร็จ", value: "completed" },
];

const roleOptions = [
  { label: "ทั้งหมด", value: null },
  { label: "ฉันเป็นผู้ซื้อ", value: "buyer" },
  { label: "ฉันเป็นผู้ขาย", value: "seller" },
];

const getStatusColor = (status: string) => {
  const colors = {
    pending_payment: "yellow",
    payment_verification: "blue",
    awaiting_shipment: "orange",
    shipped: "purple",
    completed: "green",
    disputed: "red",
  };
  return colors[status] || "gray";
};

const getStatusText = (status: string) => {
  const texts = {
    pending_payment: "รอชำระเงิน",
    payment_verification: "รอตรวจสอบ",
    awaiting_shipment: "รอจัดส่ง",
    shipped: "จัดส่งแล้ว",
    completed: "สำเร็จ",
    disputed: "มีข้อพิพาท",
  };
  return texts[status] || status;
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const resetFilters = () => {
  search.value = "";
  statusFilter.value = null;
  roleFilter.value = null;
  transactionStore.resetFilters();
};

// Watch filters
watch([search, statusFilter, roleFilter], () => {
  transactionStore.setFilter("search", search.value);
  transactionStore.setFilter("status", statusFilter.value);
  transactionStore.setFilter("role", roleFilter.value);
});

// Fetch on mount
onMounted(() => {
  transactionStore.fetchTransactions();
});
</script>
