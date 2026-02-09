<template>
  <!-- Transaction Details Modal -->
  <UModal title="Transaction Details">
    <template #body>
      <div v-if="props.transactions" class="px-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p>Transaction Number</p>
            <p class="font-mono text-sm">
              # {{ props.transactions.transactionNumber }}
            </p>
          </div>
          <div>
            <p>Status</p>
            <UBadge
              :label="props.transactions.status"
              :color="getStatusColor(props.transactions.status)"
            />
          </div>

          <div>
            <p>Seller Name</p>
            <p>{{ props.transactions.seller.displayName }}</p>
          </div>
          <div>
            <p>Created At</p>
            <p>{{ formatDate(props.transactions.createdAt) }}</p>
          </div>
          <div></div>
          <UCard class="col-span-2">
            <template #header><p>Product</p></template>

            <div class="flex gap-8">
              <div>
                <p>Name</p>
                <p>{{ props.transactions.product.name }}</p>
              </div>
              <div>
                <p>Price</p>
                <p>฿ {{ formatNumber(props.transactions.product.price) }}</p>
              </div>
            </div>
          </UCard>
          <UCard class="col-span-2">
            <template #header><p>Price Detail</p></template>

            <div class="flex gap-8 justify-center items-center">
              <div>
                <p>Product Price</p>
                <p class="font-semibold">
                  ฿
                  {{ formatNumber(props.transactions.payment.productPrice) }}
                </p>
              </div>
              <div>
                <p>Escrow Fee</p>
                <p class="font-semibold">
                  ฿ {{ formatNumber(props.transactions.payment.escrowFee) }}
                </p>
              </div>
              <div>
                <p>Shipping Fee</p>
                <p class="font-semibold">
                  ฿ {{ formatNumber(props.transactions.payment.shippingFee) }}
                </p>
              </div>
            </div>
            <template #footer
              ><p>
                Total Amount: ฿
                {{ formatNumber(props.transactions.payment.totalAmount) }}
              </p></template
            >
          </UCard>
          <UCard class="col-span-2">
            <template #header><p>Timeline</p></template>

            <UTimeline :items="items" />
          </UCard>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import Transactions from "~/pages/transactions.vue";

const props = defineProps({
  transactions: {
    type: Object as () => typeof Transactions,
    required: true,
  },
});

const items = computed(() => {
  const timelineItems = props.transactions.timeline.map((event: any) => ({
    date: formatDate(event.timestamp),
    title: event.action,
    description: event.description,
    icon: "i-lucide-check-circle",
  }));
  return timelineItems;
});
</script>
