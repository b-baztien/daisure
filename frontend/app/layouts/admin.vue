<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/admin" class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-shield-check"
              class="w-8 h-8 text-purple-600"
            />
            <span class="text-xl font-bold"> Admin Panel </span>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/admin" class="text-gray-600 hover:text-purple-600">
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/transactions"
              class="text-gray-600 hover:text-purple-600"
            >
              Transactions
            </NuxtLink>
            <NuxtLink
              to="/admin/users"
              class="text-gray-600 hover:text-purple-600"
            >
              Users
            </NuxtLink>
            <NuxtLink
              to="/admin/settings"
              class="text-gray-600 hover:text-purple-600"
            >
              Settings
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-4">
            <UButton
              to="/dashboard"
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-left"
            >
              กลับสู่หน้าหลัก
            </UButton>
            <UDropdown :items="userMenuItems">
              <UAvatar size="sm" />
            </UDropdown>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const authStore = useAuthStore();

const userMenuItems = [
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => authStore.logout(),
    },
  ],
];
</script>
