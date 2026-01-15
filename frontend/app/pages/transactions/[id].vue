<!-- ========================================
File: pages/transactions/[id].vue (COMPLETE)
======================================== -->
<template>
  <div v-if="transaction" class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <UButton
        to="/transactions"
        color="gray"
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

        <UBadge
          :color="getStatusColor(transaction.status)"
          variant="soft"
          size="lg"
        >
          {{ getStatusText(transaction.status) }}
        </UBadge>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Left Column (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Images -->
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

        <!-- Product Details -->
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
                color="gray"
                variant="outline"
                icon="i-heroicons-arrow-top-right-on-square"
                size="sm"
              >
                ดูโพสต์ต้นทาง
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Shipping Info (if shipped) -->
        <UCard v-if="transaction.shipping?.trackingNumber">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">ข้อมูลการจัดส่ง</h2>
              <UBadge color="purple" variant="soft">
                {{ transaction.shipping.method }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Tracking Number -->
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                หมายเลขพัสดุ
              </p>
              <div class="flex items-center gap-2">
                <p class="font-mono text-lg font-semibold">
                  {{ transaction.shipping.trackingNumber }}
                </p>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-clipboard-document"
                  size="xs"
                  @click="copyToClipboard(transaction.shipping.trackingNumber)"
                />
              </div>
            </div>

            <!-- Track Button -->
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

            <!-- Dates -->
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
        </UCard>

        <!-- Timeline -->
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
              <!-- Icon -->
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

              <!-- Content -->
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

        <!-- Dispute Info (if disputed) -->
        <UCard v-if="transaction.dispute?.isDisputed" color="red">
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
        </UCard>
      </div>

      <!-- Right Column (1/3) -->
      <div class="space-y-6">
        <!-- Payment Summary -->
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

          <!-- Payment Status -->
          <div
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
          </div>
        </UCard>

        <!-- Actions -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">การดำเนินการ</h2>
          </template>

          <div class="space-y-3">
            <!-- Pay Button -->
            <UButton
              v-if="transaction.status === 'pending_payment' && isBuyer"
              :to="`/payments/${transaction.id}/instructions`"
              block
              size="lg"
              icon="i-heroicons-banknotes"
            >
              ชำระเงิน
            </UButton>

            <!-- Upload Slip Button -->
            <UButton
              v-if="transaction.status === 'pending_payment' && isBuyer"
              :to="`/payments/${transaction.id}/submit`"
              color="green"
              variant="outline"
              block
              icon="i-heroicons-photo"
            >
              อัพโหลดสลิป
            </UButton>

            <!-- Ship Button -->
            <UButton
              v-if="transaction.status === 'awaiting_shipment' && isSeller"
              color="purple"
              block
              size="lg"
              icon="i-heroicons-truck"
              @click="showShippingModal = true"
            >
              จัดส่งสินค้า
            </UButton>

            <!-- Confirm Delivery -->
            <UButton
              v-if="transaction.status === 'delivered' && isBuyer"
              color="green"
              block
              size="lg"
              icon="i-heroicons-check-circle"
              @click="confirmDelivery"
              :loading="isConfirming"
            >
              ยืนยันรับสินค้า
            </UButton>

            <!-- Review Button -->
            <UButton
              v-if="transaction.status === 'completed' && !hasReviewed"
              :to="`/reviews/create/${transaction.id}`"
              color="yellow"
              variant="outline"
              block
              icon="i-heroicons-star"
            >
              เขียนรีวิว
            </UButton>

            <!-- Dispute Button -->
            <UButton
              v-if="canDispute"
              color="red"
              variant="outline"
              block
              icon="i-heroicons-exclamation-triangle"
              @click="showDisputeModal = true"
            >
              แจ้งปัญหา
            </UButton>

            <!-- Cancel Button -->
            <UButton
              v-if="canCancel"
              color="gray"
              variant="outline"
              block
              icon="i-heroicons-x-circle"
              @click="showCancelModal = true"
            >
              ยกเลิกรายการ
            </UButton>
          </div>
        </UCard>

        <!-- Participants -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">ผู้เกี่ยวข้อง</h2>
          </template>

          <div class="space-y-4">
            <!-- Buyer -->
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
                <UBadge v-if="isBuyer" color="blue" variant="soft">
                  คุณ
                </UBadge>
              </div>
            </div>

            <UDivider />

            <!-- Seller -->
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
                <UBadge v-if="isSeller" color="green" variant="soft">
                  คุณ
                </UBadge>
              </div>
            </div>

            <!-- Admin (if assigned) -->
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
                    <UBadge color="purple" variant="soft" size="xs">
                      Admin
                    </UBadge>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </UCard>

        <!-- Shipping Address -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">ที่อยู่จัดส่ง</h2>
          </template>

          <div class="text-sm space-y-2">
            <p class="font-semibold">
              {{ transaction.buyer.shippingAddress.recipientName }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              {{ transaction.buyer.shippingAddress.phone }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              {{ transaction.buyer.shippingAddress.address }}<br />
              {{ transaction.buyer.shippingAddress.subDistrict }}
              {{ transaction.buyer.shippingAddress.district }}<br />
              {{ transaction.buyer.shippingAddress.province }}
              {{ transaction.buyer.shippingAddress.postalCode }}
            </p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Modals -->
    <!-- Shipping Modal -->
    <UModal v-model="showShippingModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">บันทึกข้อมูลการจัดส่ง</h3>
        </template>

        <UForm :state="shippingForm" @submit="submitShipping" class="space-y-4">
          <UFormGroup label="วิธีการจัดส่ง" required>
            <USelectMenu
              v-model="shippingForm.method"
              :options="shippingMethods"
              placeholder="เลือกบริษัทขนส่ง"
            />
          </UFormGroup>

          <UFormGroup label="หมายเลขพัสดุ" required>
            <UInput
              v-model="shippingForm.trackingNumber"
              placeholder="KRYTH123456789"
            />
          </UFormGroup>

          <UFormGroup label="ลิงค์ติดตามพัสดุ">
            <UInput
              v-model="shippingForm.trackingUrl"
              placeholder="https://track.kerryexpress.com/..."
            />
          </UFormGroup>

          <div class="flex gap-2 justify-end">
            <UButton
              color="gray"
              variant="outline"
              @click="showShippingModal = false"
            >
              ยกเลิก
            </UButton>
            <UButton type="submit" :loading="isShipping"> บันทึก </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Dispute Modal -->
    <UModal v-model="showDisputeModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600">แจ้งปัญหา</h3>
        </template>

        <UForm :state="disputeForm" @submit="submitDispute" class="space-y-4">
          <UFormGroup label="เหตุผล" required>
            <USelectMenu
              v-model="disputeForm.reason"
              :options="disputeReasons"
              placeholder="เลือกเหตุผล"
            />
          </UFormGroup>

          <UFormGroup label="รายละเอียด" required>
            <UTextarea
              v-model="disputeForm.description"
              placeholder="อธิบายปัญหาที่พบ..."
              :rows="4"
            />
          </UFormGroup>

          <div class="flex gap-2 justify-end">
            <UButton
              color="gray"
              variant="outline"
              @click="showDisputeModal = false"
            >
              ยกเลิก
            </UButton>
            <UButton type="submit" color="red" :loading="isDisputing">
              ส่งเรื่อง
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Image Modal -->
    <UModal v-model="showImageModal" :ui="{ width: 'max-w-4xl' }">
      <div class="p-4">
        <img :src="selectedImage" class="w-full h-auto rounded-lg" />
      </div>
    </UModal>
  </div>

  <!-- Loading State -->
  <div v-else-if="isLoading" class="max-w-6xl mx-auto">
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

  <!-- Error State -->
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
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();
const authStore = useAuthStore();
const toast = useToast();

const { currentTransaction: transaction, isLoading } =
  storeToRefs(transactionStore);

// States
const showShippingModal = ref(false);
const showDisputeModal = ref(false);
const showImageModal = ref(false);
const showCancelModal = ref(false);
const selectedImage = ref("");
const isConfirming = ref(false);
const isShipping = ref(false);
const isDisputing = ref(false);
const hasReviewed = ref(false);

// Forms
const shippingForm = reactive({
  method: "",
  trackingNumber: "",
  trackingUrl: "",
});

const disputeForm = reactive({
  reason: "",
  description: "",
});

const shippingMethods = [
  "Kerry Express",
  "Flash Express",
  "Thailand Post",
  "J&T Express",
  "Lalamove",
];

const disputeReasons = [
  "สินค้าไม่ตรงตามรูป",
  "สินค้าเสียหาย",
  "ไม่ได้รับสินค้า",
  "สินค้าปลอม",
  "อื่นๆ",
];

// Computed
const isBuyer = computed(
  () => transaction.value?.buyer.userId === authStore.user?.id
);

const isSeller = computed(
  () => transaction.value?.seller.userId === authStore.user?.id
);

const canDispute = computed(() => {
  if (!transaction.value) return false;
  const disputeableStatuses = ["shipped", "delivered", "completed"];
  return (
    disputeableStatuses.includes(transaction.value.status) &&
    !transaction.value.dispute?.isDisputed &&
    isBuyer.value
  );
});

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

const getStatusColor = (status: string) => {
  const colors = {
    pending_payment: "yellow",
    payment_verification: "blue",
    awaiting_shipment: "orange",
    shipped: "purple",
    delivered: "cyan",
    completed: "green",
    disputed: "red",
    cancelled: "gray",
  };
  return colors[status] || "gray";
};

const getStatusText = (status: string) => {
  const texts = {
    pending_payment: "รอชำระเงิน",
    payment_verification: "รอตรวจสอบ",
    awaiting_shipment: "รอจัดส่ง",
    shipped: "จัดส่งแล้ว",
    delivered: "ส่งถึงแล้ว",
    completed: "สำเร็จ",
    disputed: "มีข้อพิพาท",
    cancelled: "ยกเลิก",
  };
  return texts[status] || status;
};

const getTimelineColor = (status: string) => {
  const colors = {
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
  const icons = {
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
  const texts = {
    refund_buyer: "คืนเงินให้ผู้ซื้อ",
    release_to_seller: "โอนเงินให้ผู้ขาย",
    partial_refund: "คืนเงินบางส่วน",
  };
  return texts[decision] || decision;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      title: "คัดลอกแล้ว",
      color: "green",
    });
  } catch (error) {
    toast.add({
      title: "ไม่สามารถคัดลอกได้",
      color: "red",
    });
  }
};

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  showImageModal.value = true;
};

const confirmDelivery = async () => {
  isConfirming.value = true;
  try {
    await transactionStore.confirmDelivery(
      route.params.id as string,
      "ยืนยันรับสินค้าแล้ว สภาพสมบูรณ์"
    );

    toast.add({
      title: "ยืนยันรับสินค้าสำเร็จ",
      description: "ระบบจะโอนเงินให้ผู้ขายภายใน 24 ชั่วโมง",
      color: "green",
    });
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถยืนยันได้",
      color: "red",
    });
  } finally {
    isConfirming.value = false;
  }
};

