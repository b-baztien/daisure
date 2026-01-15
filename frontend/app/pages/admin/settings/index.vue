<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

const { apiFetch } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isSaving = ref(false)

// Settings data
const escrowFeeSettings = ref({
  percentage: 0,
  minimumFee: 0,
  maximumFee: 0
})

const autoCompleteSettings = ref({
  enabled: false,
  daysAfterDelivery: 0
})

// Fetch settings
async function fetchSettings() {
  isLoading.value = true
  try {
    const [escrowFee, autoComplete] = await Promise.all([
      apiFetch<any>('/settings/escrow-fee'),
      apiFetch<any>('/settings/auto-complete')
    ])

    escrowFeeSettings.value = {
      percentage: escrowFee.percentage || 0,
      minimumFee: escrowFee.minimumFee || 0,
      maximumFee: escrowFee.maximumFee || 0
    }

    autoCompleteSettings.value = {
      enabled: autoComplete.enabled || false,
      daysAfterDelivery: autoComplete.daysAfterDelivery || 0
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถโหลดการตั้งค่าได้',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

// Save escrow fee settings
async function saveEscrowFee() {
  isSaving.value = true
  try {
    await apiFetch('/settings/escrow-fee', {
      method: 'PATCH',
      body: escrowFeeSettings.value
    })

    toast.add({
      title: 'บันทึกสำเร็จ',
      description: 'อัพเดทค่าธรรมเนียมเรียบร้อยแล้ว',
      color: 'green'
    })
  } catch (error: any) {
    console.error('Failed to save escrow fee:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: error.data?.message || 'ไม่สามารถบันทึกการตั้งค่าได้',
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}

// Calculate example fee
const exampleFee = computed(() => {
  const amount = 10000 // Example amount
  const fee = (amount * escrowFeeSettings.value.percentage) / 100

  let finalFee = fee
  if (escrowFeeSettings.value.minimumFee && fee < escrowFeeSettings.value.minimumFee) {
    finalFee = escrowFeeSettings.value.minimumFee
  }
  if (escrowFeeSettings.value.maximumFee && fee > escrowFeeSettings.value.maximumFee) {
    finalFee = escrowFeeSettings.value.maximumFee
  }

  return {
    amount,
    calculatedFee: fee,
    finalFee,
    total: amount + finalFee
  }
})

// Format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

onMounted(() => {
  fetchSettings()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        ตั้งค่าระบบ
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        จัดการการตั้งค่าต่างๆ ของระบบ
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-600 animate-spin" />
    </div>

    <!-- Settings -->
    <div v-else class="space-y-6">
      <!-- Escrow Fee Settings -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              ค่าธรรมเนียม Escrow
            </h2>
          </div>
        </template>

        <form @submit.prevent="saveEscrowFee" class="space-y-6">
          <!-- Percentage -->
          <UFormGroup label="เปอร์เซ็นต์ค่าธรรมเนียม (%)" required>
            <UInput
              v-model.number="escrowFeeSettings.percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="2.5"
              size="lg"
            />
            <template #help>
              <span class="text-xs text-gray-500">
                เปอร์เซ็นต์ที่คิดจากมูลค่าธุรกรรม
              </span>
            </template>
          </UFormGroup>

          <!-- Minimum Fee -->
          <UFormGroup label="ค่าธรรมเนียมขั้นต่ำ (บาท)">
            <UInput
              v-model.number="escrowFeeSettings.minimumFee"
              type="number"
              min="0"
              placeholder="10"
              size="lg"
            />
            <template #help>
              <span class="text-xs text-gray-500">
                ค่าธรรมเนียมขั้นต่ำที่เรียกเก็บ (ไม่บังคับ)
              </span>
            </template>
          </UFormGroup>

          <!-- Maximum Fee -->
          <UFormGroup label="ค่าธรรมเนียมสูงสุด (บาท)">
            <UInput
              v-model.number="escrowFeeSettings.maximumFee"
              type="number"
              min="0"
              placeholder="1000"
              size="lg"
            />
            <template #help>
              <span class="text-xs text-gray-500">
                ค่าธรรมเนียมสูงสุดที่เรียกเก็บ (ไม่บังคับ)
              </span>
            </template>
          </UFormGroup>

          <!-- Example Calculation -->
          <div class="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 class="font-semibold mb-2">ตัวอย่างการคำนวณ</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">มูลค่าธุรกรรม:</span>
                <span class="font-semibold">{{ formatCurrency(exampleFee.amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  ค่าธรรมเนียม ({{ escrowFeeSettings.percentage }}%):
                </span>
                <span class="font-semibold">{{ formatCurrency(exampleFee.calculatedFee) }}</span>
              </div>
              <div v-if="exampleFee.finalFee !== exampleFee.calculatedFee" class="flex justify-between text-blue-600">
                <span>ค่าธรรมเนียมจริง (หลังปรับ):</span>
                <span class="font-semibold">{{ formatCurrency(exampleFee.finalFee) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                <span class="font-semibold">ยอดรวมที่ผู้ซื้อจ่าย:</span>
                <span class="font-bold text-lg">{{ formatCurrency(exampleFee.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <UButton
            type="submit"
            size="lg"
            :loading="isSaving"
            :disabled="isSaving"
          >
            <Icon name="i-heroicons-check-circle" class="w-5 h-5 mr-2" />
            บันทึกการตั้งค่า
          </UButton>
        </form>
      </UCard>

      <!-- Auto Complete Settings -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            การปิดธุรกรรมอัตโนมัติ
          </h2>
        </template>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold">เปิดใช้งานการปิดอัตโนมัติ</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ปิดธุรกรรมโดยอัตโนมัติหลังจากผู้ซื้อได้รับสินค้าแล้วกี่วัน
              </p>
            </div>
            <UToggle v-model="autoCompleteSettings.enabled" />
          </div>

          <UFormGroup
            v-if="autoCompleteSettings.enabled"
            label="จำนวนวันหลังจากได้รับสินค้า"
            required
          >
            <UInput
              v-model.number="autoCompleteSettings.daysAfterDelivery"
              type="number"
              min="1"
              max="30"
              placeholder="7"
              size="lg"
            />
            <template #help>
              <span class="text-xs text-gray-500">
                จำนวนวันที่รอหลังจากผู้ซื้อยืนยันว่าได้รับสินค้า
              </span>
            </template>
          </UFormGroup>

          <div class="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <div class="flex items-start space-x-3">
              <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 mt-0.5" />
              <div class="text-sm">
                <p class="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  คำเตือน
                </p>
                <p class="text-yellow-800 dark:text-yellow-200">
                  การเปิดใช้งานฟีเจอร์นี้จะทำให้ระบบปิดธุรกรรมและโอนเงินให้ผู้ขายโดยอัตโนมัติ
                  แม้ว่าผู้ซื้อจะยังไม่ได้กดปุ่มยืนยันการรับสินค้า
                </p>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>หมายเหตุ:</strong> การตั้งค่านี้จะมีผลกับธุรกรรมใหม่เท่านั้น
            ธุรกรรมที่มีอยู่แล้วจะใช้การตั้งค่าเดิม
          </p>
        </div>
      </UCard>

      <!-- Platform Rules -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            กฎระเบียบแพลตฟอร์ม
          </h2>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            จัดการกฎระเบียบและข้อกำหนดการใช้งานแพลตฟอร์ม
          </p>

          <div class="space-y-2">
            <UButton
              to="/admin/settings/terms"
              color="gray"
              variant="outline"
              block
              trailing-icon="i-heroicons-arrow-right"
            >
              แก้ไขข้อกำหนดการใช้งาน
            </UButton>
            <UButton
              to="/admin/settings/privacy"
              color="gray"
              variant="outline"
              block
              trailing-icon="i-heroicons-arrow-right"
            >
              แก้ไขนโยบายความเป็นส่วนตัว
            </UButton>
            <UButton
              to="/admin/settings/faq"
              color="gray"
              variant="outline"
              block
              trailing-icon="i-heroicons-arrow-right"
            >
              จัดการคำถามที่พบบ่อย
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
