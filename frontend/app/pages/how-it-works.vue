<script setup lang="ts">
useHead({
  title: 'วิธีการใช้งาน - DaiSure',
  meta: [
    { name: 'description', content: 'เรียนรู้วิธีการใช้งาน DaiSure บริการรับฝากเงินค้ำประกันการซื้อขายออนไลน์อย่างง่ายดาย' }
  ]
})

const steps = [
  {
    number: '1',
    title: 'สร้างธุรกรรม',
    description: 'ผู้ขายหรือผู้ซื้อสร้างธุรกรรมใหม่ โดยระบุรายละเอียดสินค้า ราคา และข้อตกลง',
    icon: 'i-heroicons-plus-circle',
    color: 'blue'
  },
  {
    number: '2',
    title: 'ผู้ซื้อชำระเงิน',
    description: 'ผู้ซื้อโอนเงินเข้าบัญชี DaiSure พร้อมแนบหลักฐานการโอนเงิน',
    icon: 'i-heroicons-credit-card',
    color: 'green'
  },
  {
    number: '3',
    title: 'ตรวจสอบการชำระเงิน',
    description: 'ระบบตรวจสอบการชำระเงิน เมื่อยืนยันแล้วจะแจ้งเตือนผู้ขายให้จัดส่งสินค้า',
    icon: 'i-heroicons-clipboard-document-check',
    color: 'purple'
  },
  {
    number: '4',
    title: 'ผู้ขายจัดส่งสินค้า',
    description: 'ผู้ขายจัดส่งสินค้าและอัพเดทเลขพัสดุในระบบ',
    icon: 'i-heroicons-truck',
    color: 'orange'
  },
  {
    number: '5',
    title: 'ผู้ซื้อรับสินค้า',
    description: 'ผู้ซื้อได้รับสินค้าและตรวจสอบความถูกต้อง จากนั้นยืนยันการรับสินค้า',
    icon: 'i-heroicons-check-circle',
    color: 'indigo'
  },
  {
    number: '6',
    title: 'โอนเงินให้ผู้ขาย',
    description: 'เมื่อผู้ซื้อยืนยันแล้ว ระบบจะโอนเงินให้กับผู้ขายทันที',
    icon: 'i-heroicons-banknotes',
    color: 'teal'
  }
]

const features = [
  {
    title: 'ระบบแจ้งเตือนอัตโนมัติ',
    description: 'รับการแจ้งเตือนทุกขั้นตอนของธุรกรรมแบบ Real-time',
    icon: 'i-heroicons-bell-alert'
  },
  {
    title: 'ติดตามสถานะ',
    description: 'ตรวจสอบสถานะธุรกรรมได้ตลอดเวลา',
    icon: 'i-heroicons-eye'
  },
  {
    title: 'ระบบรีวิว',
    description: 'ให้คะแนนและรีวิวหลังการทำธุรกรรมเสร็จสิ้น',
    icon: 'i-heroicons-star'
  },
  {
    title: 'ช่วยเหลือตลอด 24/7',
    description: 'ทีมงานพร้อมช่วยเหลือทุกปัญหา',
    icon: 'i-heroicons-chat-bubble-left-right'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            วิธีการใช้งาน DaiSure
          </h1>
          <p class="text-xl text-blue-100">
            เริ่มต้นการซื้อขายอย่างปลอดภัยด้วยขั้นตอนง่ายๆ เพียง 6 ขั้นตอน
          </p>
        </div>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ขั้นตอนการใช้งาน
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              ทำตามขั้นตอนเหล่านี้เพื่อการซื้อขายที่ปลอดภัย
            </p>
          </div>

          <div class="space-y-8">
            <div
              v-for="(step, index) in steps"
              :key="step.number"
              class="relative"
            >
              <!-- Connector Line -->
              <div
                v-if="index < steps.length - 1"
                class="absolute left-8 top-20 w-0.5 h-24 bg-gray-300 dark:bg-gray-700 hidden md:block"
              />

              <UCard>
                <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <!-- Step Number -->
                  <div
                    :class="`flex-shrink-0 w-16 h-16 bg-${step.color}-100 dark:bg-${step.color}-900 rounded-full flex items-center justify-center`"
                  >
                    <span :class="`text-2xl font-bold text-${step.color}-600`">
                      {{ step.number }}
                    </span>
                  </div>

                  <!-- Step Content -->
                  <div class="flex-1">
                    <div class="flex items-start gap-4">
                      <div
                        :class="`flex-shrink-0 w-12 h-12 bg-${step.color}-100 dark:bg-${step.color}-900 rounded-lg flex items-center justify-center`"
                      >
                        <Icon :name="step.icon" :class="`w-6 h-6 text-${step.color}-600`" />
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {{ step.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                          {{ step.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ฟีเจอร์เพิ่มเติม
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              ความสะดวกที่มากกว่าการรับฝากเงินทั่วไป
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <UCard v-for="feature in features" :key="feature.title">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Icon :name="feature.icon" class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Safety Tips Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <UCard>
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-yellow-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  เคล็ดลับความปลอดภัย
                </h2>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    ตรวจสอบข้อมูลผู้ใช้
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    ดูประวัติและคะแนนรีวิวของคู่ค้าก่อนทำธุรกรรม
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    อ่านรายละเอียดให้ครบถ้วน
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    ตรวจสอบรายละเอียดสินค้าและเงื่อนไขการซื้อขายให้ชัดเจน
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    ถ่ายรูปหลักฐาน
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    ถ่ายภาพสินค้าก่อนจัดส่งและหลังได้รับเพื่อเป็นหลักฐาน
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    ติดต่อผ่านระบบ
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    สื่อสารกันผ่านระบบแชทของ DaiSure เพื่อความปลอดภัย
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            สร้างธุรกรรมแรกของคุณวันนี้
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/auth/register"
              size="xl"
              color="white"
              variant="solid"
            >
              เริ่มต้นใช้งาน
            </UButton>
            <UButton
              to="/faq"
              size="xl"
              color="white"
              variant="outline"
            >
              ดูคำถามที่พบบ่อย
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
