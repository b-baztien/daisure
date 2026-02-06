<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Blank layout for pages that don't need header or navigation
// Examples: landing pages, special campaign pages, footer pages
// Includes footer for consistent site-wide navigation
</script>
