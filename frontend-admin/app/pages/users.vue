<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Users Management
      </h1>
    </div>

    <!-- Users Table -->
    <UCard>
      <UTable
        ref="table"
        :data="users?.data || []"
        :columns="columns"
        @select="viewUserDetails"
      >
        <template #displayName-cell="{ row }">
          <div class="flex">
            <p>{{ row.original.profile.displayName }}</p>
          </div>
        </template>

        <template #role-cell="{ row }">
          <BadgeRole :role="row.original.role" />
        </template>
      </UTable>
    </UCard>

    <UCard v-if="selectedUser">
      <template #header>
        <h3 class="text-lg font-medium">User Details</h3>
      </template>

      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">User ID</p>
            <p class="font-mono text-sm">{{ selectedUser._id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p class="font-medium">{{ selectedUser.profile.displayName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p>{{ selectedUser.profile.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <BadgeRole :role="selectedUser.role" />
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
            <p>{{ formatDate(selectedUser.createdAt) }}</p>
          </div>

          <div class="col-span-full">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Bank Accounts
            </p>
            <div
              v-if="selectedUser.bankAccounts?.length"
              class="grid gap-3 sm:grid-cols-2"
            >
              <UCard
                v-for="(account, index) in selectedUser.bankAccounts"
                :key="index"
              >
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ account.bank.name }}
                    </p>
                    <div class="flex gap-1">
                      <UBadge
                        v-if="account.isDefault"
                        color="primary"
                        variant="subtle"
                        size="xs"
                      >
                        Default
                      </UBadge>
                      <UBadge
                        :color="account.isVerified ? 'success' : 'error'"
                        variant="subtle"
                        size="xs"
                      >
                        {{ account.isVerified ? "Verified" : "Not Verified" }}
                      </UBadge>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ account.accountName }}
                  </p>
                  <p class="font-mono text-sm text-gray-500">
                    {{ account.accountNumber }}
                  </p>
                </div>
              </UCard>
            </div>
            <p v-else class="text-sm text-gray-400 italic">
              No bank accounts linked
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="neutral" variant="ghost" @click="onCloseSelectedUser">
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from "@nuxt/ui";
import { useDateFormat } from "@vueuse/core";
import type { User } from "~/types/api";

const tableEl = useTemplateRef("table");

const pagination = ref({
  page: 1,
  pageSize: 20,
});

const { data: users } = await useUserService().getUsers({ params: pagination });

const columns = computed<TableColumn<User>[]>(() => [
  {
    id: "displayName",
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

const selectedUser = ref<User>();

function onCloseSelectedUser() {
  tableEl.value?.tableApi.resetRowSelection();
  selectedUser.value = undefined;
}

const viewUserDetails = (_e: Event, row: TableRow<User>) => {
  selectedUser.value = row.original;
  tableEl.value?.tableApi.resetRowSelection();
  row.toggleSelected(!row.getIsSelected());
};
</script>
