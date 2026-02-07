<template>
  <UBadge v-bind="$attrs" :label="badgeLabel" :color="badgeColor" />
</template>

<script setup lang="ts">
const props = defineProps<{ status: TransactionStatus }>();

const badgeLabel = computed(() => {
  switch (props.status) {
    case TransactionStatus.DRAFT: {
      return "ร่าง";
    }
    case TransactionStatus.INITIATED: {
      return "สร้างรายการสินค้าแล้ว";
    }
    case TransactionStatus.PENDING_SELLER_CONFIRM: {
      return "รอการยืนยันจากผู้ขาย";
    }
    case TransactionStatus.PENDING_PAYMENT: {
      return "รอการชำระเงิน";
    }
    case TransactionStatus.PAYMENT_VERIFICATION: {
      return "กำลังตรวจสอบการชำระเงิน";
    }
    case TransactionStatus.AWAITING_SHIPMENT: {
      return "รอการจัดส่ง";
    }
    case TransactionStatus.IN_TRANSIT: {
      return "กำลังจัดส่ง";
    }
    case TransactionStatus.SHIPPED: {
      return "จัดส่งแล้ว";
    }
    case TransactionStatus.DELIVERED: {
      return "ส่งมอบแล้ว";
    }
    case TransactionStatus.BUYER_CONFIRMING: {
      return "รอยืนยันจากผู้ซื้อ";
    }
    case TransactionStatus.COMPLETED: {
      return "เสร็จสิ้น";
    }
    case TransactionStatus.PAYMENT_REJECTED: {
      return "การชำระเงินถูกปฏิเสธ";
    }
    case TransactionStatus.CANCELLED: {
      return "ยกเลิกแล้ว";
    }
    case TransactionStatus.REFUNDED: {
      return "คืนเงินแล้ว";
    }
    case TransactionStatus.DISPUTED: {
      return "มีข้อพิพาท";
    }
  }
});

const badgeColor = computed(() => {
  switch (props.status) {
    case TransactionStatus.DRAFT: {
      return "neutral";
    }
    case TransactionStatus.INITIATED:
    case TransactionStatus.PENDING_SELLER_CONFIRM:
    case TransactionStatus.IN_TRANSIT: {
      return "info";
    }
    case TransactionStatus.PENDING_PAYMENT:
    case TransactionStatus.PAYMENT_VERIFICATION:
    case TransactionStatus.AWAITING_SHIPMENT: {
      return "warning";
    }
    case TransactionStatus.SHIPPED:
    case TransactionStatus.DELIVERED:
    case TransactionStatus.BUYER_CONFIRMING:
    case TransactionStatus.COMPLETED: {
      return "success";
    }
    case TransactionStatus.PAYMENT_REJECTED:
    case TransactionStatus.CANCELLED:
    case TransactionStatus.REFUNDED:
    case TransactionStatus.DISPUTED: {
      return "error";
    }
  }
});
</script>
