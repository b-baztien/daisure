<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
    </div>

    <!-- Escrow Fee Settings -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Escrow Fee Configuration
          </h3>
          <UButton
            icon="i-heroicons-arrow-path"
            color="gray"
            variant="ghost"
            @click="fetchSettings"
            :loading="loading"
          />
        </div>
      </template>

      <div class="space-y-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div class="flex items-start">
            <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300">
                About Escrow Fee
              </h4>
              <p class="mt-1 text-sm text-blue-700 dark:text-blue-400">
                The escrow fee is charged as a percentage of the transaction amount. This fee is added to the buyer's payment and covers the platform's escrow services.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Current Escrow Fee
            </h4>
            <div class="flex items-baseline">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ currentSettings?.escrowFeePercentage || 0 }}%
              </span>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Applied to all new transactions
            </p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Example Calculation
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Transaction Amount:</span>
                <span class="font-medium">฿10,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Escrow Fee ({{ currentSettings?.escrowFeePercentage || 0 }}%):</span>
                <span class="font-medium">฿{{ calculateExampleFee() }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span class="text-gray-900 dark:text-white font-medium">Total Amount:</span>
                <span class="font-bold">฿{{ calculateExampleTotal() }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Update Escrow Fee
          </h4>

          <form @submit.prevent="updateSettings" class="space-y-4">
            <UFormField
              label="New Escrow Fee Percentage"
              hint="Enter a value between 0 and 100"
              required
            >
              <UInput
                v-model.number="newFeePercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter percentage (e.g., 2.5)"
              >
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400">%</span>
                </template>
              </UInput>
            </UFormField>

            <div class="flex items-center justify-between pt-4">
              <UAlert
                v-if="newFeePercentage !== currentSettings?.escrowFeePercentage"
                color="amber"
                variant="soft"
                :title="`Fee will change from ${currentSettings?.escrowFeePercentage}% to ${newFeePercentage}%`"
                class="flex-1 mr-4"
              />

              <UButton
                type="submit"
                :loading="saving"
                :disabled="!isFormValid"
                color="blue"
              >
                Update Fee
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </UCard>

    <!-- KYC Settings -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            KYC Configuration
          </h3>
        </div>
      </template>

      <div class="space-y-6">
        <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <div class="flex items-start">
            <UIcon name="i-heroicons-shield-check" class="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div class="ml-3">
              <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300">
                เกี่ยวกับ KYC (Know Your Customer)
              </h4>
              <p class="mt-1 text-sm text-amber-700 dark:text-amber-400">
                ผู้ขายจะต้องทำการยืนยันตัวตน (KYC) ก่อนขายสินค้าที่มีราคาเท่ากับหรือสูงกว่าที่กำหนด เพื่อป้องกันการฉ้อโกงและเพิ่มความน่าเชื่อถือ
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              ราคาขั้นต่ำที่ต้อง KYC
            </h4>
            <div class="flex items-baseline">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(kycSettings?.minimumPrice || 0) }}
              </span>
              <span class="ml-2 text-gray-500 dark:text-gray-400">บาท</span>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              สินค้าที่ราคาเท่านี้ขึ้นไปต้องทำ KYC
            </p>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              สถานะ KYC
            </h4>
            <div class="flex items-center gap-2">
              <UBadge
                :color="kycSettings?.isEnabled ? 'green' : 'gray'"
                variant="soft"
                size="lg"
              >
                {{ kycSettings?.isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
              </UBadge>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              สถานะการบังคับใช้ KYC ในระบบ
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
            อัพเดทการตั้งค่า KYC
          </h4>

          <form @submit.prevent="updateKycSettings" class="space-y-4">
            <UFormField
              label="ราคาขั้นต่ำที่ต้อง KYC (บาท)"
              hint="สินค้าที่ราคาเท่ากับหรือสูงกว่านี้ต้องทำ KYC"
              required
            >
              <UInput
                v-model.number="newKycSettings.minimumPrice"
                type="number"
                min="0"
                placeholder="เช่น 50000"
              >
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400">บาท</span>
                </template>
              </UInput>
            </UFormField>

            <UFormField label="สถานะ">
              <UToggle
                v-model="newKycSettings.isEnabled"
                :ui="{ active: 'bg-green-500' }"
              />
              <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {{ newKycSettings.isEnabled ? 'เปิดใช้งาน KYC' : 'ปิดใช้งาน KYC' }}
              </span>
            </UFormField>

            <div class="flex items-center justify-end pt-4">
              <UButton
                type="submit"
                :loading="savingKyc"
                color="blue"
              >
                บันทึกการตั้งค่า
              </UButton>
            </div>
          </form>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <NuxtLink to="/kyc-verifications">
            <UButton color="gray" variant="soft" icon="i-heroicons-document-check">
              จัดการคำขอ KYC
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </UCard>

    <!-- System Information -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          System Information
        </h3>
      </template>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Admin Panel Version</p>
          <p class="mt-1 font-medium">1.0.0</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">API Base URL</p>
          <p class="mt-1 font-mono text-sm">{{ apiBaseUrl }}</p>
        </div>
      </div>
    </UCard>

    <!-- Loading State -->
    <UCard v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto text-blue-500" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">Loading settings...</p>
    </UCard>

    <!-- Error Alert -->
    <UAlert
      v-if="error"
      color="red"
      variant="soft"
      :title="error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
      @close="error = ''"
    />
  </div>
</template>

<script setup lang="ts">
import type { Settings, KycSetting } from '~/types/api'

const api = useApi()
const config = useRuntimeConfig()
const toast = useToast()

const currentSettings = ref<Settings | null>(null)
const newFeePercentage = ref<number>(0)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

// KYC Settings
const kycSettings = ref<KycSetting | null>(null)
const newKycSettings = ref({
  minimumPrice: 0,
  isEnabled: true
})
const savingKyc = ref(false)

const apiBaseUrl = computed(() => config.public.apiBase)

const isFormValid = computed(() => {
  return newFeePercentage.value >= 0 &&
         newFeePercentage.value <= 100 &&
         newFeePercentage.value !== currentSettings.value?.escrowFeePercentage
})

const calculateExampleFee = () => {
  const amount = 10000
  const fee = (amount * (currentSettings.value?.escrowFeePercentage || 0)) / 100
  return new Intl.NumberFormat('th-TH').format(fee)
}

const calculateExampleTotal = () => {
  const amount = 10000
  const fee = (amount * (currentSettings.value?.escrowFeePercentage || 0)) / 100
  return new Intl.NumberFormat('th-TH').format(amount + fee)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('th-TH').format(value)
}

const fetchSettings = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.getSettings()
    currentSettings.value = response.data
    newFeePercentage.value = response.data.escrowFeePercentage
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load settings'
    console.error('Failed to fetch settings:', err)
  } finally {
    loading.value = false
  }
}

