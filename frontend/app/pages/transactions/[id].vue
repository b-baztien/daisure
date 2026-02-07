<template>
  <div v-if="transaction" class="max-w-6xl mx-auto">
    <div class="mb-6">
      <UButton
        to="/transactions"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        กลับ
      </UButton>

      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ transaction.product.name }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ transaction.transactionNumber }}
          </p>
        </div>

        <BadgeTransaction :status="transaction.status" />
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <div class="grid grid-cols-2 gap-4">
            <img
              v-for="(img, index) in transaction.product.images"
              :key="index"
              :src="img"
              :alt="`Product image ${index + 1}`"
              class="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
              @click="openImageModal(img)"
            />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">รายละเอียดสินค้า</h2>
          </template>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">คำอธิบาย</h3>
              <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {{ transaction.product.description }}
              </p>
            </div>

            <UDivider />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">หมวดหมู่</p>
                <p class="font-semibold">
                  {{ transaction.product.category || "-" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">ราคา</p>
                <p class="font-semibold text-xl text-blue-600">
                  ฿{{ formatNumber(transaction.product.price) }}
                </p>
              </div>
            </div>

            <div v-if="transaction.product.sourceUrl">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                ลิงค์ต้นทาง
              </p>
              <UButton
                :to="transaction.product.sourceUrl"
                target="_blank"
                color="neutral"
                variant="outline"
                icon="i-heroicons-arrow-top-right-on-square"
                size="sm"
              >
                ดูโพสต์ต้นทาง
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- <UCard v-if="transaction.shipping?.trackingNumber">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">ข้อมูลการจัดส่ง</h2>
              <UBadge color="purple" variant="soft">
                {{ transaction.shipping.method }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                หมายเลขพัสดุ
              </p>
              <div class="flex items-center gap-2">
                <p class="font-mono text-lg font-semibold">
                  {{ transaction.shipping.trackingNumber }}
                </p>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-clipboard-document"
                  size="xs"
                  @click="copyToClipboard(transaction.shipping.trackingNumber)"
                />
              </div>
            </div>

            <UButton
              v-if="transaction.shipping.trackingUrl"
              :to="transaction.shipping.trackingUrl"
              target="_blank"
              color="purple"
              variant="outline"
              icon="i-heroicons-truck"
            >
              ติดตามพัสดุ
            </UButton>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  วันที่จัดส่ง
                </p>
                <p class="font-semibold">
                  {{ formatDate(transaction.shipping.shippedAt) }}
                </p>
              </div>
              <div v-if="transaction.shipping.deliveredAt">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  วันที่ได้รับ
                </p>
                <p class="font-semibold text-green-600">
                  {{ formatDate(transaction.shipping.deliveredAt) }}
                </p>
              </div>
            </div>
          </div>
        </UCard> -->

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">ประวัติการทำรายการ</h2>
          </template>

          <div class="space-y-4">
            <div
              v-for="(item, index) in transaction.timeline"
              :key="index"
              class="flex gap-4"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getTimelineColor(item.status)"
                >
                  <UIcon :name="getTimelineIcon(item.status)" class="w-5 h-5" />
                </div>
                <div
                  v-if="index < transaction.timeline.length - 1"
                  class="w-0.5 h-16 bg-gray-200 dark:bg-gray-700"
                />
              </div>

              <div class="flex-1 pb-8">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ item.description }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ formatDateTime(item.timestamp) }}
                </p>
                <p
                  v-if="item.note"
                  class="text-sm text-gray-500 dark:text-gray-400 mt-2 italic"
                >
                  "{{ item.note }}"
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- <UCard v-if="transaction.dispute?.isDisputed" color="red">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-6 h-6 text-red-600"
              />
              <h2 class="text-xl font-semibold text-red-600">ข้อพิพาท</h2>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">เหตุผล</p>
              <p class="font-semibold">{{ transaction.dispute.reason }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                คำอธิบาย
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                {{ transaction.dispute.description }}
              </p>
            </div>

            <div v-if="transaction.dispute.evidence?.length">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                หลักฐาน
              </p>
              <div class="grid grid-cols-3 gap-2">
                <img
                  v-for="(evidence, index) in transaction.dispute.evidence"
                  :key="index"
                  :src="evidence.url"
                  class="w-full h-24 object-cover rounded-lg cursor-pointer"
                  @click="openImageModal(evidence.url)"
                />
              </div>
            </div>

            <div v-if="transaction.dispute.resolution">
              <UAlert color="green" variant="soft">
                <template #title>การแก้ไขข้อพิพาท</template>
                <template #description>
                  <p class="font-semibold mb-1">
                    {{
                      getResolutionText(transaction.dispute.resolution.decision)
                    }}
                  </p>
                  <p>{{ transaction.dispute.resolution.explanation }}</p>
                  <p class="text-sm mt-2">
                    แก้ไขเมื่อ:
                    {{
                      formatDateTime(transaction.dispute.resolution.resolvedAt)
                    }}
                  </p>
                </template>
              </UAlert>
            </div>
          </div>
        </UCard> -->
      </div>

      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">สรุปยอดชำระ</h2>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">ราคาสินค้า</span>
              <span>฿{{ formatNumber(transaction.payment.productPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ค่าธรรมเนียม</span>
              <span>฿{{ formatNumber(transaction.payment.escrowFee) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ค่าจัดส่ง</span>
              <span>฿{{ formatNumber(transaction.payment.shippingFee) }}</span>
            </div>
            <UDivider />
            <div class="flex justify-between text-lg font-bold">
              <span>รวมทั้งสิ้น</span>
              <span class="text-blue-600">
                ฿{{ formatNumber(transaction.payment.totalAmount) }}
              </span>
            </div>
          </div>

          <!-- <div
            v-if="transaction.payment.buyerPayment"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-green-600"
              />
              <span class="text-sm font-semibold text-green-600"
                >ชำระเงินแล้ว</span
              >
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              ชำระเมื่อ:
              {{ formatDateTime(transaction.payment.buyerPayment.paidAt) }}
            </p>
          </div> -->
        </UCard>

        <UCard
          v-if="isSeller && transaction.shareToken && transaction.status === 'initiated'"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-share" class="w-5 h-5 text-blue-600" />
              <h2 class="text-lg font-semibold">ลิงก์สำหรับแชร์</h2>
            </div>
          </template>

          <div class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              ส่งลิงก์นี้ให้ผู้ซื้อเพื่อเข้าดูรายละเอียดและทำการซื้อ
            </p>

            <div
              class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <p class="flex-1 text-sm font-mono truncate">
                {{ shareLink }}
              </p>
              <UButton
                color="primary"
                variant="soft"
                icon="i-heroicons-clipboard-document"
                size="sm"
                @click="copyShareLink"
              >
                คัดลอก
              </UButton>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">การดำเนินการ</h2>
          </template>

          <div class="space-y-3">
            <UButton
              v-if="transaction.status === 'pending_payment' && isBuyer"
              :to="`/payments/${transaction._id}/instructions`"
              block
              size="lg"
              icon="i-heroicons-banknotes"
            >
              ชำระเงิน
            </UButton>

            <UButton
              v-if="transaction.status === 'pending_payment' && isBuyer"
              :to="`/payments/${transaction._id}/submit`"
              color="success"
              variant="outline"
              block
              icon="i-heroicons-photo"
            >
              อัพโหลดสลิป
            </UButton>

            <UButton
              v-if="transaction.status === 'awaiting_shipment' && isSeller"
              color="warning"
              block
              size="lg"
              icon="i-heroicons-truck"
              @click="showShippingModal = true"
            >
              จัดส่งสินค้า
            </UButton>

            <UButton
              v-if="transaction.status === 'delivered' && isBuyer"
              color="success"
              block
              size="lg"
              icon="i-heroicons-check-circle"
              @click="confirmDelivery"
            >
              ยืนยันรับสินค้า
            </UButton>

            <UButton
              v-if="transaction.status === 'completed' && !hasReviewed"
              :to="`/reviews/create/${transaction._id}`"
              color="success"
              variant="outline"
              block
              icon="i-heroicons-star"
            >
              เขียนรีวิว
            </UButton>

            <UButton
              v-if="canDispute"
              color="error"
              variant="outline"
              block
              icon="i-heroicons-exclamation-triangle"
              @click="showDisputeModal = true"
            >
              แจ้งปัญหา
            </UButton>

            <UButton
              v-if="canCancel"
              color="neutral"
              variant="outline"
              block
              icon="i-heroicons-x-circle"
              @click="showCancelModal = true"
            >
              ยกเลิกรายการ
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">ผู้เกี่ยวข้อง</h2>
          </template>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                ผู้ขาย
              </p>
              <div class="flex items-center gap-3">
                <UAvatar :alt="transaction.seller.displayName" size="md" />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold truncate">
                    {{ transaction.seller.displayName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ transaction.seller.phone }}
                  </p>
                </div>
                <UBadge v-if="isSeller" color="success" variant="soft">
                  คุณ
                </UBadge>
              </div>
            </div>

            <template v-if="transaction.buyer">
              <UDivider />

              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ผู้ซื้อ
                </p>
                <div class="flex items-center gap-3">
                  <UAvatar :alt="transaction.buyer.displayName" size="md" />
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold truncate">
                      {{ transaction.buyer.displayName }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ transaction.buyer.phone }}
                    </p>
                  </div>
                  <UBadge v-if="isBuyer" color="info" variant="soft">
                    คุณ
                  </UBadge>
                </div>
              </div>
            </template>

            <template v-if="transaction.admin">
              <UDivider />
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  แอดมินผู้ดูแล
                </p>
                <div class="flex items-center gap-3">
                  <UAvatar :alt="transaction.admin.displayName" size="md" />
                  <div>
                    <p class="font-semibold">
                      {{ transaction.admin.displayName }}
                    </p>
                    <UBadge color="secondary" variant="soft" size="xs">
                      Admin
                    </UBadge>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </UCard>
      </div>
    </div>
  </div>

  <div v-else-if="pending" class="max-w-6xl mx-auto">
    <USkeleton class="h-96 mb-6" />
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <USkeleton class="h-64" />
        <USkeleton class="h-48" />
      </div>
      <div class="space-y-6">
        <USkeleton class="h-64" />
        <USkeleton class="h-48" />
      </div>
    </div>
  </div>

  <UCard v-else>
    <div class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="w-16 h-16 mx-auto mb-4 text-red-600"
      />
      <h3 class="text-lg font-semibold mb-2">ไม่พบรายการ</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        รายการที่คุณค้นหาไม่มีอยู่ในระบบ
      </p>
      <UButton to="/transactions"> กลับไปหน้ารายการ </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const route = useRoute();
const transactionStore = useTransactionStore();

const alert = useAlert();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const id = useRouteParams<string>("id");
const { data: transaction, pending } = useTransactionService().getTransaction(
  id.value,
);

// States
const showShippingModal = ref(false);
const showDisputeModal = ref(false);
const showImageModal = ref(false);
const showCancelModal = ref(false);
const selectedImage = ref("");
const hasReviewed = ref(false);

const disputeForm = reactive({
  reason: "",
  description: "",
});

const disputeReasons = [
  "สินค้าไม่ตรงตามรูป",
  "สินค้าเสียหาย",
  "ไม่ได้รับสินค้า",
  "สินค้าปลอม",
  "อื่นๆ",
];

const isSeller = computed(
  () => transaction.value?.seller?.userId._id === profile.value?._id,
);
const isBuyer = computed(() => !isSeller.value);

const canDispute = computed(() => {
  if (!transaction.value) return false;
  const disputeableStatuses = ["shipped", "delivered", "completed"];
  return (
    disputeableStatuses.includes(transaction.value.status) &&
    !transaction.value.dispute?.isDisputed &&
    isBuyer.value
  );
});

const shareLink = computed(() => {
  if (!transaction.value?.shareToken) return "";
  const origin = window.location.origin;
  return `${origin}/share/${transaction.value.shareToken}`;
});

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    alert.success("คัดลอกลิงก์แล้ว");
  } catch {
    alert.error("ไม่สามารถคัดลอกลิงก์ได้");
  }
};

const canCancel = computed(() => {
  if (!transaction.value) return false;
  const cancellableStatuses = ["pending_payment", "payment_verification"];
  return cancellableStatuses.includes(transaction.value.status);
});

// Methods
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimelineColor = (status: string) => {
  const colors: Record<string, string> = {
    initiated: "bg-blue-100 text-blue-600",
    pending_payment: "bg-yellow-100 text-yellow-600",
    payment_verification: "bg-blue-100 text-blue-600",
    awaiting_shipment: "bg-orange-100 text-orange-600",
    shipped: "bg-purple-100 text-purple-600",
    delivered: "bg-cyan-100 text-cyan-600",
    completed: "bg-green-100 text-green-600",
    disputed: "bg-red-100 text-red-600",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
};

const getTimelineIcon = (status: string) => {
  const icons: Record<string, string> = {
    initiated: "i-heroicons-plus-circle",
    pending_payment: "i-heroicons-banknotes",
    payment_verification: "i-heroicons-magnifying-glass",
    awaiting_shipment: "i-heroicons-clock",
    shipped: "i-heroicons-truck",
    delivered: "i-heroicons-home",
    completed: "i-heroicons-check-circle",
    disputed: "i-heroicons-exclamation-triangle",
  };
  return icons[status] || "i-heroicons-information-circle";
};

const getResolutionText = (decision: string) => {
  const texts: Record<string, string> = {
    refund_buyer: "คืนเงินให้ผู้ซื้อ",
    release_to_seller: "โอนเงินให้ผู้ขาย",
    partial_refund: "คืนเงินบางส่วน",
  };
  return texts[decision] || decision;
};

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  showImageModal.value = true;
};

const confirmDelivery = async () => {
  try {
    await transactionStore.confirmDelivery(
      route.params.id as string,
      "ยืนยันรับสินค้าแล้ว สภาพสมบูรณ์",
    );

    alert.success(
      "ยืนยันรับสินค้าสำเร็จ ระบบจะโอนเงินให้ผู้ขายภายใน 24 ชั่วโมง",
    );
  } catch (error: any) {
    alert.error(
      error.data?.message || "เกิดข้อผิดพลาด ไม่สามารถยืนยันรับสินค้าได้",
    );
  }
};

const submitDispute = async () => {
  if (!disputeForm.reason || !disputeForm.description) {
    alert.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    await transactionStore.createDispute(route.params.id as string, {
      reason: disputeForm.reason,
      description: disputeForm.description,
      evidence: [],
    });

    alert.success(
      "ส่งเรื่องสำเร็จ Admin จะตรวจสอบและติดต่อกลับภายใน 48 ชั่วโมง",
    );
    showDisputeModal.value = false;
  } catch (error: any) {
    alert.error(error.data?.message || "ไม่สามารถส่งเรื่องได้");
  }
};
</script>
