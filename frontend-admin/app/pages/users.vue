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
