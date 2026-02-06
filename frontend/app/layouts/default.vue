<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            DaiSure
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <UButton
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              color="neutral"
              variant="ghost"
              :icon="item.icon"
            >
              {{ item.label }}
            </UButton>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <UButton
              to="/notifications"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-bell"
              class="hidden md:inline-flex"
            />

            <!-- User Dropdown -->
            <UDropdownMenu v-if="profile" :items="userMenuItems">
              <UButton
                color="neutral"
                variant="ghost"
                trailing-icon="i-heroicons-chevron-down"
              >
                <template #leading>
                  <UAvatar
                    :src="profile.profile.pictureUrl"
                    :alt="profile.profile.displayName"
                    size="xs"
                  />
                </template>
                <span class="hidden md:inline">
                  {{ profile.profile.displayName }}
                </span>
              </UButton>
            </UDropdownMenu>

            <!-- Login button (if not authenticated) -->
            <UButton v-else to="/auth/login" color="primary">
              เข้าสู่ระบบ
            </UButton>

            <!-- Mobile menu button -->
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-bars-3"
              class="md:hidden"
              @click="isMenuOpen = !isMenuOpen"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isMenuOpen"
        class="md:hidden border-t border-gray-200 dark:border-gray-700"
      >
        <nav class="container mx-auto px-4 py-2 space-y-1">
          <UButton
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            color="neutral"
            variant="ghost"
            :icon="item.icon"
            block
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </UButton>
          <UButton
            to="/notifications"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bell"
            block
            @click="isMenuOpen = false"
          >
            การแจ้งเตือน
          </UButton>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const router = useRouter();

const isMenuOpen = ref(false);

const navigationItems = computed(() => {
  const items = [
    {
      label: "แดชบอร์ด",
      icon: "i-heroicons-home",
      to: "/dashboard",
    },
    {
      label: "ธุรกรรม",
      icon: "i-heroicons-shopping-bag",
      to: "/transactions",
    },
    {
      label: "รีวิว",
      icon: "i-heroicons-star",
      to: "/reviews",
    },
  ];

  return items;
});

const userMenuItems = computed(() => [
  [
    {
      label: "โปรไฟล์",
      icon: "i-heroicons-user",
      click: () => router.push("/profile"),
    },
  ],
  [
    {
      label: "ออกจากระบบ",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => authStore.logout(),
    },
  ],
]);
</script>
