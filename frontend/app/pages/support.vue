<script setup lang="ts">
useHead({
  title: 'ศูนย์ช่วยเหลือ - DaiSure',
  meta: [
    { name: 'description', content: 'ศูนย์ช่วยเหลือ DaiSure - หาคำแนะนำ บทความ และวิธีแก้ปัญหาต่างๆ' }
  ]
})

const helpCategories = [
  {
    title: 'เริ่มต้นใช้งาน',
    description: 'คู่มือสำหรับผู้ใช้งานใหม่',
    icon: 'i-heroicons-rocket-launch',
    color: 'blue',
    articles: [
      'วิธีสมัครสมาชิก DaiSure',
      'การยืนยันตัวตน (KYC)',
      'วิธีสร้างธุรกรรมแรก',
      'การตั้งค่าโปรไฟล์',
      'การเชื่อมต่อบัญชีธนาคาร'
    ]
  },
  {
    title: 'การจัดการธุรกรรม',
    description: 'ทุกอย่างเกี่ยวกับธุรกรรม',
    icon: 'i-heroicons-clipboard-document-list',
    color: 'green',
    articles: [
      'วิธีสร้างธุรกรรมใหม่',
      'การชำระเงิน',
      'การยืนยันการจัดส่งสินค้า',
      'การยืนยันการรับสินค้า',
      'การยกเลิกธุรกรรม'
    ]
  },
  {
    title: 'การชำระเงินและถอนเงิน',
    description: 'จัดการด้านการเงิน',
    icon: 'i-heroicons-banknotes',
    color: 'purple',
    articles: [
      'วิธีชำระเงิน',
      'การอัพโหลดหลักฐานการโอน',
      'วิธีถอนเงิน',
      'ระยะเวลาในการโอนเงิน',
      'ค่าธรรมเนียมต่างๆ'
    ]
  },
  {
    title: 'ปัญหาและการแก้ไข',
    description: 'แก้ไขปัญหาที่พบบ่อย',
    icon: 'i-heroicons-wrench-screwdriver',
    color: 'orange',
    articles: [
      'ลืมรหัสผ่าน',
      'ไม่ได้รับอีเมล์ยืนยัน',
      'การชำระเงินไม่สำเร็จ',
      'ข้อพิพาทธุรกรรม',
      'ปัญหาการเข้าสู่ระบบ'
    ]
  },
  {
    title: 'ความปลอดภัย',
    description: 'รักษาความปลอดภัยบัญชี',
    icon: 'i-heroicons-shield-check',
    color: 'red',
    articles: [
      'วิธีรักษาความปลอดภัยบัญชี',
      'การเปิดใช้งาน 2FA',
      'การรายงานธุรกรรมที่ผิดปกติ',
      'การป้องกันการถูกหลอกลวง',
      'นโยบายความปลอดภัย'
    ]
  },
  {
    title: 'บัญชีและการตั้งค่า',
    description: 'จัดการบัญชีของคุณ',
    icon: 'i-heroicons-cog-6-tooth',
    color: 'indigo',
    articles: [
      'การอัพเดทข้อมูลส่วนตัว',
      'การเปลี่ยนรหัสผ่าน',
      'การจัดการการแจ้งเตือน',
      'การอัพเกรดแพ็คเกจ',
      'การลบบัญชี'
    ]
  }
]

const quickLinks = [
  {
    title: 'สร้างธุรกรรมใหม่',
    icon: 'i-heroicons-plus-circle',
    link: '/transactions/create',
    description: 'เริ่มต้นการซื้อขายใหม่'
  },
  {
    title: 'ธุรกรรมของฉัน',
    icon: 'i-heroicons-list-bullet',
    link: '/transactions',
    description: 'ดูธุรกรรมทั้งหมด'
  },
  {
    title: 'โปรไฟล์',
    icon: 'i-heroicons-user-circle',
    link: '/profile',
    description: 'จัดการข้อมูลส่วนตัว'
  },
  {
    title: 'คำถามที่พบบ่อย',
    icon: 'i-heroicons-question-mark-circle',
    link: '/faq',
    description: 'หาคำตอบที่พบบ่อย'
  }
]

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'พูดคุยกับทีมงานแบบทันที',
    icon: 'i-heroicons-chat-bubble-left-right',
    action: 'เริ่มแชท',
    color: 'blue'
  },
  {
    title: 'Email Support',
    description: 'ส่งอีเมล์ถึงเรา ตอบภายใน 24 ชั่วโมง',
    icon: 'i-heroicons-envelope',
    action: 'ส่งอีเมล์',
    color: 'green',
    link: '/contact'
  },
  {
    title: 'โทรศัพท์',
    description: 'โทรหาเราในเวลาทำการ',
    icon: 'i-heroicons-phone',
    action: '02-XXX-XXXX',
    color: 'purple'
  }
]

