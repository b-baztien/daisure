<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <UCard>
        <div class="flex items-center">
          <div class="shrink-0">
            <UIcon
              name="i-heroicons-credit-card"
              class="h-8 w-8 text-blue-500"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt
                class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
              >
                Total Transactions
              </dt>
              <dd class="flex items-baseline">
                <div
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  {{ data?.totalTransactions || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="shrink-0">
            <UIcon name="i-heroicons-clock" class="h-8 w-8 text-yellow-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt
                class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
              >
                Pending Verification
              </dt>
              <dd class="flex items-baseline">
                <div
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  {{ data?.pendingVerification || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="shrink-0">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="h-8 w-8 text-red-500"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt
                class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
              >
                Disputed Transactions
              </dt>
              <dd class="flex items-baseline">
                <div
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  {{ data?.disputedTransactions || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="shrink-0">
            <UIcon
              name="i-heroicons-check-circle"
              class="h-8 w-8 text-green-500"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt
                class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
              >
                Completed Today
              </dt>
              <dd class="flex items-baseline">
                <div
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  {{ data?.completedToday || 0 }}
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
          ฿{{ formatNumber(data?.totalVolume || 0) }}
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
          color="info"
          variant="soft"
          block
          icon="i-heroicons-credit-card"
          label="View Transactions"
        />

        <UButton
          to="/disputes"
          color="error"
          variant="soft"
          block
          icon="i-heroicons-exclamation-triangle"
          label="Manage Disputes"
        />

        <UButton
          to="/users"
          color="success"
          variant="soft"
          block
          icon="i-heroicons-users"
          label="Manage Users"
        />

        <UButton
          to="/settings"
          color="neutral"
          variant="soft"
          block
          icon="i-heroicons-cog-6-tooth"
          label="Settings"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { data } = await useDashboardService().getDashboardStats();
</script>
