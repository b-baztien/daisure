<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const toast = useToast()

const isLoading = ref(false)
const isAddingAccount = ref(false)
const showAddForm = ref(false)

// New bank account form
const newAccount = ref({
  bankName: '',
  bankCode: '',
  accountNumber: '',
  accountName: ''
})

// Thai banks
const thBanks = [
  { label: 'ธนาคารกรุงเทพ', value: 'BBL', code: '002' },
  { label: 'ธนาคารกสิกรไทย', value: 'KBANK', code: '004' },
  { label: 'ธนาคารกรุงไทย', value: 'KTB', code: '006' },
  { label: 'ธนาคารไทยพาณิชย์', value: 'SCB', code: '014' },
  { label: 'ธนาคารกรุงศรีอยุธยา', value: 'BAY', code: '025' },
  { label: 'ธนาคารทหารไทยธนชาต', value: 'TTB', code: '011' },
  { label: 'ธนาคารออมสิน', value: 'GSB', code: '030' },
  { label: 'ธนาคารอาคารสงเคราะห์', value: 'GHB', code: '033' }
]

// Fetch bank accounts
const bankAccounts = computed(() => authStore.user?.bankAccounts || [])

// Add bank account
async function addBankAccount() {
  if (!newAccount.value.bankName || !newAccount.value.accountNumber || !newAccount.value.accountName) {
    toast.add({
      title: 'กรุณากรอกข้อมูล',
      description: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      color: 'red'
    })
    return
  }

  isAddingAccount.value = true
  try {
    await authStore.addBankAccount(newAccount.value)

    toast.add({
      title: 'สำเร็จ',
      description: 'เพิ่มบัญชีธนาคารเรียบร้อยแล้ว',
      color: 'green'
    })

    // Reset form
    newAccount.value = {
      bankName: '',
      bankCode: '',
      accountNumber: '',
      accountName: ''
    }
    showAddForm.value = false
  } catch (error: any) {
    console.error('Failed to add bank account:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: error.data?.message || 'ไม่สามารถเพิ่มบัญชีธนาคารได้',
      color: 'red'
    })
  } finally {
    isAddingAccount.value = false
  }
}

// Handle bank selection
watch(() => newAccount.value.bankName, (bankValue) => {
  const bank = thBanks.find(b => b.value === bankValue)
  if (bank) {
    newAccount.value.bankCode = bank.code
  }
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          บัญชีธนาคาร
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          จัดการบัญชีธนาคารสำหรับรับเงิน
        </p>
      </div>
      <UButton
        v-if="!showAddForm"
        @click="showAddForm = true"
        icon="i-heroicons-plus"
      >
        เพิ่มบัญชีธนาคาร
      </UButton>
    </div>

    <!-- Add Bank Account Form -->
    <UCard v-if="showAddForm" class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            เพิ่มบัญชีธนาคารใหม่
          </h2>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="showAddForm = false"
          />
        </div>
      </template>

      <form @submit.prevent="addBankAccount" class="space-y-4">
        <!-- Bank Name -->
        <UFormGroup label="ธนาคาร" required>
          <USelectMenu
            v-model="newAccount.bankName"
            :options="thBanks"
            placeholder="เลือกธนาคาร"
            size="lg"
            value-attribute="value"
          />
        </UFormGroup>

        <!-- Account Number -->
        <UFormGroup label="เลขที่บัญชี" required>
          <UInput
            v-model="newAccount.accountNumber"
            type="text"
            placeholder="xxx-x-xxxxx-x"
            size="lg"
            maxlength="15"
          />
        </UFormGroup>

        <!-- Account Name -->
        <UFormGroup label="ชื่อบัญชี" required>
          <UInput
            v-model="newAccount.accountName"
            type="text"
            placeholder="ชื่อบัญชีตามบัตรประชาชน"
            size="lg"
          />
        </UFormGroup>

        <!-- Buttons -->
        <div class="flex space-x-4">
          <UButton
            type="submit"
            size="lg"
            :loading="isAddingAccount"
            :disabled="isAddingAccount"
          >
            เพิ่มบัญชี
          </UButton>
          <UButton
            type="button"
            color="gray"
            variant="outline"
            size="lg"
            @click="showAddForm = false"
          >
            ยกเลิก
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Bank Accounts List -->
    <div v-if="bankAccounts.length === 0 && !showAddForm" class="text-center py-12">
      <UCard>
        <Icon name="i-heroicons-credit-card" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ยังไม่มีบัญชีธนาคาร
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          เพิ่มบัญชีธนาคารเพื่อรับเงินจากการขาย
        </p>
        <UButton @click="showAddForm = true" size="lg">
          เพิ่มบัญชีธนาคาร
        </UButton>
      </UCard>
    </div>

    <!-- Bank Accounts Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard
        v-for="account in bankAccounts"
        :key="account.accountNumber"
        class="relative"
      >
        <div class="space-y-4">
          <!-- Bank Info -->
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ thBanks.find(b => b.code === account.bankCode)?.label || account.bankName }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                {{ account.accountNumber }}
              </p>
              <p class="text-gray-700 dark:text-gray-300 font-medium mt-1">
                {{ account.accountName }}
              </p>
            </div>

            <!-- Default Badge -->
            <UBadge v-if="account.isDefault" color="blue">
              บัญชีหลัก
            </UBadge>
          </div>

          <!-- Verification Status -->
          <div class="flex items-center space-x-2">
            <Icon
              :name="account.isVerified ? 'i-heroicons-check-circle' : 'i-heroicons-clock'"
              :class="account.isVerified ? 'text-green-600' : 'text-yellow-600'"
              class="w-5 h-5"
            />
            <span
              :class="account.isVerified ? 'text-green-600' : 'text-yellow-600'"
              class="text-sm font-medium"
            >
              {{ account.isVerified ? 'ยืนยันแล้ว' : 'รอการยืนยัน' }}
            </span>
          </div>

          <!-- Actions -->
          <div v-if="!account.isDefault" class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <UButton
              color="gray"
              variant="outline"
              size="sm"
              block
            >
              ตั้งเป็นบัญชีหลัก
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Info Card -->
    <UCard class="mt-6 bg-blue-50 dark:bg-blue-950">
      <div class="flex items-start space-x-3">
        <Icon name="i-heroicons-information-circle" class="w-6 h-6 text-blue-600 mt-0.5" />
        <div class="text-sm">
          <p class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ข้อมูลสำคัญ
          </p>
          <ul class="space-y-1 text-blue-800 dark:text-blue-200">
            <li>• บัญชีธนาคารจะถูกใช้สำหรับรับเงินจากการขาย</li>
            <li>• บัญชีต้องผ่านการยืนยันก่อนถึงจะใช้งานได้</li>
            <li>• สามารถเพิ่มได้หลายบัญชี แต่ใช้งานได้ทีละบัญชี</li>
            <li>• บัญชีหลักจะถูกใช้เป็นค่าเริ่มต้นในการรับเงิน</li>
          </ul>
        </div>
      </div>
    </UCard>
  </div>
</template>
