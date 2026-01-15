<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const router = useRouter()

const isLoading = ref(true)

// Fetch data
onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchUser(),
      transactionStore.fetchTransactions()
    ])
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})

// Recent transactions (last 5)
const recentTransactions = computed(() =>
  transactionStore.transactions.slice(0, 5)
)

// Statistics cards
const statsCards = computed(() => [
  {
    label: 'ซื้อทั้งหมด',
    value: authStore.user?.statistics?.totalBought || 0,
    icon: 'i-heroicons-shopping-cart',
    color: 'blue'
  },
  {
    label: 'ขายทั้งหมด',
    value: authStore.user?.statistics?.totalSold || 0,
    icon: 'i-heroicons-banknotes',
    color: 'green'
  },
  {
    label: 'เสร็จสมบูรณ์',
    value: authStore.user?.statistics?.totalCompleted || 0,
    icon: 'i-heroicons-check-circle',
    color: 'purple'
  },
  {
    label: 'อัตราความสำเร็จ',
    value: `${authStore.user?.statistics?.successRate || 0}%`,
    icon: 'i-heroicons-chart-bar',
    color: 'orange'
  }
])

// Quick actions
const quickActions = [
  {
    label: 'สร้างธุรกรรมใหม่',
    description: 'เริ่มต้นการซื้อขายใหม่',
    icon: 'i-heroicons-plus-circle',
    color: 'blue',
    to: '/transactions/create'
  },
  {
    label: 'ดูธุรกรรมทั้งหมด',
    description: 'จัดการธุรกรรมของคุณ',
    icon: 'i-heroicons-list-bullet',
    color: 'green',
    to: '/transactions'
  },
  {
    label: 'รีวิวของฉัน',
    description: 'ดูและจัดการรีวิว',
    icon: 'i-heroicons-star',
    color: 'yellow',
    to: '/reviews'
  },
  {
    label: 'ตั้งค่าโปรไฟล์',
    description: 'อัพเดทข้อมูลส่วนตัว',
    icon: 'i-heroicons-user-circle',
    color: 'purple',
    to: '/profile'
  }
]

// Transaction status badge color
function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending_payment: 'yellow',
    payment_verification: 'blue',
    paid: 'green',
    shipped: 'indigo',
    delivered: 'purple',
    completed: 'green',
    cancelled: 'red',
    disputed: 'orange'
  }
  return colorMap[status] || 'gray'
}

// Transaction status label
function getStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    pending_payment: 'รอชำระเงิน',
    payment_verification: 'ตรวจสอบการชำระเงิน',
    paid: 'ชำระเงินแล้ว',
    shipped: 'จัดส่งแล้ว',
    delivered: 'ได้รับสินค้า',
    completed: 'เสร็จสมบูรณ์',
    cancelled: 'ยกเลิก',
    disputed: 'มีข้อพิพาท'
  }
  return labelMap[status] || status
}

// Format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

// Format date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        ยินดีต้อนรับ, {{ authStore.displayName }}!
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        จัดการธุรกรรมและติดตามสถานะการซื้อขายของคุณ
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-600 animate-spin" />
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UCard
          v-for="stat in statsCards"
          :key="stat.label"
          :ui="{ body: { padding: 'p-6' } }"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ stat.label }}
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {{ stat.value }}
              </p>
            </div>
            <div :class="`bg-${stat.color}-100 dark:bg-${stat.color}-900 p-3 rounded-lg`">
              <Icon :name="stat.icon" :class="`w-8 h-8 text-${stat.color}-600`" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            การดำเนินการด่วน
          </h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 hover:shadow-md transition-all"
          >
            <div class="flex items-start space-x-3">
              <div :class="`bg-${action.color}-100 dark:bg-${action.color}-900 p-2 rounded-lg`">
                <Icon :name="action.icon" :class="`w-6 h-6 text-${action.color}-600`" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ action.label }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ action.description }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </UCard>

      <!-- Recent Transactions -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              ธุรกรรมล่าสุด
            </h2>
            <UButton
              to="/transactions"
              color="gray"
              variant="ghost"
              trailing-icon="i-heroicons-arrow-right"
            >
              ดูทั้งหมด
            </UButton>
          </div>
        </template>

        <!-- Empty State -->
        <div v-if="recentTransactions.length === 0" class="text-center py-12">
          <Icon name="i-heroicons-shopping-bag" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ยังไม่มีธุรกรรม
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            เริ่มต้นการซื้อขายครั้งแรกของคุณ
          </p>
          <UButton to="/transactions/create" size="lg">
            สร้างธุรกรรมใหม่
          </UButton>
        </div>

        <!-- Transactions List -->
        <div v-else class="space-y-4">
          <NuxtLink
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            :to="`/transactions/${transaction.id}`"
            class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 hover:shadow-md transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1">
                <!-- Product Image -->
                <img
                  v-if="transaction.product.images?.[0]"
                  :src="transaction.product.images[0]"
                  :alt="transaction.product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div
                  v-else
                  class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <Icon name="i-heroicons-photo" class="w-8 h-8 text-gray-400" />
                </div>

                <!-- Transaction Info -->
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ transaction.product.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ transaction.transactionNumber }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500">
                    {{ formatDate(transaction.createdAt) }}
                  </p>
                </div>

                <!-- Amount -->
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatCurrency(transaction.payment.totalAmount) }}
                  </p>
                  <UBadge :color="getStatusColor(transaction.status)" size="sm">
                    {{ getStatusLabel(transaction.status) }}
                  </UBadge>
                </div>
              </div>

              <!-- Arrow -->
              <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400 ml-4" />
            </div>
          </NuxtLink>
        </div>
      </UCard>

      <!-- User Rating Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- As Seller -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              คะแนนในฐานะผู้ขาย
            </h2>
          </template>

          <div class="text-center py-6">
            <div class="flex items-center justify-center space-x-2 mb-2">
              <Icon name="i-heroicons-star-solid" class="w-8 h-8 text-yellow-400" />
              <span class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ authStore.user?.rating?.asSeller?.average?.toFixed(1) || '0.0' }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              จาก {{ authStore.user?.rating?.asSeller?.count || 0 }} รีวิว
            </p>
          </div>
        </UCard>

        <!-- As Buyer -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              คะแนนในฐานะผู้ซื้อ
            </h2>
          </template>

          <div class="text-center py-6">
            <div class="flex items-center justify-center space-x-2 mb-2">
              <Icon name="i-heroicons-star-solid" class="w-8 h-8 text-yellow-400" />
              <span class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ authStore.user?.rating?.asBuyer?.average?.toFixed(1) || '0.0' }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              จาก {{ authStore.user?.rating?.asBuyer?.count || 0 }} รีวิว
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
