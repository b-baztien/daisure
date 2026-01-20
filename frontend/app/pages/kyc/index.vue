<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          ยืนยันตัวตน (KYC)
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          กรุณาอัพโหลดรูปบัตรประชาชนและกรอกข้อมูลเพื่อยืนยันตัวตน
        </p>
      </div>

      <!-- KYC Status Card -->
      <UCard v-if="kycStatus" class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              สถานะ KYC
            </h3>
            <div class="mt-2">
              <UBadge
                :color="getStatusColor(kycStatus.status)"
                variant="soft"
                size="lg"
              >
                {{ getStatusText(kycStatus.status) }}
              </UBadge>
            </div>
            <p v-if="kycStatus.submittedAt" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ส่งเมื่อ: {{ formatDate(kycStatus.submittedAt) }}
            </p>
          </div>
          <UIcon
            :name="getStatusIcon(kycStatus.status)"
            :class="[
              'h-12 w-12',
              getStatusColor(kycStatus.status) === 'green' && 'text-green-500',
              getStatusColor(kycStatus.status) === 'yellow' && 'text-yellow-500',
              getStatusColor(kycStatus.status) === 'red' && 'text-red-500'
            ]"
          />
        </div>

        <!-- Rejected Reason -->
        <div v-if="kycStatus.status === 'rejected' && kycStatus.review" class="mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <h4 class="text-sm font-medium text-red-800 dark:text-red-300">
            เหตุผลที่ไม่ผ่าน
          </h4>
          <p class="mt-1 text-sm text-red-700 dark:text-red-400">
            {{ kycStatus.review.reason }}
          </p>
          <p v-if="kycStatus.review.notes" class="mt-1 text-sm text-red-600 dark:text-red-500">
            หมายเหตุ: {{ kycStatus.review.notes }}
          </p>
        </div>

        <!-- Approved Message -->
        <div v-if="kycStatus.status === 'approved'" class="mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p class="text-sm text-green-800 dark:text-green-300">
            ✓ ยืนยันตัวตนสำเร็จ คุณสามารถขายสินค้าได้โดยไม่มีขีดจำกัดราคา
          </p>
        </div>

        <!-- Pending Message -->
        <div v-if="kycStatus.status === 'pending'" class="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p class="text-sm text-yellow-800 dark:text-yellow-300">
            ⏳ กำลังรอการตรวจสอบจาก Admin โปรดรอสักครู่...
          </p>
        </div>
      </UCard>

      <!-- KYC Form -->
      <UCard v-if="!kycStatus || kycStatus.status === 'rejected'">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ kycStatus?.status === 'rejected' ? 'ส่ง KYC อีกครั้ง' : 'ส่งคำขอยืนยันตัวตน' }}
          </h3>
        </template>

        <form @submit.prevent="submitKyc" class="space-y-6">
          <!-- ID Card Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              รูปบัตรประชาชน <span class="text-red-500">*</span>
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              กรุณาถ่ายรูปบัตรประชาชนให้เห็นชัดเจน (สามารถอัพโหลดได้หลายรูป)
            </p>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div
                v-for="(image, idx) in formData.idCardImages"
                :key="idx"
                class="relative aspect-video border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
              >
                <img :src="image" alt="ID Card" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removeImage(idx)"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="onFileChange"
              class="hidden"
            />
            <UButton
              type="button"
              color="gray"
              variant="outline"
              icon="i-heroicons-photo"
              @click="$refs.fileInput.click()"
              :disabled="uploading"
            >
              {{ uploading ? 'กำลังอัพโหลด...' : 'เพิ่มรูปภาพ' }}
            </UButton>
          </div>

          <!-- ID Card Number -->
          <UFormField
            label="เลขบัตรประชาชน"
            required
          >
            <UInput
              v-model="formData.idCardInfo.idCardNumber"
              placeholder="1234567890123"
              maxlength="13"
              required
            />
          </UFormField>

          <!-- First Name -->
          <UFormField
            label="ชื่อจริง"
            required
          >
            <UInput
              v-model="formData.idCardInfo.firstName"
              placeholder="ชื่อ"
              required
            />
          </UFormField>

          <!-- Last Name -->
          <UFormField
            label="นามสกุล"
            required
          >
            <UInput
              v-model="formData.idCardInfo.lastName"
              placeholder="นามสกุล"
              required
            />
          </UFormField>

          <!-- Date of Birth -->
          <UFormField label="วันเกิด (ไม่บังคับ)">
            <UInput
              v-model="formData.idCardInfo.dateOfBirth"
              type="date"
            />
          </UFormField>

          <!-- Address -->
          <UFormField label="ที่อยู่ตามบัตรประชาชน (ไม่บังคับ)">
            <UTextarea
              v-model="formData.idCardInfo.address"
              placeholder="ที่อยู่..."
              rows="3"
            />
          </UFormField>

          <!-- Warning -->
          <UAlert
            color="amber"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            title="ข้อควรระวัง"
            description="กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนส่ง ข้อมูลที่ไม่ตรงกับบัตรประชาชนอาจถูกปฏิเสธ"
          />

          <!-- Submit Button -->
          <div class="flex justify-end gap-3">
            <UButton
              type="button"
              color="gray"
              variant="soft"
              @click="navigateTo('/profile')"
            >
              ยกเลิก
            </UButton>
            <UButton
              type="submit"
              color="blue"
              :loading="submitting"
              :disabled="!isFormValid"
            >
              ส่งคำขอยืนยันตัวตน
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const toast = useToast()

