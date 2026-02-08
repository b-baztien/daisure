<template>
  <!-- Verify Payment Modal -->
  <UModal v-model="showVerifyModal">
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium">
          {{ verifyAction === "approve" ? "Approve" : "Reject" }} Payment
        </h3>
      </template>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Transaction ID:
            <span class="font-mono">{{ selectedTransaction?._id }}</span>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Amount:
            <span class="font-semibold"
              >฿{{ formatNumber(selectedTransaction?.totalAmount || 0) }}</span
            >
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
          <UButton color="gray" variant="ghost" @click="closeVerifyModal">
            Cancel
          </UButton>
          <UButton
            :color="verifyAction === 'approve' ? 'green' : 'red'"
            @click="verifyPayment"
            :loading="verifying"
          >
            {{ verifyAction === "approve" ? "Approve" : "Reject" }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
<script lang="ts" setup></script>
