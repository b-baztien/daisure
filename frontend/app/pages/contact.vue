<script setup lang="ts">
definePageMeta({
  layout: "blank"
})

useHead({
  title: 'ติดต่อเรา - DaiSure',
  meta: [
    { name: 'description', content: 'ติดต่อทีมงาน DaiSure - เรายินดีให้บริการและตอบคำถามของคุณ' }
  ]
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  type: 'general'
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const contactTypes = [
  { value: 'general', label: 'คำถามทั่วไป' },
  { value: 'technical', label: 'ปัญหาทางเทคนิค' },
  { value: 'transaction', label: 'เกี่ยวกับธุรกรรม' },
  { value: 'partnership', label: 'ความร่วมมือทางธุรกิจ' },
  { value: 'feedback', label: 'ข้อเสนอแนะ' }
]

const contactMethods = [
  {
    icon: 'i-heroicons-envelope',
    title: 'อีเมล',
    value: 'support@daisure.com',
    description: 'ส่งอีเมลถึงเรา ตอบภายใน 24 ชั่วโมง',
    color: 'blue'
  },
  {
    icon: 'i-heroicons-phone',
    title: 'โทรศัพท์',
    value: '02-XXX-XXXX',
    description: 'จันทร์-ศุกร์ 9:00-18:00 น.',
    color: 'green'
  },
  {
    icon: 'i-heroicons-chat-bubble-left-right',
    title: 'Live Chat',
    value: 'แชทสด',
    description: 'พูดคุยกับทีมงานแบบทันที',
    color: 'purple'
  },
  {
    icon: 'i-heroicons-map-pin',
    title: 'ที่อยู่',
    value: '123 ถนนสุขุมวิท กรุงเทพฯ',
    description: 'สำนักงานใหญ่',
    color: 'orange'
  }
]

const socialMedia = [
  {
    name: 'Facebook',
    icon: 'i-simple-icons-facebook',
    url: 'https://facebook.com/daisure',
    color: 'text-blue-600'
  },
  {
    name: 'Twitter',
    icon: 'i-simple-icons-twitter',
    url: 'https://twitter.com/daisure',
    color: 'text-sky-500'
  },
  {
    name: 'Line',
    icon: 'i-simple-icons-line',
    url: 'https://line.me/ti/p/@daisure',
    color: 'text-green-500'
  },
  {
    name: 'Instagram',
    icon: 'i-simple-icons-instagram',
    url: 'https://instagram.com/daisure',
    color: 'text-pink-600'
  }
]

async function handleSubmit() {
  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))

  isSubmitted.value = true
  isSubmitting.value = false

  // Reset form
  setTimeout(() => {
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    }
    isSubmitted.value = false
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            ติดต่อเรา
          </h1>
          <p class="text-xl text-blue-100">
            เรายินดีให้บริการและตอบคำถามของคุณ
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Methods -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ช่องทางการติดต่อ
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              เลือกช่องทางที่สะดวกสำหรับคุณ
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <UCard v-for="method in contactMethods" :key="method.title">
              <div class="text-center">
                <div
                  :class="`w-16 h-16 bg-${method.color}-100 dark:bg-${method.color}-900 rounded-full flex items-center justify-center mx-auto mb-4`"
                >
                  <Icon :name="method.icon" :class="`w-8 h-8 text-${method.color}-600`" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {{ method.title }}
                </h3>
                <p class="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  {{ method.value }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ method.description }}
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ส่งข้อความถึงเรา
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              กรอกแบบฟอร์มด้านล่าง เราจะตอบกลับโดยเร็วที่สุด
            </p>
          </div>

          <UCard>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  อีเมล *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภทการติดต่อ *
                </label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option v-for="type in contactTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  หัวเรื่อง *
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="เรื่องที่ต้องการติดต่อ"
                />
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ข้อความ *
                </label>
                <textarea
                  v-model="form.message"
                  required
                  rows="6"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="รายละเอียดที่ต้องการสอบถาม..."
                />
              </div>

              <!-- Success Message -->
              <div v-if="isSubmitted" class="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <Icon name="i-heroicons-check-circle" class="w-5 h-5" />
                  <span>ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด</span>
                </div>
              </div>

              <!-- Submit Button -->
              <UButton
                type="submit"
                size="lg"
                block
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
              </UButton>
            </form>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Social Media -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ติดตามเราบน Social Media
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              รับข่าวสารและอัพเดทล่าสุดจาก DaiSure
            </p>
          </div>

          <div class="flex justify-center gap-4">
            <a
              v-for="social in socialMedia"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-14 h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <Icon :name="social.icon" :class="`w-6 h-6 ${social.color}`" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Office Hours -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <UCard>
            <div class="text-center py-6">
              <Icon name="i-heroicons-clock" class="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                เวลาทำการ
              </h2>
              <div class="space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>จันทร์ - ศุกร์:</strong> 9:00 - 18:00 น.</p>
                <p><strong>เสาร์:</strong> 10:00 - 16:00 น.</p>
                <p><strong>อาทิตย์และวันหยุดนักขัตฤกษ์:</strong> ปิดทำการ</p>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-4">
                * ระบบ Live Chat พร้อมให้บริการตลอด 24/7
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>
