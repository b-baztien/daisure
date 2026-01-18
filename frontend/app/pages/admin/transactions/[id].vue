<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

const route = useRoute()
const { apiFetch } = useApi()
const toast = useToast()
const modal = useModal()

const transactionId = route.params.id as string
const transaction = ref<any>(null)
const isLoading = ref(true)
const isActionLoading = ref(false)

// Fetch transaction details
async function fetchTransaction() {
  isLoading.value = true
  try {
    const data = await apiFetch<any>(`/transactions/${transactionId}`)
    transaction.value = data
  } catch (error) {
    console.error('Failed to fetch transaction:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถโหลดข้อมูลธุรกรรมได้',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

// Verify payment
async function verifyPayment(approved: boolean) {
  if (!confirm(approved ? 'ยืนยันการอนุมัติการชำระเงิน?' : 'ยืนยันการปฏิเสธการชำระเงิน?')) {
    return
  }

  isActionLoading.value = true
  try {
    await apiFetch(`/admin/transactions/${transactionId}/verify-payment`, {
      method: 'POST',
      body: { approved }
    })

    toast.add({
      title: 'สำเร็จ',
      description: approved ? 'อนุมัติการชำระเงินแล้ว' : 'ปฏิเสธการชำระเงินแล้ว',
      color: 'green'
    })

    // Refresh transaction
    await fetchTransaction()
  } catch (error: any) {
    console.error('Failed to verify payment:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: error.data?.message || 'ไม่สามารถดำเนินการได้',
      color: 'red'
    })
  } finally {
    isActionLoading.value = false
  }
}

// Resolve dispute
const disputeResolution = ref({
  resolution: '',
  refundToBuyer: 0,
  payoutToSeller: 0,
  notes: ''
})

async function resolveDispute() {
  if (!disputeResolution.value.resolution) {
    toast.add({
      title: 'กรุณากรอกข้อมูล',
      description: 'กรุณาเลือกการแก้ไขข้อพิพาท',
      color: 'red'
    })
    return
  }

  if (!confirm('ยืนยันการแก้ไขข้อพิพาท?')) {
    return
  }

  isActionLoading.value = true
  try {
    await apiFetch(`/admin/transactions/${transactionId}/resolve-dispute`, {
      method: 'POST',
      body: disputeResolution.value
    })

    toast.add({
      title: 'สำเร็จ',
      description: 'แก้ไขข้อพิพาทเรียบร้อยแล้ว',
      color: 'green'
    })

    // Reset form
    disputeResolution.value = {
      resolution: '',
      refundToBuyer: 0,
      payoutToSeller: 0,
      notes: ''
    }

    // Refresh transaction
    await fetchTransaction()
  } catch (error: any) {
    console.error('Failed to resolve dispute:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: error.data?.message || 'ไม่สามารถแก้ไขข้อพิพาทได้',
      color: 'red'
    })
  } finally {
    isActionLoading.value = false
  }
}

// Format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

// Format date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Status badge color
function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending_payment: 'yellow',
    payment_verification: 'blue',
    paid: 'green',
    shipped: 'indigo',
    delivered: 'purple',
    completed: 'green',
    cancelled: 'red',
    disputed: 'orange'
  }
  return colorMap[status] || 'gray'
}

// Status label
function getStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    pending_payment: 'รอชำระเงิน',
    payment_verification: 'ตรวจสอบการชำระเงิน',
    paid: 'ชำระเงินแล้ว',
    shipped: 'จัดส่งแล้ว',
    delivered: 'ได้รับสินค้า',
    completed: 'เสร็จสมบูรณ์',
    cancelled: 'ยกเลิก',
    disputed: 'มีข้อพิพาท'
  }
  return labelMap[status] || status
}

