<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const isMenuOpen = ref(false)

const navigationItems = computed(() => {
  const items = [
    {
      label: 'แดชบอร์ด',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    },
    {
      label: 'ธุรกรรม',
      icon: 'i-heroicons-shopping-bag',
      to: '/transactions'
    },
    {
      label: 'รีวิว',
      icon: 'i-heroicons-star',
      to: '/reviews'
    }
  ]

  // Add admin link if user is admin
  if (authStore.isAdmin) {
    items.push({
      label: 'ระบบจัดการ',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/admin'
    })
  }

  return items
})

const userMenuItems = computed(() => [
  [{
    label: 'โปรไฟล์',
    icon: 'i-heroicons-user',
    click: () => router.push('/profile')
  }],
  [{
    label: 'ออกจากระบบ',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => authStore.logout()
  }]
])

// Initialize auth when component mounts
onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <AppLogo class="h-8" />
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <UButton
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              color="gray"
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
              color="gray"
              variant="ghost"
              icon="i-heroicons-bell"
              class="hidden md:inline-flex"
            />

            <!-- User Dropdown -->
            <UDropdown
              v-if="authStore.isAuthenticated"
              :items="userMenuItems"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                color="gray"
                variant="ghost"
                trailing-icon="i-heroicons-chevron-down"
              >
                <template #leading>
                  <UAvatar
                    :src="authStore.avatarUrl"
                    :alt="authStore.displayName"
                    size="xs"
                  />
                </template>
                <span class="hidden md:inline">
                  {{ authStore.displayName }}
                </span>
              </UButton>
            </UDropdown>

            <!-- Login button (if not authenticated) -->
            <UButton
              v-else
              to="/auth/login"
              color="primary"
            >
              เข้าสู่ระบบ
            </UButton>

            <!-- Mobile menu button -->
            <UButton
              color="gray"
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
            color="gray"
            variant="ghost"
            :icon="item.icon"
            block
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </UButton>
          <UButton
            to="/notifications"
            color="gray"
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
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <AppLogo class="h-8 mb-4" />
            <p class="text-sm text-gray-600 dark:text-gray-400">
              บริการรับฝากเงินค้ำประกันการซื้อขาย<br />
              ปลอดภัย มั่นใจ ไร้กังวล
            </p>
          </div>
          <div>
            <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">เกี่ยวกับ</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/about" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  เกี่ยวกับเรา
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/how-it-works" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  วิธีการใช้งาน
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  ค่าบริการ
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">ช่วยเหลือ</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/faq" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  คำถามที่พบบ่อย
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  ติดต่อเรา
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/support" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  ศูนย์ช่วยเหลือ
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">กฎหมาย</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/terms" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  ข้อกำหนดการใช้งาน
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/privacy" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  นโยบายความเป็นส่วนตัว
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} DaiSure. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>