const fetchKycSettings = async () => {
  try {
    const response = await api.getKycSettings()
    kycSettings.value = response.data
    newKycSettings.value = {
      minimumPrice: response.data.minimumPrice,
      isEnabled: response.data.isEnabled
    }
  } catch (err: any) {
    console.error('Failed to fetch KYC settings:', err)
  }
}

const updateSettings = async () => {
  saving.value = true
  error.value = ''

  try {
    const response = await api.updateEscrowFee({
      percentage: newFeePercentage.value
    })

    currentSettings.value = response.data

    toast.add({
      title: 'Success',
      description: 'Escrow fee updated successfully',
      color: 'green'
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to update escrow fee'
    console.error('Failed to update settings:', err)
  } finally {
    saving.value = false
  }
}

const updateKycSettings = async () => {
  savingKyc.value = true

  try {
    const response = await api.updateKycSettings(newKycSettings.value)
    kycSettings.value = response.data

    toast.add({
      title: 'สำเร็จ',
      description: 'อัพเดทการตั้งค่า KYC เรียบร้อยแล้ว',
      color: 'green'
    })
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.response?.data?.message || 'Failed to update KYC settings',
      color: 'red'
    })
    console.error('Failed to update KYC settings:', err)
  } finally {
    savingKyc.value = false
  }
}

onMounted(() => {
  fetchSettings()
  fetchKycSettings()
})
</script>