onMounted(() => {
  fetchTransaction()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <UButton
        to="/admin/transactions"
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        กลับ
      </UButton>

      <div v-if="transaction" class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ transaction.transactionNumber }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            จัดการธุรกรรมในฐานะผู้ดูแลระบบ
          </p>
        </div>
        <UBadge :color="getStatusColor(transaction.status)" size="lg">
          {{ getStatusLabel(transaction.status) }}
        </UBadge>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-600 animate-spin" />
    </div>

    <!-- Transaction Details -->
    <div v-else-if="transaction" class="space-y-6">
      <!-- Admin Actions -->
      <UCard v-if="transaction.status === 'payment_verification'" class="bg-blue-50 dark:bg-blue-950 border-2 border-blue-600">
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            การดำเนินการของผู้ดูแล - ตรวจสอบการชำระเงิน
          </h2>
        </template>

        <div class="space-y-4">
          <p class="text-gray-700 dark:text-gray-300">
            กรุณาตรวจสอบหลักฐานการชำระเงินและอนุมัติหรือปฏิเสธ
          </p>

          <!-- Payment Slip -->
          <div v-if="transaction.payment?.slip?.url">
            <p class="font-semibold mb-2">หลักฐานการชำระเงิน:</p>
            <img
              :src="transaction.payment.slip.url"
              alt="Payment slip"
              class="max-w-md rounded-lg border border-gray-300"
            />
          </div>

          <div class="flex space-x-4">
            <UButton
              color="green"
              size="lg"
              :loading="isActionLoading"
              @click="verifyPayment(true)"
            >
              <Icon name="i-heroicons-check-circle" class="w-5 h-5 mr-2" />
              อนุมัติการชำระเงิน
            </UButton>
            <UButton
              color="red"
              variant="outline"
              size="lg"
              :loading="isActionLoading"
              @click="verifyPayment(false)"
            >
              <Icon name="i-heroicons-x-circle" class="w-5 h-5 mr-2" />
              ปฏิเสธการชำระเงิน
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Dispute Resolution -->
      <UCard v-if="transaction.status === 'disputed'" class="bg-orange-50 dark:bg-orange-950 border-2 border-orange-600">
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            การดำเนินการของผู้ดูแล - แก้ไขข้อพิพาท
          </h2>
        </template>

        <div class="space-y-4">
          <!-- Dispute Info -->
          <div v-if="transaction.dispute" class="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 class="font-semibold mb-2">รายละเอียดข้อพิพาท:</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-2">
              <strong>เหตุผล:</strong> {{ transaction.dispute.reason }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <strong>รายละเอียด:</strong> {{ transaction.dispute.description }}
            </p>
          </div>

          <!-- Resolution Form -->
          <div class="space-y-4">
            <UFormField label="การแก้ไข" required>
              <USelectMenu
                v-model="disputeResolution.resolution"
                :options="[
                  { label: 'คืนเงินให้ผู้ซื้อทั้งหมด', value: 'refund_buyer' },
                  { label: 'จ่ายเงินให้ผู้ขายทั้งหมด', value: 'payout_seller' },
                  { label: 'แบ่งเงินตามสัดส่วน', value: 'partial' }
                ]"
                placeholder="เลือกการแก้ไข"
                value-attribute="value"
              />
            </UFormField>

            <div v-if="disputeResolution.resolution === 'partial'" class="grid grid-cols-2 gap-4">
              <UFormField label="คืนเงินให้ผู้ซื้อ">
                <UInput
                  v-model.number="disputeResolution.refundToBuyer"
                  type="number"
                  placeholder="0"
                />
              </UFormField>
              <UFormField label="จ่ายเงินให้ผู้ขาย">
                <UInput
                  v-model.number="disputeResolution.payoutToSeller"
                  type="number"
                  placeholder="0"
                />
              </UFormField>
            </div>

            <UFormField label="หมายเหตุ">
              <UTextarea
                v-model="disputeResolution.notes"
                :rows="3"
                placeholder="บันทึกการตัดสินใจ..."
              />
            </UFormField>

            <UButton
              color="orange"
              size="lg"
              :loading="isActionLoading"
              @click="resolveDispute"
            >
              <Icon name="i-heroicons-check-circle" class="w-5 h-5 mr-2" />
              ยืนยันการแก้ไขข้อพิพาท
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Transaction Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Product Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              ข้อมูลสินค้า
            </h2>
          </template>

          <div class="space-y-4">
            <div v-if="transaction.product?.images?.length">
              <img
                :src="transaction.product.images[0]"
                :alt="transaction.product.name"
                class="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ transaction.product?.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                {{ transaction.product?.description }}
              </p>
            </div>
            <div class="pt-4 border-t">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-400">ราคาสินค้า:</span>
                <span class="font-semibold">{{ formatCurrency(transaction.product?.price || 0) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-400">ค่าธรรมเนียม:</span>
                <span class="font-semibold">{{ formatCurrency(transaction.payment?.escrowFee || 0) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2 border-t">
                <span>รวมทั้งหมด:</span>
                <span>{{ formatCurrency(transaction.payment?.totalAmount || 0) }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Participants -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              ผู้เกี่ยวข้อง
            </h2>
          </template>

          <div class="space-y-6">
            <!-- Buyer -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center">
                <Icon name="i-heroicons-user" class="w-5 h-5 mr-2" />
                ผู้ซื้อ
              </h3>
              <div class="pl-7">
                <p class="font-medium">{{ transaction.buyer?.profile?.displayName }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ transaction.buyer?.profile?.email || transaction.buyer?.auth?.email }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ transaction.buyer?.profile?.phone }}
                </p>
              </div>
            </div>

            <!-- Seller -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center">
                <Icon name="i-heroicons-user" class="w-5 h-5 mr-2" />
                ผู้ขาย
              </h3>
              <div class="pl-7">
                <p class="font-medium">{{ transaction.seller?.profile?.displayName }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ transaction.seller?.profile?.email || transaction.seller?.auth?.email }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ transaction.seller?.profile?.phone }}
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Timeline -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            ไทม์ไลน์
          </h2>
        </template>

        <div class="space-y-4">
          <div
            v-for="(event, index) in transaction.timeline"
            :key="index"
            class="flex items-start space-x-4"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Icon name="i-heroicons-clock" class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="font-semibold">{{ event.status }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(event.timestamp) }}
              </p>
              <p v-if="event.note" class="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {{ event.note }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
