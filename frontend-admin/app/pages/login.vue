<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          Admin Panel
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to your admin account
        </p>
      </div>

      <UCard>
        <UForm :state="state" class="space-y-6" @submit="handleLogin()">
          <UFormField label="Email" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="admin@example.com"
              icon="i-heroicons-envelope"
              required
            />
          </UFormField>

          <UFormField label="Password" name="password" required>
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Enter your password"
              icon="i-heroicons-lock-closed"
              required
            />
          </UFormField>

          <UButton type="submit" block size="lg"> Sign In </UButton>

          <!-- <UAlert
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
          /> -->
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthService } from "~/composables/services/authService";

definePageMeta({
  layout: false,
});

const state = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  const payload = {
    email: state.email,
    password: state.password,
  };

  const { execute, error } = useAuthService().login({
    body: payload,
    immediate: false,
  });

  await execute();

  if (error.value) {
    useAlert(error.value);
    return;
  }

  return navigateTo("/");
};
</script>
