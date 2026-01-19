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

// Table columns
const columns = [
  {
    id: 'user',
    label: 'ผู้ใช้',
    sortable: true
  },
  {
    id: 'email',
    label: 'อีเมล',
    sortable: true
  },
  {
    id: 'phone',
    label: 'เบอร์โทร'
  },
  {
    id: 'role',
    label: 'บทบาท',
    sortable: true
  },
  {
    id: 'status',
    label: 'สถานะ',
    sortable: true
  },
  {
    id: 'createdAt',
    label: 'สมัครเมื่อ',
    sortable: true
  },
  {
    id: 'statistics',
    label: 'สถิติ'
  }
]

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
      <UTable v-else :columns="columns" :data="filteredUsers">
        <!-- User Column -->
        <template #user-data="{ row }">
          <div class="flex items-center">
            <UAvatar
              :src="row.profile?.pictureUrl"
              :alt="row.profile?.displayName"
              size="md"
            />
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ row.profile?.displayName }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                ID: {{ row._id }}
              </div>
            </div>
          </div>
        </template>

        <!-- Email Column -->
        <template #email-data="{ row }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ row.profile?.email || row.auth?.email || 'N/A' }}
          </span>
        </template>

        <!-- Phone Column -->
        <template #phone-data="{ row }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ row.profile?.phone || 'N/A' }}
          </span>
        </template>

        <!-- Role Column -->
        <template #role-data="{ row }">
          <UBadge :color="getRoleColor(row.role)">
            {{ getRoleLabel(row.role) }}
          </UBadge>
        </template>

        <!-- Status Column -->
        <template #status-data="{ row }">
          <UBadge :color="row.isBlocked ? 'red' : 'green'">
            {{ row.isBlocked ? 'ถูกบล็อก' : row.status }}
          </UBadge>
        </template>

        <!-- Created At Column -->
        <template #createdAt-data="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(row.createdAt) }}
          </span>
        </template>

        <!-- Statistics Column -->
        <template #statistics-data="{ row }">
          <div class="text-sm">
            <div class="text-gray-900 dark:text-white">
              ซื้อ: {{ row.statistics?.totalBought || 0 }}
            </div>
            <div class="text-gray-900 dark:text-white">
              ขาย: {{ row.statistics?.totalSold || 0 }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">
              เสร็จ: {{ row.statistics?.totalCompleted || 0 }}
            </div>
          </div>
        </template>
      </UTable>
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
