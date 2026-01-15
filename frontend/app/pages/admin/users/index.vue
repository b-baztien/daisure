<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

const { apiFetch } = useApi()
const toast = useToast()

const users = ref<any[]>([])
const isLoading = ref(true)
const searchQuery = ref('')

// Fetch users
async function fetchUsers() {
  isLoading.value = true
  try {
    const data = await apiFetch<any[]>('/users')
    users.value = data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

// Filtered users
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const search = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.profile?.displayName?.toLowerCase().includes(search) ||
    user.profile?.email?.toLowerCase().includes(search) ||
    user.auth?.email?.toLowerCase().includes(search) ||
    user.profile?.phone?.includes(search)
  )
})

// Format date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Role badge color
function getRoleColor(role: string) {
  const colorMap: Record<string, string> = {
    admin: 'red',
    seller: 'blue',
    buyer: 'green'
  }
  return colorMap[role] || 'gray'
}

// Role label
function getRoleLabel(role: string) {
  const labelMap: Record<string, string> = {
    admin: 'ผู้ดูแลระบบ',
    seller: 'ผู้ขาย',
    buyer: 'ผู้ซื้อ'
  }
  return labelMap[role] || role
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        จัดการผู้ใช้
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        ดูและจัดการผู้ใช้ทั้งหมดในระบบ
      </p>
    </div>

    <!-- Search -->
    <UCard class="mb-6">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ค้นหาผู้ใช้..."
        size="lg"
      />
    </UCard>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-600 animate-spin" />
    </div>

    <!-- Users List -->
    <UCard v-else>
      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <Icon name="i-heroicons-users" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ไม่พบผู้ใช้
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีผู้ใช้ในระบบ' }}
        </p>
      </div>

      <!-- Users Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ผู้ใช้
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                อีเมล
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                เบอร์โทร
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                บทบาท
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                สถานะ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                สมัครเมื่อ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                สถิติ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in filteredUsers"
              :key="user._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <!-- User -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <UAvatar
                    :src="user.profile?.pictureUrl"
                    :alt="user.profile?.displayName"
                    size="md"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.profile?.displayName }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ user._id }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ user.profile?.email || user.auth?.email || 'N/A' }}
                </span>
              </td>

              <!-- Phone -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ user.profile?.phone || 'N/A' }}
                </span>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getRoleColor(user.role)">
                  {{ getRoleLabel(user.role) }}
                </UBadge>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="user.isBlocked ? 'red' : 'green'">
                  {{ user.isBlocked ? 'ถูกบล็อก' : user.status }}
                </UBadge>
              </td>

              <!-- Created At -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.createdAt) }}
                </span>
              </td>

              <!-- Statistics -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white">
                    ซื้อ: {{ user.statistics?.totalBought || 0 }}
                  </div>
                  <div class="text-gray-900 dark:text-white">
                    ขาย: {{ user.statistics?.totalSold || 0 }}
                  </div>
                  <div class="text-gray-600 dark:text-gray-400">
                    เสร็จ: {{ user.statistics?.totalCompleted || 0 }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">ผู้ใช้ทั้งหมด</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ users.length }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">ผู้ดูแลระบบ</p>
          <p class="text-3xl font-bold text-red-600 mt-2">
            {{ users.filter(u => u.role === 'admin').length }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">ผู้ขาย</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">
            {{ users.filter(u => u.role === 'seller').length }}
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">ผู้ซื้อ</p>
          <p class="text-3xl font-bold text-green-600 mt-2">
            {{ users.filter(u => u.role === 'buyer').length }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