const submitShipping = async () => {
  if (!shippingForm.method || !shippingForm.trackingNumber) {
    toast.add({
      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      color: "red",
    });
    return;
  }

  isShipping.value = true;
  try {
    // TODO: Call API to update shipping info
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.add({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลการจัดส่งถูกบันทึกแล้ว",
      color: "green",
    });

    showShippingModal.value = false;

    // Refresh transaction
    await transactionStore.fetchTransaction(route.params.id as string);
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถบันทึกได้",
      color: "red",
    });
  } finally {
    isShipping.value = false;
  }
};

const submitDispute = async () => {
  if (!disputeForm.reason || !disputeForm.description) {
    toast.add({
      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      color: "red",
    });
    return;
  }

  isDisputing.value = true;
  try {
    await transactionStore.createDispute(route.params.id as string, {
      reason: disputeForm.reason,
      description: disputeForm.description,
      evidence: [],
    });

    toast.add({
      title: "ส่งเรื่องสำเร็จ",
      description: "Admin จะตรวจสอบและติดต่อกลับภายใน 48 ชั่วโมง",
      color: "green",
    });

    showDisputeModal.value = false;
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถส่งเรื่องได้",
      color: "red",
    });
  } finally {
    isDisputing.value = false;
  }
};

// Fetch transaction on mount
onMounted(async () => {
  await transactionStore.fetchTransaction(route.params.id as string);

  // Check if user has reviewed this transaction
  // TODO: Check from API
  hasReviewed.value = false;
});

// Cleanup on unmount
onUnmounted(() => {
  // Clear current transaction
  transactionStore.currentTransaction = null;
});
</script>
