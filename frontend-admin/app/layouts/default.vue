<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
    >
      <div class="flex flex-col h-full">
        <div
          class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700"
        >
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <UButton
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            variant="ghost"
            color="gray"
            class="w-full justify-start"
            :class="{ 'bg-gray-100 dark:bg-gray-700': isActive(item.to) }"
          >
            {{ item.label }}
          </UButton>
        </nav>

        <!-- User Menu -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <UDropdown :items="userMenuItems" mode="hover">
            <UButton
              color="gray"
              variant="ghost"
              class="w-full justify-start"
              icon="i-heroicons-user-circle"
            >
              {{ authStore.user?.name || authStore.user?.email }}
            </UButton>
          </UDropdown>
        </div>
      </div>
    </aside>

    <main class="pl-64">
      <header
        class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between h-16 px-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ pageTitle }}
          </h2>

          <div class="flex items-center space-x-4">
            <UButton
              icon="i-heroicons-bell"
              color="neutral"
              variant="ghost"
              size="lg"
            />
            <ColorModeButton />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: "i-heroicons-home",
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: "i-heroicons-credit-card",
  },
  {
    label: "Disputes",
    to: "/disputes",
    icon: "i-heroicons-exclamation-triangle",
  },
  {
    label: "Users",
    to: "/users",
    icon: "i-heroicons-users",
  },
  {
    label: "Reviews",
    to: "/reviews",
    icon: "i-heroicons-star",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: "i-heroicons-cog-6-tooth",
  },
  {
    label: "Admin Logs",
    to: "/logs",
    icon: "i-heroicons-document-text",
  },
];

const userMenuItems = [
  [
    {
      label: "Profile",
      icon: "i-heroicons-user",
      click: () => {
        // Navigate to profile
      },
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => {
        authStore.logout();
        router.push("/login");
      },
    },
  ],
];

const isActive = (path: string) => {
  return route.path === path;
};

const pageTitle = computed(() => {
  const currentNav = navigation.find((item) => item.to === route.path);
  return currentNav?.label || "Admin Panel";
});

// Auth check is now handled by middleware
onMounted(() => {
  // Layout initialization if needed
});
</script>

<style scoped>
/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.dark nav::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark nav::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
