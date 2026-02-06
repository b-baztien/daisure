<template>
  <footer
    class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto"
  >
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            บริการรับฝากเงินค้ำประกันการซื้อขาย<br />
            ปลอดภัย มั่นใจ ไร้กังวล
          </p>
        </div>
        <div>
          <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">
            เกี่ยวกับ
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                to="/about"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                เกี่ยวกับเรา
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/how-it-works"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                วิธีการใช้งาน
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/pricing"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                ค่าบริการ
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">
            ช่วยเหลือ
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                to="/faq"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                คำถามที่พบบ่อย
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                ติดต่อเรา
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/support"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                ศูนย์ช่วยเหลือ
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">
            กฎหมาย
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                to="/terms"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                ข้อกำหนดการใช้งาน
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/privacy"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                นโยบายความเป็นส่วนตัว
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400"
      >
        © {{ new Date().getFullYear() }} DaiSure. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component for DaiSure application
// Includes navigation links for About, Help, and Legal sections
</script>
