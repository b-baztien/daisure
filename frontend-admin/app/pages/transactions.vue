<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Transactions Management
      </h1>

      <UButton icon="i-heroicons-arrow-path" @click="refresh()">
        Refresh
      </UButton>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormField label="Status">
          <USelect
            v-model="filters.status"
            :items="statusOptions"
            @change="refresh()"
          />
        </UFormField>

        <UFormField label="Search">
          <UInput
            v-model="filters.search"
            placeholder="Search transaction ID..."
            icon="i-heroicons-magnifying-glass"
            @input="refresh()"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- Transactions Table -->
    <!-- {{ transactions.data }} -->
    <UCard>
      <UTable
        :data="transactions.data || []"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-inbox',
          label: 'No transactions found',
        }"
      >
        <template #transactionNumber-cell="{ row }">
          <span># {{ row.original.transactionNumber }}</span>
        </template>

        <template #seller_displayName-cell="{ row }">
          <span>{{ row.original.seller.displayName }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :label="row.original.status"
            :color="getStatusColor(row.original.status)"
          />
        </template>

        <template #payment_totalAmount-cell="{ row }">
          <UTooltip arrow>
            <span class="font-semibold"
              >฿ {{ formatNumber(row.original.payment.totalAmount) }}</span
            >
            <template #content>
              <div class="flex gap-2 items-center justify-center h-full">
                <div>
                  <strong>escrowFee :</strong>
                  {{ formatNumber(row.original.payment.escrowFee) }} ฿
                </div>
                <p>|</p>
                <div>
                  <strong>productPrice :</strong>
                  {{ formatNumber(row.original.payment.productPrice) }} ฿
                </div>
                <p>|</p>
                <div>
                  <strong>shippingFee :</strong>
                  {{ formatNumber(row.original.payment.shippingFee) }} ฿
                </div>
              </div>
            </template>
          </UTooltip>
        </template>
        <template #createdAt-cell="{ row }">
          {{ formatDate(row.original.createdAt) }}
        </template>

        <!-- <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">
            {{ formatStatus(row.status) }}
          </UBadge>
        </template> -->

        <!-- <template #amount-data="{ row }">
          <span class="font-semibold"
            >฿{{ formatNumber(row.totalAmount) }}</span
          >
        </template>-->

        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              v-if="row.status === 'payment_submitted'"
              variant="solid"
              size="xs"
              color="primary"
              @click="openVerifyModal(row, true)"
            >
              Approve
            </UButton>
            <UButton
              v-if="row.status === 'payment_submitted'"
              variant="solid"
              size="xs"
              color="error"
              @click="openVerifyModal(row, false)"
            >
              Reject
            </UButton>

            <UButton
              variant="solid"
              size="xs"
              color="secondary"
              icon="i-heroicons-eye"
              @click="openModalTransactionDetail(row.original)"
            >
              View
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { SelectItem, TableColumn } from "@nuxt/ui";
import dayjs from "dayjs";
import type { TransactionManage } from "~/types/transactionManage";
import { LazyModalTransactionDetail } from "#components";

const api = useApi();

const alert = useAlert();

const { data: transactions, refresh } =
  await useTransactionService().getTransactions();

const filters = ref({
  status: "all",
  search: "",
});

const statusOptions = ref<SelectItem[]>([
  { label: "All", value: "all" },
  { label: "Pending Payment", value: "pending_payment" },
  { label: "Payment Submitted", value: "payment_submitted" },
  { label: "Payment Verified", value: "payment_verified" },
  { label: "In Escrow", value: "in_escrow" },
  { label: "In Dispute", value: "in_dispute" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
]);

const columns = computed<TableColumn<TransactionManage>[]>(() => [
  { accessorKey: "transactionNumber", header: "Transaction Number" },
  { accessorKey: "seller.displayName", header: "Seller Name" },
  { accessorKey: "product.name", header: "Product Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "payment.totalAmount", header: "Price" },
  { accessorKey: "createdAt", header: "Created" },
  { accessorKey: "actions", header: "Actions" },
]);

// Verify modal state
const showVerifyModal = ref(false);
const selectedTransaction = ref<Transaction | null>(null);
const verifyAction = ref<"approve" | "reject">("approve");
const verifyNote = ref("");
const verifying = ref(false);

// Details modal state
const showDetailsModal = ref(false);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const openVerifyModal = (transaction: Transaction, isApprove: boolean) => {
  selectedTransaction.value = transaction;
  verifyAction.value = isApprove ? "approve" : "reject";
  verifyNote.value = "";
  showVerifyModal.value = true;
};

const closeVerifyModal = () => {
  showVerifyModal.value = false;
  selectedTransaction.value = null;
  verifyNote.value = "";
};

const verifyPayment = async () => {
  if (!selectedTransaction.value) return;

  verifying.value = true;

  await api.verifyPayment(selectedTransaction.value._id, {
    isApproved: verifyAction.value === "approve",
    note: verifyNote.value || undefined,
  });

  closeVerifyModal();

  alert.success(
    `Payment ${verifyAction.value === "approve" ? "approved" : "rejected"} successfully`,
  );
  return;
};

const viewDetails = (transaction: Transaction) => {
  selectedTransaction.value = transaction;
  showDetailsModal.value = true;
};

function openModalTransactionDetail(row: Transaction) {
  useModal(LazyModalTransactionDetail, {
    transactions: row,
  });
}
</script>
