<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

const { apiFetch } = useApi()
const router = useRouter()
const toast = useToast()

const transactions = ref<any[]>([])
const isLoading = ref(true)
const selectedStatus = ref<string | null>(null)
const searchQuery = ref('')

const statusOptions = [
  { label: 'ทั้งหมด', value: null },
  { label: 'รอชำระเงิน', value: 'pending_payment' },
  { label: 'ตรวจสอบการชำระเงิน', value: 'payment_verification' },
  { label: 'ชำระเงินแล้ว', value: 'paid' },
  { label: 'จัดส่งแล้ว', value: 'shipped' },
  { label: 'ได้รับสินค้า', value: 'delivered' },
  { label: 'เสร็จสมบูรณ์', value: 'completed' },
  { label: 'มีข้อพิพาท', value: 'disputed' },
  { label: 'ยกเลิก', value: 'cancelled' }
]

// Table columns
const columns = [
  {
    id: 'transactionNumber',
    label: 'รหัสธุรกรรม',
    sortable: true
  },
  {
    id: 'product',
    label: 'สินค้า'
  },
  {
    id: 'buyer',
    label: 'ผู้ซื้อ',
    sortable: true
  },
  {
    id: 'seller',
    label: 'ผู้ขาย',
    sortable: true
  },
  {
    id: 'amount',
    label: 'จำนวนเงิน',
    sortable: true
  },
  {
    id: 'status',
    label: 'สถานะ',
    sortable: true
  },
  {
    id: 'createdAt',
    label: 'วันที่สร้าง',
    sortable: true
  },
  {
    id: 'actions',
    label: 'การดำเนินการ'
  }
]

// Fetch transactions
async function fetchTransactions() {
  isLoading.value = true
  try {
    const params: any = {}
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    const query = new URLSearchParams(params).toString()
    const data = await apiFetch<any[]>(`/transactions${query ? '?' + query : ''}`)
    transactions.value = data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถโหลดข้อมูลธุรกรรมได้',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

// Filtered transactions
const filteredTransactions = computed(() => {
  let result = transactions.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.transactionNumber?.toLowerCase().includes(search) ||
      t.product?.name?.toLowerCase().includes(search) ||
      t.buyer?.profile?.displayName?.toLowerCase().includes(search) ||
      t.seller?.profile?.displayName?.toLowerCase().includes(search)
    )
  }

  return result
})

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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch status filter
watch(selectedStatus, () => {
  fetchTransactions()
})

// Initial fetch
onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        จัดการธุรกรรม
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        ตรวจสอบและจัดการธุรกรรมทั้งหมดในระบบ
      </p>
    </div>

    <!-- Filters -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search -->
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="ค้นหาธุรกรรม..."
          size="lg"
        />

        <!-- Status Filter -->
        <USelectMenu
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="สถานะ"
          size="lg"
          value-attribute="value"
        />
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-600 animate-spin" />
    </div>

    <!-- Transactions List -->
    <UCard v-else>
      <!-- Empty State -->
      <div v-if="filteredTransactions.length === 0" class="text-center py-12">
        <Icon name="i-heroicons-shopping-bag" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ไม่พบธุรกรรม
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีธุรกรรมในระบบ' }}
        </p>
      </div>

      <!-- Transactions Table -->
      <UTable v-else :columns="columns" :data="filteredTransactions">
        <!-- Transaction Number Column -->
        <template #transactionNumber-data="{ row }">
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ row.transactionNumber }}
          </span>
        </template>

        <!-- Product Column -->
        <template #product-data="{ row }">
          <div>
            <div class="text-sm text-gray-900 dark:text-white font-medium">
              {{ row.product?.name }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ row.product?.description?.substring(0, 50) }}...
            </div>
          </div>
        </template>

        <!-- Buyer Column -->
        <template #buyer-data="{ row }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ row.buyer?.profile?.displayName || 'N/A' }}
          </span>
        </template>

        <!-- Seller Column -->
        <template #seller-data="{ row }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ row.seller?.profile?.displayName || 'N/A' }}
          </span>
        </template>

        <!-- Amount Column -->
        <template #amount-data="{ row }">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(row.payment?.totalAmount || 0) }}
          </span>
        </template>

        <!-- Status Column -->
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">
            {{ getStatusLabel(row.status) }}
          </UBadge>
        </template>

        <!-- Created At Column -->
        <template #createdAt-data="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(row.createdAt) }}
          </span>
        </template>

        <!-- Actions Column -->
        <template #actions-data="{ row }">
          <UButton
            :to="`/admin/transactions/${row._id}`"
            color="gray"
            variant="ghost"
            icon="i-heroicons-eye"
            size="sm"
          >
            ดู
          </UButton>
        </template>
      </UTable>
    </UCard>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">ธุรกรรมทั้งหมด</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ transactions.length }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">รอตรวจสอบ</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">
            {{ transactions.filter(t => t.status === 'payment_verification').length }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">มีข้อพิพาท</p>
          <p class="text-3xl font-bold text-orange-600 mt-2">
            {{ transactions.filter(t => t.status === 'disputed').length }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">เสร็จสมบูรณ์</p>
          <p class="text-3xl font-bold text-green-600 mt-2">
            {{ transactions.filter(t => t.status === 'completed').length }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
