<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Users Management
      </h1>

      <UButton
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="fetchUsers"
      >
        Refresh
      </UButton>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <UFormField label="Role">
          <USelect
            v-model="filters.role"
            :options="roleOptions"
            @change="fetchUsers"
          />
        </UFormField>

        <UFormField label="Verification Status">
          <USelect
            v-model="filters.verificationStatus"
            :options="verificationOptions"
            @change="fetchUsers"
          />
        </UFormField>

        <UFormField label="Search" class="sm:col-span-2">
          <UInput
            v-model="filters.search"
            placeholder="Search by name or email..."
            icon="i-heroicons-magnifying-glass"
            @input="debouncedSearch"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- Users Table -->
    <UCard>
      <UTable
        :data="users"
        :columns="columns"
        :loading="loading"
        :empty-state="{ icon: 'i-heroicons-users', label: 'No users found' }"
      >
        <template #role-data="{ row }">
          <UBadge :color="getRoleColor(row.role)">
            {{ formatRole(row.role) }}
          </UBadge>
        </template>

        <template #verificationStatus-data="{ row }">
          <UBadge :color="getVerificationColor(row.verificationStatus)">
            {{ formatStatus(row.verificationStatus) }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UButton
            size="xs"
            color="gray"
            icon="i-heroicons-eye"
            @click="viewUserDetails(row)"
          >
            View
          </UButton>
        </template>
      </UTable>

      <!-- Pagination -->
      <template #footer>
        <div
          class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="text-sm text-gray-700 dark:text-gray-200">
            Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to
            {{
              Math.min(pagination.page * pagination.pageSize, pagination.total)
            }}
            of {{ pagination.total }} results
          </div>

          <div class="flex gap-1.5">
            <UButton
              icon="i-heroicons-chevron-left"
              size="xs"
              color="gray"
              :disabled="pagination.page === 1"
              @click="goToPage(pagination.page - 1)"
            />

            <USelect
              v-model="pagination.page"
              :options="pageOptions"
              size="xs"
              class="w-20"
              @change="fetchUsers"
            />

            <UButton
              icon="i-heroicons-chevron-right"
              size="xs"
              color="gray"
              :disabled="pagination.page >= pagination.totalPages"
              @click="goToPage(pagination.page + 1)"
            />
          </div>
        </div>
      </template>
    </UCard>

    <!-- User Details Modal -->
    <UModal v-model="showDetailsModal" :ui="{ width: 'max-w-2xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">User Details</h3>
        </template>

        <div v-if="selectedUser" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p class="font-mono text-sm">{{ selectedUser._id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p class="font-medium">{{ selectedUser.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p>{{ selectedUser.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <UBadge :color="getRoleColor(selectedUser.role)">
                {{ formatRole(selectedUser.role) }}
              </UBadge>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Verification Status
              </p>
              <UBadge
                :color="getVerificationColor(selectedUser.verificationStatus)"
              >
                {{ formatStatus(selectedUser.verificationStatus) }}
              </UBadge>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Member Since
              </p>
              <p>{{ formatDate(selectedUser.createdAt) }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="ghost"
              @click="showDetailsModal = false"
            >
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Error Alert -->
    <UAlert
      v-if="error"
      color="red"
      variant="soft"
      :title="error"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'red',
        variant: 'link',
      }"
      @close="error = ''"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useDateFormat } from "@vueuse/core";
import dayjs from "dayjs";
import type { PaginatedResponse, User } from "~/types/api";

const api = useApi();

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref("");

const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});

const filters = ref({
  role: "",
  verificationStatus: "",
  search: "",
});

const roleOptions = [
  { label: "All", value: "" },
  { label: "Buyer", value: "buyer" },
  { label: "Seller", value: "seller" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
];

const verificationOptions = [
  { label: "All", value: "" },
  { label: "Unverified", value: "unverified" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
];

const columns = computed<TableColumn<User>[]>(() => [
  {
    accessorKey: "profile.displayName",
    header: "Display Name",
  },
  {
    accessorKey: "profile.email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      useDateFormat(row.original.createdAt, "DD/MM/YYYY HH:mm:ss").value,
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
]);

// Details modal state
const showDetailsModal = ref(false);
const selectedUser = ref<User | null>(null);

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

const formatRole = (role: string) => {
  return role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    buyer: "blue",
    seller: "green",
    admin: "purple",
    super_admin: "red",
  };
  return colors[role] || "gray";
};

const getVerificationColor = (status: string) => {
  const colors: Record<string, string> = {
    unverified: "gray",
    pending: "yellow",
    verified: "green",
    rejected: "red",
  };
  return colors[status] || "gray";
};

const pageOptions = computed(() => {
  return Array.from({ length: pagination.value.totalPages }, (_, i) => ({
    label: `Page ${i + 1}`,
    value: i + 1,
  }));
});

const fetchUsers = async () => {
  loading.value = true;
  error.value = "";

  try {
    const params: Record<string, any> = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    };

    if (filters.value.role) params.role = filters.value.role;
    if (filters.value.verificationStatus)
      params.verificationStatus = filters.value.verificationStatus;
    if (filters.value.search) params.search = filters.value.search;

    const response = await api.getUsers(params);

    // Check if response is paginated
    if ("pagination" in response.data) {
      const paginatedResponse = response.data as PaginatedResponse<User>;
      users.value = paginatedResponse.data;
      pagination.value = paginatedResponse.pagination;
    } else {
      // Fallback for non-paginated response
      users.value = response.data as User[];
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load users";
    console.error("Failed to fetch users:", err);
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  pagination.value.page = page;
  fetchUsers();
};

const viewUserDetails = (user: User) => {
  selectedUser.value = user;
  showDetailsModal.value = true;
};

let searchTimeout: NodeJS.Timeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1; // Reset to first page on search
    fetchUsers();
  }, 500);
};

onMounted(() => {
  fetchUsers();
});
</script>
