<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Transactions Management
      </h1>

      <UButton
        icon="i-heroicons-arrow-path"
        @click="fetchTransactions"
        :loading="loading"
      >
        Refresh
      </UButton>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormField label="Status">
          <USelect
            v-model="filters.status"
            :options="statusOptions"
            @change="fetchTransactions"
          />
        </UFormField>

        <UFormField label="Search">
          <UInput
            v-model="filters.search"
            placeholder="Search transaction ID..."
            icon="i-heroicons-magnifying-glass"
            @input="debouncedSearch"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- Transactions Table -->
    <UCard>
      <UTable
        :rows="transactions"
        :columns="columns"
        :loading="loading"
        :empty-state="{ icon: 'i-heroicons-inbox', label: 'No transactions found' }"
      >
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">
            {{ formatStatus(row.status) }}
          </UBadge>
        </template>

        <template #amount-data="{ row }">
          <span class="font-semibold">฿{{ formatNumber(row.totalAmount) }}</span>
        </template>

        <template #createdAt-data="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              v-if="row.status === 'payment_submitted'"
              size="xs"
              color="green"
              @click="openVerifyModal(row, true)"
            >
              Approve
            </UButton>
            <UButton
              v-if="row.status === 'payment_submitted'"
              size="xs"
              color="red"
              @click="openVerifyModal(row, false)"
            >
              Reject
            </UButton>
            <UButton
              size="xs"
              color="gray"
              icon="i-heroicons-eye"
              @click="viewDetails(row)"
            >
              View
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Verify Payment Modal -->
    <UModal v-model="showVerifyModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">
            {{ verifyAction === 'approve' ? 'Approve' : 'Reject' }} Payment
          </h3>
        </template>

        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Transaction ID: <span class="font-mono">{{ selectedTransaction?._id }}</span>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Amount: <span class="font-semibold">฿{{ formatNumber(selectedTransaction?.totalAmount || 0) }}</span>
            </p>
          </div>

          <UFormField label="Note (Optional)">
            <UTextarea
              v-model="verifyNote"
              placeholder="Add a note about this verification..."
              :rows="3"
            />
          </UFormField>

          <UAlert
            v-if="verifyAction === 'reject'"
            color="amber"
            variant="soft"
            title="Warning"
            description="Rejecting this payment will notify the buyer to resubmit payment proof."
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeVerifyModal"
            >
              Cancel
            </UButton>
            <UButton
              :color="verifyAction === 'approve' ? 'green' : 'red'"
              @click="verifyPayment"
              :loading="verifying"
            >
              {{ verifyAction === 'approve' ? 'Approve' : 'Reject' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Transaction Details Modal -->
    <UModal v-model="showDetailsModal" :ui="{ width: 'max-w-2xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Transaction Details</h3>
        </template>

        <div v-if="selectedTransaction" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p class="font-mono text-sm">{{ selectedTransaction._id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <UBadge :color="getStatusColor(selectedTransaction.status)">
                {{ formatStatus(selectedTransaction.status) }}
              </UBadge>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Amount</p>
              <p class="font-semibold">฿{{ formatNumber(selectedTransaction.amount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Escrow Fee</p>
              <p class="font-semibold">฿{{ formatNumber(selectedTransaction.escrowFee) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p class="font-semibold">฿{{ formatNumber(selectedTransaction.totalAmount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Created At</p>
              <p>{{ formatDate(selectedTransaction.createdAt) }}</p>
            </div>
          </div>

          <div v-if="selectedTransaction.paymentSlipUrl">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Payment Slip</p>
            <a
              :href="selectedTransaction.paymentSlipUrl"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              View Payment Slip →
            </a>
          </div>

          <div v-if="selectedTransaction.notes">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes</p>
            <p class="text-sm">{{ selectedTransaction.notes }}</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="ghost"
              @click="showDetailsModal = false"
            >
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Error Alert -->
    <UAlert
      v-if="error"
      color="red"
      variant="soft"
      :title="error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
      @close="error = ''"
    />
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types/api'
import dayjs from 'dayjs'

const api = useApi()

const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')

const filters = ref({
  status: '',
  search: ''
})

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending Payment', value: 'pending_payment' },
  { label: 'Payment Submitted', value: 'payment_submitted' },
  { label: 'Payment Verified', value: 'payment_verified' },
  { label: 'In Escrow', value: 'in_escrow' },
  { label: 'In Dispute', value: 'in_dispute' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' }
]

const columns = [
  { key: '_id', label: 'ID', id: '_id' },
  { key: 'status', label: 'Status', id: 'status' },
  { key: 'amount', label: 'Amount', id: 'amount' },
  { key: 'createdAt', label: 'Created', id: 'createdAt' },
  { key: 'actions', label: 'Actions', id: 'actions' }
]

// Verify modal state
const showVerifyModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const verifyAction = ref<'approve' | 'reject'>('approve')
const verifyNote = ref('')
const verifying = ref(false)

// Details modal state
const showDetailsModal = ref(false)

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('th-TH').format(num)
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending_payment': 'gray',
    'payment_submitted': 'yellow',
    'payment_verified': 'blue',
    'in_escrow': 'cyan',
    'in_dispute': 'red',
    'completed': 'green',
    'cancelled': 'gray',
    'refunded': 'orange'
  }
  return colors[status] || 'gray'
}

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: Record<string, any> = {}
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.search) params.search = filters.value.search

    const response = await api.getTransactions(params)
    transactions.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load transactions'
    console.error('Failed to fetch transactions:', err)
  } finally {
    loading.value = false
  }
}

const openVerifyModal = (transaction: Transaction, isApprove: boolean) => {
  selectedTransaction.value = transaction
  verifyAction.value = isApprove ? 'approve' : 'reject'
  verifyNote.value = ''
  showVerifyModal.value = true
}

const closeVerifyModal = () => {
  showVerifyModal.value = false
  selectedTransaction.value = null
  verifyNote.value = ''
}

const verifyPayment = async () => {
  if (!selectedTransaction.value) return

  verifying.value = true
  error.value = ''

  try {
    await api.verifyPayment(selectedTransaction.value._id, {
      isApproved: verifyAction.value === 'approve',
      note: verifyNote.value || undefined
    })

    closeVerifyModal()
    await fetchTransactions()

    // Show success notification
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: `Payment ${verifyAction.value === 'approve' ? 'approved' : 'rejected'} successfully`,
      color: 'green'
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to verify payment'
    console.error('Failed to verify payment:', err)
  } finally {
    verifying.value = false
  }
}

const viewDetails = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  showDetailsModal.value = true
}

let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchTransactions()
  }, 500)
}

onMounted(() => {
  fetchTransactions()
})
</script>
