<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-credit-card" class="h-8 w-8 text-blue-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Transactions
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats?.totalTransactions || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-clock" class="h-8 w-8 text-yellow-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Pending Verification
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats?.pendingVerification || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Disputed Transactions
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats?.disputedTransactions || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-check-circle" class="h-8 w-8 text-green-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Completed Today
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats?.completedToday || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Total Volume Card -->
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Total Transaction Volume
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Total amount processed through the platform
          </p>
        </div>
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          ฿{{ formatNumber(stats?.totalVolume || 0) }}
        </div>
      </div>
    </UCard>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Quick Actions
        </h3>
      </template>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UButton
          to="/transactions"
          color="blue"
          variant="soft"
          block
          icon="i-heroicons-credit-card"
        >
          View Transactions
        </UButton>

        <UButton
          to="/disputes"
          color="red"
          variant="soft"
          block
          icon="i-heroicons-exclamation-triangle"
        >
          Manage Disputes
        </UButton>

        <UButton
          to="/users"
          color="green"
          variant="soft"
          block
          icon="i-heroicons-users"
        >
          Manage Users
        </UButton>

        <UButton
          to="/settings"
          color="gray"
          variant="soft"
          block
          icon="i-heroicons-cog-6-tooth"
        >
          Settings
        </UButton>
      </div>
    </UCard>

    <!-- Loading State -->
    <UCard v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto text-blue-500" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
    </UCard>

    <!-- Error State -->
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
import type { DashboardStats } from '~/types/api'

const api = useApi()

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref('')

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('th-TH').format(num)
}

const fetchStats = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.getDashboardStats()
    stats.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load dashboard data'
    console.error('Failed to fetch dashboard stats:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