interface KycStatus {
  _id: string
  status: 'pending' | 'approved' | 'rejected'
  idCardImages: string[]
  idCardInfo: {
    idCardNumber: string
    firstName: string
    lastName: string
    dateOfBirth?: string
    address?: string
  }
  review?: {
    reason?: string
    notes?: string
  }
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
}

const kycStatus = ref<KycStatus | null>(null)
const uploading = ref(false)
const submitting = ref(false)

const formData = ref({
  idCardImages: [] as string[],
  idCardInfo: {
    idCardNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: ''
  }
})

const isFormValid = computed(() => {
  return (
    formData.value.idCardImages.length > 0 &&
    formData.value.idCardInfo.idCardNumber.length === 13 &&
    formData.value.idCardInfo.firstName.trim() !== '' &&
    formData.value.idCardInfo.lastName.trim() !== ''
  )
})

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'รอตรวจสอบ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ไม่ผ่าน'
  }
  return texts[status as keyof typeof texts] || status
}

const getStatusIcon = (status: string) => {
  const icons = {
    pending: 'i-heroicons-clock',
    approved: 'i-heroicons-check-circle',
    rejected: 'i-heroicons-x-circle'
  }
  return icons[status as keyof typeof icons] || 'i-heroicons-question-mark-circle'
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

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  uploading.value = true

  try {
    for (const file of Array.from(files)) {
      // Convert to base64 (in production, you should upload to a real storage service)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          formData.value.idCardImages.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }

    toast.add({
      title: 'สำเร็จ',
      description: 'อัพโหลดรูปภาพสำเร็จ',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'ไม่สามารถอัพโหลดรูปภาพได้',
      color: 'red'
    })
  } finally {
    uploading.value = false
    target.value = ''
  }
}

const removeImage = (index: number) => {
  formData.value.idCardImages.splice(index, 1)
}

const fetchKycStatus = async () => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await $fetch<KycStatus>(`${config.public.apiBase}/kyc/my-status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    kycStatus.value = response
  } catch (error: any) {
    if (error.status !== 404) {
      console.error('Failed to fetch KYC status:', error)
    }
  }
}

const submitKyc = async () => {
  if (!isFormValid.value) return

  submitting.value = true

  try {
    const token = localStorage.getItem('access_token')
    await $fetch(`${config.public.apiBase}/kyc/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: formData.value
    })

    toast.add({
      title: 'สำเร็จ',
      description: 'ส่งคำขอยืนยันตัวตนเรียบร้อยแล้ว',
      color: 'green'
    })

    // Refresh status
    await fetchKycStatus()

    // Reset form
    formData.value = {
      idCardImages: [],
      idCardInfo: {
        idCardNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: ''
      }
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'ไม่สามารถส่งคำขอได้',
      color: 'red'
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchKycStatus()
})
</script>
