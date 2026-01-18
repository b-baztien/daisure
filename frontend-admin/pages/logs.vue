<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Logs
      </h1>

      <UButton
        icon="i-heroicons-arrow-path"
        @click="fetchLogs"
        :loading="loading"
      >
        Refresh
      </UButton>
    </div>

    <!-- Info Banner -->
    <UAlert
      color="blue"
      variant="soft"
      title="Audit Trail"
      description="This page shows all administrative actions performed in the system for audit and compliance purposes."
    />

    <!-- Filters -->
    <UCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormGroup label="Action Type">
          <USelect
            v-model="filters.action"
            :options="actionOptions"
            @change="fetchLogs"
          />
        </UFormGroup>

        <UFormGroup label="Target Type">
          <USelect
            v-model="filters.targetType"
            :options="targetTypeOptions"
            @change="fetchLogs"
          />
        </UFormGroup>

        <UFormGroup label="Search">
          <UInput
            v-model="filters.search"
            placeholder="Search logs..."
            icon="i-heroicons-magnifying-glass"
            @input="debouncedSearch"
          />
        </UFormGroup>
      </div>
    </UCard>

    <!-- Logs Table -->
    <UCard>
      <UTable
        :rows="logs"
        :columns="columns"
        :loading="loading"
        :empty-state="{ icon: 'i-heroicons-document-text', label: 'No logs found' }"
      >
        <template #action-data="{ row }">
          <UBadge :color="getActionColor(row.action)">
            {{ formatAction(row.action) }}
          </UBadge>
        </template>

        <template #targetType-data="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ row.targetType }}
          </span>
        </template>

        <template #targetId-data="{ row }">
          <span class="font-mono text-xs text-gray-500 dark:text-gray-400">
            {{ row.targetId.substring(0, 8) }}...
          </span>
        </template>

        <template #createdAt-data="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UButton
            size="xs"
            color="gray"
            icon="i-heroicons-eye"
            @click="viewDetails(row)"
          >
            View
          </UButton>
        </template>
      </UTable>
    </UCard>

    <!-- Log Details Modal -->
    <UModal v-model="showDetailsModal" :ui="{ width: 'max-w-3xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Log Details</h3>
        </template>

        <div v-if="selectedLog" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Log ID</p>
              <p class="font-mono text-sm">{{ selectedLog._id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Action</p>
              <UBadge :color="getActionColor(selectedLog.action)">
                {{ formatAction(selectedLog.action) }}
              </UBadge>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Target Type</p>
              <p>{{ selectedLog.targetType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Target ID</p>
              <p class="font-mono text-sm">{{ selectedLog.targetId }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Admin ID</p>
              <p class="font-mono text-sm">{{ selectedLog.adminId }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
              <p>{{ formatDate(selectedLog.createdAt) }}</p>
            </div>
            <div v-if="selectedLog.ipAddress">
              <p class="text-sm text-gray-500 dark:text-gray-400">IP Address</p>
              <p class="font-mono text-sm">{{ selectedLog.ipAddress }}</p>
            </div>
          </div>

          <!-- Reason -->
          <div v-if="selectedLog.reason">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Reason</p>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p class="text-sm">{{ selectedLog.reason }}</p>
            </div>
          </div>

          <!-- Changes -->
          <div v-if="selectedLog.changes">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Changes</p>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <pre class="text-xs overflow-auto">{{ JSON.stringify(selectedLog.changes, null, 2) }}</pre>
            </div>
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
import type { AdminLog } from '~/types/api'
import dayjs from 'dayjs'

const api = useApi()

const logs = ref<AdminLog[]>([])
const loading = ref(false)
const error = ref('')

const filters = ref({
  action: '',
  targetType: '',
  search: ''
})

const actionOptions = [
  { label: 'All Actions', value: '' },
  { label: 'Verify Payment', value: 'verify_payment' },
  { label: 'Resolve Dispute', value: 'resolve_dispute' },
  { label: 'Assign Transaction', value: 'assign_transaction' },
  { label: 'Hide Review', value: 'hide_review' },
  { label: 'Unhide Review', value: 'unhide_review' },
  { label: 'Update Settings', value: 'update_settings' }
]

const targetTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Transaction', value: 'transaction' },
  { label: 'Review', value: 'review' },
  { label: 'User', value: 'user' },
  { label: 'Settings', value: 'settings' }
]

const columns = [
  { key: 'action', label: 'Action' },
  { key: 'targetType', label: 'Target Type' },
  { key: 'targetId', label: 'Target ID' },
  { key: 'createdAt', label: 'Timestamp' },
  { key: 'actions', label: 'Actions' }
]

// Details modal state
const showDetailsModal = ref(false)
const selectedLog = ref<AdminLog | null>(null)

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss')
}

const formatAction = (action: string) => {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    'verify_payment': 'green',
    'resolve_dispute': 'red',
    'assign_transaction': 'blue',
    'hide_review': 'orange',
    'unhide_review': 'green',
    'update_settings': 'purple'
  }
  return colors[action] || 'gray'
}

const fetchLogs = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: Record<string, any> = {}
    if (filters.value.action) params.action = filters.value.action
    if (filters.value.targetType) params.targetType = filters.value.targetType
    if (filters.value.search) params.search = filters.value.search

    const response = await api.getAdminLogs(params)
    logs.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load admin logs'
    console.error('Failed to fetch admin logs:', err)
  } finally {
    loading.value = false
  }
}

const viewDetails = (log: AdminLog) => {
  selectedLog.value = log
  showDetailsModal.value = true
}

let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchLogs()
  }, 500)
}

onMounted(() => {
  fetchLogs()
})
</script>
