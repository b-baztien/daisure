<template>
  <div class="min-h-screen flex flex-col">
    <!-- Blank layout - no header or navigation, but includes footer -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Blank layout for pages that don't need header or navigation
// Examples: landing pages, special campaign pages, footer pages
// Includes footer for consistent site-wide navigation
</script>
