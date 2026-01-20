<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        KYC Verifications
      </h1>
      <UButton
        icon="i-heroicons-arrow-path"
        color="gray"
        variant="ghost"
        @click="fetchVerifications"
        :loading="loading"
      >
        Refresh
      </UButton>
    </div>

    <!-- Filter Tabs -->
    <UCard>
      <UTabs v-model="selectedStatus" :items="statusTabs" @change="onStatusChange" />
    </UCard>

    <!-- Verifications List -->
    <UCard v-if="!loading && verifications.length > 0">
      <div class="space-y-4">
        <div
          v-for="verification in verifications"
          :key="verification._id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ verification.userId.profile.displayName }}
                </h3>
                <UBadge
                  :color="getStatusColor(verification.status)"
                  variant="soft"
                >
                  {{ getStatusText(verification.status) }}
                </UBadge>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                อีเมล: {{ verification.userId.auth.email || verification.userId.profile.email }}
              </p>

              <!-- ID Card Info -->
              <div class="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  ข้อมูลบัตรประชาชน
                </h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">เลขบัตร:</span>
                    <span class="ml-2 font-medium">{{ verification.idCardInfo.idCardNumber }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">ชื่อ-สกุล:</span>
                    <span class="ml-2 font-medium">
                      {{ verification.idCardInfo.firstName }} {{ verification.idCardInfo.lastName }}
                    </span>
                  </div>
                  <div v-if="verification.idCardInfo.dateOfBirth">
                    <span class="text-gray-600 dark:text-gray-400">วันเกิด:</span>
                    <span class="ml-2 font-medium">{{ verification.idCardInfo.dateOfBirth }}</span>
                  </div>
                  <div v-if="verification.idCardInfo.address" class="col-span-2">
                    <span class="text-gray-600 dark:text-gray-400">ที่อยู่:</span>
                    <span class="ml-2 font-medium">{{ verification.idCardInfo.address }}</span>
                  </div>
                </div>
              </div>

              <!-- Bank Account Info -->
              <div v-if="verification.userId.bankAccounts && verification.userId.bankAccounts.length > 0" class="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  บัญชีธนาคาร
                </h4>
                <div v-for="(account, idx) in verification.userId.bankAccounts" :key="idx" class="text-sm">
                  <span class="text-gray-600 dark:text-gray-400">ชื่อบัญชี:</span>
                  <span class="ml-2 font-medium">{{ account.accountName }}</span>
                  <span class="ml-4 text-gray-600 dark:text-gray-400">เลขที่:</span>
                  <span class="ml-2 font-medium">{{ account.accountNumber }}</span>
                  <UBadge v-if="account.isDefault" color="green" variant="soft" class="ml-2" size="xs">
                    บัญชีหลัก
                  </UBadge>
                </div>
              </div>

              <!-- ID Card Images -->
              <div class="mt-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  รูปบัตรประชาชน
                </h4>
                <div class="flex gap-2">
                  <img
                    v-for="(image, idx) in verification.idCardImages"
                    :key="idx"
                    :src="image"
                    alt="ID Card"
                    class="w-32 h-20 object-cover rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80"
                    @click="openImageModal(image)"
                  />
                </div>
              </div>

              <!-- Review Info (if rejected) -->
              <div v-if="verification.review && verification.status === 'rejected'" class="mt-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 class="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                  เหตุผลที่ปฏิเสธ
                </h4>
                <p class="text-sm text-red-700 dark:text-red-400">{{ verification.review.reason }}</p>
                <p v-if="verification.review.notes" class="text-sm text-red-600 dark:text-red-500 mt-1">
                  หมายเหตุ: {{ verification.review.notes }}
                </p>
              </div>

              <div class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                ส่งเมื่อ: {{ formatDate(verification.submittedAt) }}
              </div>
            </div>

            <!-- Actions (only for pending) -->
            <div v-if="verification.status === 'pending'" class="flex gap-2 ml-4">
              <UButton
                color="green"
                @click="showApproveModal(verification)"
                :loading="actionLoading === verification._id"
              >
                อนุมัติ
              </UButton>
              <UButton
                color="red"
                variant="soft"
                @click="showRejectModal(verification)"
                :loading="actionLoading === verification._id"
              >
                ปฏิเสธ
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-if="!loading && verifications.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-document-check" class="h-12 w-12 mx-auto text-gray-400" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">
        ไม่มีคำขอ KYC {{ getStatusText(selectedStatus) }}
      </p>
    </UCard>

    <!-- Loading State -->
    <UCard v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto text-blue-500" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
    </UCard>
  </div>

  <!-- Approve Modal -->
  <UModal v-model="approveModal.isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">อนุมัติ KYC</h3>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          คุณต้องการอนุมัติ KYC ของ <span class="font-semibold">{{ approveModal.verification?.userId.profile.displayName }}</span> ใช่หรือไม่?
        </p>

        <UFormField label="หมายเหตุ (ไม่บังคับ)">
          <UTextarea v-model="approveModal.notes" placeholder="เพิ่มหมายเหตุ..." />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="soft" @click="approveModal.isOpen = false">
            ยกเลิก
          </UButton>
          <UButton color="green" @click="approveKyc" :loading="approveModal.loading">
            อนุมัติ
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- Reject Modal -->
  <UModal v-model="rejectModal.isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">ปฏิเสธ KYC</h3>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          คุณต้องการปฏิเสธ KYC ของ <span class="font-semibold">{{ rejectModal.verification?.userId.profile.displayName }}</span> ใช่หรือไม่?
        </p>

        <UFormField label="เหตุผล" required>
          <UTextarea v-model="rejectModal.reason" placeholder="ระบุเหตุผลที่ปฏิเสธ..." required />
        </UFormField>

        <UFormField label="หมายเหตุเพิ่มเติม (ไม่บังคับ)">
          <UTextarea v-model="rejectModal.notes" placeholder="เพิ่มหมายเหตุ..." />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="soft" @click="rejectModal.isOpen = false">
            ยกเลิก
          </UButton>
          <UButton
            color="red"
            @click="rejectKyc"
            :loading="rejectModal.loading"
            :disabled="!rejectModal.reason"
          >
            ปฏิเสธ
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- Image Modal -->
  <UModal v-model="imageModal.isOpen" :ui="{ width: 'max-w-4xl' }">
    <UCard>
      <img :src="imageModal.url" alt="ID Card" class="w-full h-auto" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { KycVerification } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const toast = useToast()

const selectedStatus = ref(0)
const verifications = ref<KycVerification[]>([])
const loading = ref(false)
const actionLoading = ref<string | null>(null)

const statusTabs = [
  { label: 'รอตรวจสอบ', value: 'pending' },
  { label: 'อนุมัติแล้ว', value: 'approved' },
  { label: 'ปฏิเสธ', value: 'rejected' },
  { label: 'ทั้งหมด', value: 'all' }
]

const approveModal = ref({
  isOpen: false,
  verification: null as KycVerification | null,
  notes: '',
  loading: false
})

const rejectModal = ref({
  isOpen: false,
  verification: null as KycVerification | null,
  reason: '',
  notes: '',
  loading: false
})

const imageModal = ref({
  isOpen: false,
  url: ''
})

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getStatusText = (status: string | number) => {
  if (typeof status === 'number') {
    return statusTabs[status].label
  }
  const texts = {
    pending: 'รอตรวจสอบ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธ'
  }
  return texts[status as keyof typeof texts] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchVerifications = async () => {
  loading.value = true
  try {
    const currentTab = statusTabs[selectedStatus.value]
    const status = currentTab.value === 'all' ? undefined : currentTab.value
    const response = await api.getKycVerifications(status)
    verifications.value = response.data
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to load verifications',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const onStatusChange = () => {
  fetchVerifications()
}

const showApproveModal = (verification: KycVerification) => {
  approveModal.value.verification = verification
  approveModal.value.notes = ''
  approveModal.value.isOpen = true
}

const showRejectModal = (verification: KycVerification) => {
  rejectModal.value.verification = verification
  rejectModal.value.reason = ''
  rejectModal.value.notes = ''
  rejectModal.value.isOpen = true
}

const approveKyc = async () => {
  if (!approveModal.value.verification) return

  approveModal.value.loading = true
  try {
    await api.approveKyc(approveModal.value.verification._id, {
      notes: approveModal.value.notes || undefined
    })

    toast.add({
      title: 'สำเร็จ',
      description: 'อนุมัติ KYC เรียบร้อยแล้ว',
      color: 'green'
    })

    approveModal.value.isOpen = false
    await fetchVerifications()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to approve KYC',
      color: 'red'
    })
  } finally {
    approveModal.value.loading = false
  }
}

const rejectKyc = async () => {
  if (!rejectModal.value.verification || !rejectModal.value.reason) return

  rejectModal.value.loading = true
  try {
    await api.rejectKyc(rejectModal.value.verification._id, {
      reason: rejectModal.value.reason,
      notes: rejectModal.value.notes || undefined
    })

    toast.add({
      title: 'สำเร็จ',
      description: 'ปฏิเสธ KYC เรียบร้อยแล้ว',
      color: 'green'
    })

    rejectModal.value.isOpen = false
    await fetchVerifications()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to reject KYC',
      color: 'red'
    })
  } finally {
    rejectModal.value.loading = false
  }
}

const openImageModal = (url: string) => {
  imageModal.value.url = url
  imageModal.value.isOpen = true
}

onMounted(() => {
  fetchVerifications()
})
</script>
