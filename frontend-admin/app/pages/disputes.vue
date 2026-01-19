<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Disputes Management
      </h1>

      <UButton
        icon="i-heroicons-arrow-path"
        @click="fetchDisputes"
        :loading="loading"
      >
        Refresh
      </UButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Active Disputes</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ disputes.length }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Disputes Table -->
    <UCard>
      <UTable
        :rows="disputes"
        :columns="columns"
        :loading="loading"
        :empty-state="{ icon: 'i-heroicons-check-circle', label: 'No active disputes' }"
      >
        <template #status-data="{ row }">
          <UBadge color="red">
            In Dispute
          </UBadge>
        </template>

        <template #amount-data="{ row }">
          <span class="font-semibold">฿{{ formatNumber(row.totalAmount) }}</span>
        </template>

        <template #createdAt-data="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UButton
            size="xs"
            color="blue"
            @click="openResolveModal(row)"
          >
            Resolve Dispute
          </UButton>
        </template>
      </UTable>
    </UCard>

    <!-- Resolve Dispute Modal -->
    <UModal v-model="showResolveModal" :ui="{ width: 'max-w-2xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Resolve Dispute</h3>
        </template>

        <div v-if="selectedDispute" class="space-y-4">
          <!-- Transaction Info -->
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p class="font-mono text-sm">{{ selectedDispute._id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p class="font-semibold">฿{{ formatNumber(selectedDispute.totalAmount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Transaction Amount</p>
              <p>฿{{ formatNumber(selectedDispute.amount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Escrow Fee</p>
              <p>฿{{ formatNumber(selectedDispute.escrowFee) }}</p>
            </div>
          </div>

          <!-- Decision -->
          <UFormField label="Resolution Decision" required>
            <USelect
              v-model="resolution.decision"
              :options="decisionOptions"
              placeholder="Select resolution decision"
            />
          </UFormField>

          <!-- Partial Refund Amount (show only if partial_refund selected) -->
          <UFormField
            v-if="resolution.decision === 'partial_refund'"
            label="Refund Amount"
            required
          >
            <UInput
              v-model.number="resolution.refundAmount"
              type="number"
              :min="0"
              :max="selectedDispute.totalAmount"
              placeholder="Enter refund amount"
            >
              <template #leading>
                <span class="text-gray-500 dark:text-gray-400">฿</span>
              </template>
            </UInput>
            <template #hint>
              Maximum: ฿{{ formatNumber(selectedDispute.totalAmount) }}
            </template>
          </UFormField>

          <!-- Explanation -->
          <UFormField label="Explanation" required>
            <UTextarea
              v-model="resolution.explanation"
              placeholder="Provide a detailed explanation for this decision..."
              :rows="4"
            />
          </UFormField>

          <!-- Decision Info -->
          <UAlert
            v-if="resolution.decision === 'refund_buyer'"
            color="blue"
            variant="soft"
            title="Full Refund to Buyer"
            description="The entire transaction amount will be refunded to the buyer."
          />
          <UAlert
            v-if="resolution.decision === 'release_to_seller'"
            color="green"
            variant="soft"
            title="Release to Seller"
            description="The transaction amount will be released to the seller."
          />
          <UAlert
            v-if="resolution.decision === 'partial_refund'"
            color="amber"
            variant="soft"
            title="Partial Refund"
            description="A partial amount will be refunded to the buyer, and the remaining amount will be released to the seller."
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeResolveModal"
            >
              Cancel
            </UButton>
            <UButton
              color="blue"
              @click="resolveDispute"
              :loading="resolving"
              :disabled="!isResolutionValid"
            >
              Submit Resolution
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
import type { Transaction, DisputeResolution } from '~/types/api'
import dayjs from 'dayjs'

const api = useApi()

const disputes = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')

const columns = [
  { key: '_id', label: 'Transaction ID', id: '_id' },
  { key: 'status', label: 'Status', id: 'status' },
  { key: 'amount', label: 'Amount', id: 'amount' },
  { key: 'createdAt', label: 'Created', id: 'createdAt' },
  { key: 'actions', label: 'Actions', id: 'actions' }
]

const decisionOptions = [
  { label: 'Refund to Buyer (Full)', value: 'refund_buyer' },
  { label: 'Release to Seller', value: 'release_to_seller' },
  { label: 'Partial Refund', value: 'partial_refund' }
]

// Resolve modal state
const showResolveModal = ref(false)
const selectedDispute = ref<Transaction | null>(null)
const resolution = ref<DisputeResolution>({
  decision: 'refund_buyer',
  explanation: '',
  refundAmount: undefined
})
const resolving = ref(false)

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('th-TH').format(num)
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const isResolutionValid = computed(() => {
  if (!resolution.value.explanation) return false
  if (resolution.value.decision === 'partial_refund') {
    return resolution.value.refundAmount !== undefined &&
           resolution.value.refundAmount > 0 &&
           resolution.value.refundAmount <= (selectedDispute.value?.totalAmount || 0)
  }
  return true
})

const fetchDisputes = async () => {
  loading.value = true
  error.value = ''

  try {
    // Fetch only transactions with in_dispute status
    const response = await api.getTransactions({ status: 'in_dispute' })
    disputes.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load disputes'
    console.error('Failed to fetch disputes:', err)
  } finally {
    loading.value = false
  }
}

const openResolveModal = (dispute: Transaction) => {
  selectedDispute.value = dispute
  resolution.value = {
    decision: 'refund_buyer',
    explanation: '',
    refundAmount: undefined
  }
  showResolveModal.value = true
}

const closeResolveModal = () => {
  showResolveModal.value = false
  selectedDispute.value = null
}

const resolveDispute = async () => {
  if (!selectedDispute.value || !isResolutionValid.value) return

  resolving.value = true
  error.value = ''

  try {
    await api.resolveDispute(selectedDispute.value._id, resolution.value)

    closeResolveModal()
    await fetchDisputes()

    // Show success notification
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: 'Dispute resolved successfully',
      color: 'green'
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to resolve dispute'
    console.error('Failed to resolve dispute:', err)
  } finally {
    resolving.value = false
  }
}

onMounted(() => {
  fetchDisputes()
})
</script>
