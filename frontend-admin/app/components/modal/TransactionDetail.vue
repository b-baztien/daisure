<template>
  <!-- Transaction Details Modal -->
  <UModal v-model="showDetailsModal" :ui="{ width: 'max-w-2xl' }">
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium">Transaction Details</h3>
      </template>

      <div v-if="selectedTransaction" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Transaction ID
            </p>
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
            <p class="font-semibold">
              ฿{{ formatNumber(selectedTransaction.amount) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Escrow Fee</p>
            <p class="font-semibold">
              ฿{{ formatNumber(selectedTransaction.escrowFee) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
            <p class="font-semibold">
              ฿{{ formatNumber(selectedTransaction.totalAmount) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p>{{ formatDate(selectedTransaction.createdAt) }}</p>
          </div>
        </div>

        <div v-if="selectedTransaction.paymentSlipUrl">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Payment Slip
          </p>
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
</template>
<script setup lang="ts"></script>
