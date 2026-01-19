<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">ตั้งค่า</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        จัดการการแจ้งเตือนและความเป็นส่วนตัว
      </p>
    </div>

    <!-- Notification Settings -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold">การแจ้งเตือน</h2>
      </template>

      <div class="space-y-6">
        <!-- Email Notifications -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              แจ้งเตือนทางอีเมล
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              รับการแจ้งเตือนเกี่ยวกับธุรกรรมและกิจกรรมสำคัญทางอีเมล
            </p>
          </div>
          <UToggle v-model="settings.emailNotifications" />
        </div>

        <UDivider />

        <!-- Transaction Updates -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              อัพเดทธุรกรรม
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              รับการแจ้งเตือนเมื่อมีการอัพเดทสถานะธุรกรรม
            </p>
          </div>
          <UToggle v-model="settings.transactionUpdates" />
        </div>

        <UDivider />

        <!-- Review Notifications -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              รีวิวและคะแนน
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              แจ้งเตือนเมื่อได้รับรีวิวหรือคะแนนใหม่
            </p>
          </div>
          <UToggle v-model="settings.reviewNotifications" />
        </div>

        <UDivider />

        <!-- Marketing Emails -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              ข่าวสารและโปรโมชั่น
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              รับข่าวสาร อัพเดท และโปรโมชั่นพิเศษ
            </p>
          </div>
          <UToggle v-model="settings.marketingEmails" />
        </div>
      </div>
    </UCard>

    <!-- Privacy Settings -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold">ความเป็นส่วนตัว</h2>
      </template>

      <div class="space-y-6">
        <!-- Profile Visibility -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              แสดงโปรไฟล์สาธารณะ
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              อนุญาตให้ผู้ใช้อื่นเห็นข้อมูลโปรไฟล์และคะแนนของคุณ
            </p>
          </div>
          <UToggle v-model="settings.publicProfile" />
        </div>

        <UDivider />

        <!-- Show Statistics -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              แสดงสถิติการทำธุรกรรม
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              แสดงจำนวนธุรกรรมที่เสร็จสมบูรณ์ในโปรไฟล์
            </p>
          </div>
          <UToggle v-model="settings.showStatistics" />
        </div>

        <UDivider />

        <!-- Show Contact Info -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              แสดงข้อมูลติดต่อ
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              อนุญาตให้ผู้ใช้ที่ทำธุรกรรมด้วยเห็นเบอร์โทรของคุณ
            </p>
          </div>
          <UToggle v-model="settings.showContactInfo" />
        </div>
      </div>
    </UCard>

    <!-- Account Preferences -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold">การตั้งค่าบัญชี</h2>
      </template>

      <div class="space-y-6">
        <!-- Two-Factor Authentication -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              การยืนยันตัวตนแบบสองขั้นตอน
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              เพิ่มความปลอดภัยให้บัญชีด้วย 2FA (เร็วๆ นี้)
            </p>
          </div>
          <UToggle v-model="settings.twoFactorAuth" disabled />
        </div>

        <UDivider />

        <!-- Session Management -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">
              จัดการเซสชั่น
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ดูและจัดการอุปกรณ์ที่เข้าสู่ระบบ
            </p>
          </div>
          <UButton color="gray" variant="outline" size="sm">
            ดูเซสชั่น
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Danger Zone -->
    <UCard class="border-red-200 dark:border-red-800">
      <template #header>
        <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">
          โซนอันตราย
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">
            ลบบัญชี
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            การลบบัญชีจะเป็นการถาวร และไม่สามารถกู้คืนข้อมูลได้
          </p>
          <UButton color="red" variant="outline" @click="confirmDeleteAccount">
            ลบบัญชีของฉัน
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Save Button -->
    <div class="mt-6 flex justify-end">
      <UButton size="lg" :loading="isLoading" @click="saveSettings">
        บันทึกการตั้งค่า
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(false);

// Settings state
const settings = reactive({
  // Notifications
  emailNotifications: true,
  transactionUpdates: true,
  reviewNotifications: true,
  marketingEmails: false,

  // Privacy
  publicProfile: true,
  showStatistics: true,
  showContactInfo: true,

  // Account
  twoFactorAuth: false,
});

// Load user settings on mount
onMounted(() => {
  // TODO: Load settings from API if backend supports it
  // For now, using default values
});

// Save settings
const saveSettings = async () => {
  isLoading.value = true;
  try {
    // TODO: Call API to save settings when backend is ready
    // await authStore.updateSettings(settings);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.add({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "การตั้งค่าของคุณได้รับการอัพเดทแล้ว",
      color: "green",
    });
  } catch (error: any) {
    console.error("Save settings error:", error);
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถบันทึกการตั้งค่าได้",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

// Confirm delete account
const confirmDeleteAccount = () => {
  // TODO: Implement delete account confirmation modal
  toast.add({
    title: "คุณสมบัตินี้ยังไม่พร้อมใช้งาน",
    description: "กรุณาติดต่อฝ่ายสนับสนุนเพื่อลบบัญชี",
    color: "orange",
  });
};
</script>