const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            ศูนย์ช่วยเหลือ
          </h1>
          <p class="text-xl text-blue-100 mb-8">
            ค้นหาคำตอบ บทความ และคู่มือการใช้งาน
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <Icon
                name="i-heroicons-magnifying-glass"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหาคำถามหรือคำแนะนำ..."
                class="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Help Categories -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              หมวดหมู่ความช่วยเหลือ
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              เลือกหมวดหมู่ที่คุณต้องการความช่วยเหลือ
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard
              v-for="(category, index) in helpCategories"
              :key="category.title"
              class="cursor-pointer hover:shadow-lg transition-shadow"
              @click="selectedCategory = selectedCategory === index ? null : index"
            >
              <template #header>
                <div class="flex items-center gap-3">
                  <div
                    :class="`w-12 h-12 bg-${category.color}-100 dark:bg-${category.color}-900 rounded-lg flex items-center justify-center`"
                  >
                    <Icon :name="category.icon" :class="`w-6 h-6 text-${category.color}-600`" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ category.title }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ category.description }}
                    </p>
                  </div>
                </div>
              </template>

              <!-- Articles List -->
              <div
                v-if="selectedCategory === index"
                class="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <a
                  v-for="article in category.articles"
                  :key="article"
                  href="#"
                  class="block text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ article }}
                </a>
              </div>

              <template #footer>
                <div class="text-sm text-gray-500 dark:text-gray-500">
                  {{ category.articles.length }} บทความ
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ลิงก์ด่วน
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              เข้าถึงฟีเจอร์ที่ใช้บ่อยได้อย่างรวดเร็ว
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UCard
              v-for="link in quickLinks"
              :key="link.title"
            >
              <NuxtLink :to="link.link" class="block text-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon :name="link.icon" class="w-6 h-6 text-blue-600" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ link.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ link.description }}
                </p>
              </NuxtLink>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Options -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ต้องการความช่วยเหลือเพิ่มเติม?
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              ทีมงานของเรายินดีให้บริการคุณ
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <UCard
              v-for="option in supportOptions"
              :key="option.title"
            >
              <div class="text-center py-6">
                <div
                  :class="`w-16 h-16 bg-${option.color}-100 dark:bg-${option.color}-900 rounded-full flex items-center justify-center mx-auto mb-4`"
                >
                  <Icon :name="option.icon" :class="`w-8 h-8 text-${option.color}-600`" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ option.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  {{ option.description }}
                </p>
                <UButton
                  v-if="option.link"
                  :to="option.link"
                  :color="option.color"
                  size="lg"
                >
                  {{ option.action }}
                </UButton>
                <UButton
                  v-else
                  :color="option.color"
                  size="lg"
                >
                  {{ option.action }}
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Articles -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              บทความยอดนิยม
            </h2>
          </div>

          <UCard>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <a href="#" class="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 -mx-4 rounded-lg transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Icon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                    <span class="text-gray-900 dark:text-white">วิธีสร้างธุรกรรมใหม่อย่างละเอียด</span>
                  </div>
                  <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
              </a>

              <a href="#" class="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 -mx-4 rounded-lg transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Icon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                    <span class="text-gray-900 dark:text-white">การจัดการกับข้อพิพาท</span>
                  </div>
                  <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
              </a>

              <a href="#" class="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 -mx-4 rounded-lg transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Icon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                    <span class="text-gray-900 dark:text-white">เคล็ดลับการซื้อขายอย่างปลอดภัย</span>
                  </div>
                  <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
              </a>

              <a href="#" class="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 -mx-4 rounded-lg transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Icon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                    <span class="text-gray-900 dark:text-white">ค่าธรรมเนียมและวิธีการคำนวณ</span>
                  </div>
                  <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
              </a>

              <a href="#" class="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 -mx-4 rounded-lg transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Icon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                    <span class="text-gray-900 dark:text-white">การรักษาความปลอดภัยบัญชี</span>
                  </div>
                  <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
                </div>
              </a>
            </div>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>
