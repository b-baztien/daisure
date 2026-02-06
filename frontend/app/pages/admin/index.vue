<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        จัดการระบบและตรวจสอบรายการ
      </p>
    </div>

    <!-- Stats -->
    <div class="grid md:grid-cols-4 gap-6 mb-8">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Transactions
            </p>
            <p class="text-3xl font-bold">{{ stats.totalTransactions }}</p>
          </div>
          <div
            class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-shopping-bag"
              class="w-6 h-6 text-blue-600"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Pending Verification
            </p>
            <p class="text-3xl font-bold text-yellow-600">
              {{ stats.pendingVerification }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center"
          >
            <UIcon name="i-heroicons-clock" class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              In Dispute
            </p>
            <p class="text-3xl font-bold text-red-600">{{ stats.inDispute }}</p>
          </div>
          <div
            class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-6 h-6 text-red-600"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Completed Today
            </p>
            <p class="text-3xl font-bold text-green-600">
              {{ stats.completedToday }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-green-600"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <template #header>
          <h3 class="font-semibold">รอตรวจสอบการชำระเงิน</h3>
        </template>
        <div class="space-y-3">
          <UButton
            to="/admin/transactions?status=payment_verification"
            color="yellow"
            block
          >
            ดูทั้งหมด ({{ stats.pendingVerification }})
          </UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">ข้อพิพาท</h3>
        </template>
        <div class="space-y-3">
          <UButton to="/admin/transactions?status=disputed" color="red" block>
            ดูทั้งหมด ({{ stats.inDispute }})
          </UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">รายงาน</h3>
        </template>
        <div class="space-y-3">
          <UButton color="purple" variant="outline" block>
            ดาวน์โหลดรายงาน
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Recent Transactions -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">รายการล่าสุด</h3>
          <UButton
            to="/admin/transactions"
            color="gray"
            variant="ghost"
            size="sm"
          >
            ดูทั้งหมด
          </UButton>
        </div>
      </template>

      <div class="space-y-2">
        <div
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          @click="navigateTo(`/admin/transactions/${transaction.id}`)"
        >
          <div class="flex items-center gap-4">
            <img
              :src="transaction.product.images[0]"
              class="w-12 h-12 object-cover rounded"
            />
            <div>
              <p class="font-semibold">{{ transaction.transactionNumber }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ transaction.product.name }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <p class="font-semibold">
              ฿{{ formatNumber(transaction.payment.totalAmount) }}
            </p>
            <UBadge :color="getStatusColor(transaction.status)" variant="soft">
              {{ getStatusText(transaction.status) }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const stats = ref({
  totalTransactions: 0,
  pendingVerification: 0,
  inDispute: 0,
  completedToday: 0,
});

const recentTransactions = ref([]);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

const getStatusColor = (status: string) => {
  const colors = {
    payment_verification: "yellow",
    disputed: "red",
    completed: "green",
  };
  return colors[status] || "gray";
};

const getStatusText = (status: string) => {
  const texts = {
    payment_verification: "รอตรวจสอบ",
    disputed: "มีข้อพิพาท",
    completed: "สำเร็จ",
  };
  return texts[status] || status;
};

const { apiFetch } = useApi();
const toast = useToast();
const isLoading = ref(true);

onMounted(async () => {
  try {
    // Fetch real dashboard data from API
    const dashboardData = await apiFetch<any>("/admin/dashboard");
    stats.value = {
      totalTransactions: dashboardData.totalTransactions || 0,
      pendingVerification: dashboardData.pendingVerification || 0,
      inDispute: dashboardData.inDispute || 0,
      completedToday: dashboardData.completedToday || 0,
    };

    // Fetch recent transactions
    const transactions = await apiFetch<any[]>("/transactions?limit=5");
    recentTransactions.value = transactions || [];
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: "ไม่สามารถโหลดข้อมูลแดชบอร์ดได้",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
});
</script>
