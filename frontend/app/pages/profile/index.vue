<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">โปรไฟล์</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        จัดการข้อมูลส่วนตัวของคุณ
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Sidebar -->
      <div class="space-y-4">
        <UCard>
          <div class="text-center">
            <UAvatar
              :src="authStore.user?.pictureUrl"
              :alt="authStore.user?.displayName"
              size="3xl"
              class="mx-auto mb-4"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ authStore.user?.displayName }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ authStore.user?.email }}
            </p>

            <UBadge :color="getRoleColor(authStore.user?.role)" class="mt-4">
              {{ getRoleText(authStore.user?.role) }}
            </UBadge>
          </div>

          <UDivider class="my-4" />

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-blue-600">
                {{ authStore.user?.statistics?.totalCompleted || 0 }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">รายการ</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-600">
                {{ (authStore.user?.rating?.asSeller?.average || authStore.user?.rating?.asBuyer?.average || 0).toFixed(1) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">คะแนน</p>
            </div>
          </div>
        </UCard>

        <!-- Menu -->
        <UCard>
          <div class="space-y-2">
            <UButton
              to="/profile"
              color="gray"
              variant="ghost"
              block
              class="justify-start"
            >
              <UIcon name="i-heroicons-user" class="mr-2" />
              ข้อมูลส่วนตัว
            </UButton>
            <UButton
              to="/profile/bank-accounts"
              color="gray"
              variant="ghost"
              block
              class="justify-start"
            >
              <UIcon name="i-heroicons-building-library" class="mr-2" />
              บัญชีธนาคาร
            </UButton>
            <UButton
              to="/profile/settings"
              color="gray"
              variant="ghost"
              block
              class="justify-start"
            >
              <UIcon name="i-heroicons-cog-6-tooth" class="mr-2" />
              ตั้งค่า
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
          </template>

          <UForm :state="form" @submit="onSubmit" class="space-y-4">
            <!-- Display Name -->
            <UFormField label="ชื่อ-นามสกุล">
              <UInput v-model="form.displayName" />
            </UFormField>

            <!-- Email -->
            <UFormField label="อีเมล">
              <UInput v-model="form.email" type="email" disabled />
            </UFormField>

            <!-- Phone -->
            <UFormField label="เบอร์โทร">
              <UInput v-model="form.phone" />
            </UFormField>

            <!-- Submit -->
            <UButton type="submit" :loading="isLoading">
              บันทึกการเปลี่ยนแปลง
            </UButton>
          </UForm>
        </UCard>

        <!-- Change Password -->
        <UCard class="mt-6">
          <template #header>
            <h2 class="text-xl font-semibold">เปลี่ยนรหัสผ่าน</h2>
          </template>

          <UForm
            :state="passwordForm"
            @submit="changePassword"
            class="space-y-4"
          >
            <!-- Current Password -->
            <UFormField label="รหัสผ่านปัจจุบัน">
              <UInput v-model="passwordForm.currentPassword" type="password" />
            </UFormField>

            <!-- New Password -->
            <UFormField label="รหัสผ่านใหม่">
              <UInput v-model="passwordForm.newPassword" type="password" />
            </UFormField>

            <!-- Confirm Password -->
            <UFormField label="ยืนยันรหัสผ่านใหม่">
              <UInput v-model="passwordForm.confirmPassword" type="password" />
            </UFormField>

            <!-- Submit -->
            <UButton type="submit" color="red" :loading="isChangingPassword">
              เปลี่ยนรหัสผ่าน
            </UButton>
          </UForm>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const toast = useToast();

const form = reactive({
  displayName: authStore.user?.displayName || "",
  email: authStore.user?.email || "",
  phone: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const isChangingPassword = ref(false);

const getRoleColor = (role?: string) => {
  const colors = {
    buyer: "blue",
    seller: "green",
    admin: "purple",
    super_admin: "red",
  };
  return colors[role] || "gray";
};

const getRoleText = (role?: string) => {
  const texts = {
    buyer: "ผู้ซื้อ",
    seller: "ผู้ขาย",
    admin: "แอดมิน",
    super_admin: "ซุปเปอร์แอดมิน",
  };
  return texts[role] || role;
};

const onSubmit = async () => {
  isLoading.value = true;
  try {
    // Call API to update profile
    await authStore.updateProfile({
      displayName: form.displayName,
      phone: form.phone
    });

    toast.add({
      title: "อัพเดทข้อมูลสำเร็จ",
      color: "green",
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || 'ไม่สามารถอัพเดทข้อมูลได้',
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

const { apiFetch } = useApi();

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({
      title: "รหัสผ่านไม่ตรงกัน",
      color: "red",
    });
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    toast.add({
      title: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      color: "red",
    });
    return;
  }

  isChangingPassword.value = true;
  try {
    // Call API to change password
    // Note: This endpoint needs to be added to backend if not exists
    await apiFetch('/users/me/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    });

    toast.add({
      title: "เปลี่ยนรหัสผ่านสำเร็จ",
      color: "green",
    });

    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error: any) {
    console.error('Change password error:', error);
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
      color: "red",
    });
  } finally {
    isChangingPassword.value = false;
  }
};
</script>
