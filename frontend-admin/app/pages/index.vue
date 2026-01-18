<script setup lang="ts">
definePageMeta({
  middleware: defineNuxtRouteMiddleware((to, from) => {
    return navigateTo('/dashboard')
  })
})
</script>
