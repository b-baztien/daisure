<script setup lang="ts">
useHead({
  title: 'ค่าบริการ - DaiSure',
  meta: [
    { name: 'description', content: 'ค่าบริการ DaiSure โปร่งใส ยุติธรรม ไม่มีค่าใช้จ่ายแอบแฝง' }
  ]
})

const pricingTiers = [
  {
    name: 'ฟรี',
    description: 'สำหรับผู้ใช้งานทั่วไป',
    price: '0',
    features: [
      'สร้างธุรกรรมได้ไม่จำกัด',
      'ค่าธรรมเนียม 3% ต่อธุรกรรม',
      'การแจ้งเตือนพื้นฐาน',
      'ระบบรีวิว',
      'ช่วยเหลือทาง Email'
    ],
    cta: 'เริ่มต้นใช้งาน',
    ctaLink: '/auth/register',
    highlighted: false
  },
  {
    name: 'Pro',
    description: 'สำหรับผู้ขายมืออาชีพ',
    price: '499',
    priceUnit: '/เดือน',
    features: [
      'ทุกอย่างใน Free',
      'ค่าธรรมเนียม 2% ต่อธุรกรรม',
      'โอนเงินเร็วขึ้น (1 วัน)',
      'การแจ้งเตือนแบบ Real-time',
      'ตราสัญลักษณ์ Pro',
      'รายงานสถิติขั้นสูง',
      'ช่วยเหลือทาง Chat ตลอด 24/7'
    ],
    cta: 'อัพเกรดเป็น Pro',
    ctaLink: '/auth/register?plan=pro',
    highlighted: true
  },
  {
    name: 'Enterprise',
    description: 'สำหรับองค์กรขนาดใหญ่',
    price: 'ติดต่อเรา',
    features: [
      'ทุกอย่างใน Pro',
      'ค่าธรรมเนียมพิเศษ (เจรจาได้)',
      'API สำหรับผสานระบบ',
      'ผู้จัดการบัญชีเฉพาะ',
      'การฝึกอบรมทีมงาน',
      'SLA 99.9%',
      'รายงานที่ปรับแต่งได้',
      'ช่วยเหลือแบบเฉพาะทาง'
    ],
    cta: 'ติดต่อฝ่ายขาย',
    ctaLink: '/contact',
    highlighted: false
  }
]

const feeDetails = [
  {
    title: 'ค่าธรรมเนียมธุรกรรม',
    free: '3%',
    pro: '2%',
    enterprise: 'เจรจาได้'
  },
  {
    title: 'ระยะเวลาโอนเงิน',
    free: '3-5 วันทำการ',
    pro: '1 วันทำการ',
    enterprise: 'ทันที'
  },
  {
    title: 'ค่าธรรมเนียมการถอนเงิน',
    free: '฿20',
    pro: 'ฟรี',
    enterprise: 'ฟรี'
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
            ค่าบริการที่โปร่งใส
          </h1>
          <p class="text-xl text-blue-100">
            เลือกแพ็คเกจที่เหมาะสมกับความต้องการของคุณ
          </p>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <UCard
            v-for="tier in pricingTiers"
            :key="tier.name"
            :class="tier.highlighted ? 'ring-2 ring-blue-600 shadow-xl scale-105' : ''"
          >
            <template #header>
              <div class="text-center py-4">
                <div
                  v-if="tier.highlighted"
                  class="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4"
                >
                  แนะนำ
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ tier.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  {{ tier.description }}
                </p>
                <div class="flex items-end justify-center gap-1">
                  <span class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    <span v-if="tier.price !== 'ติดต่อเรา'">฿</span>{{ tier.price }}
                  </span>
                  <span v-if="tier.priceUnit" class="text-gray-600 dark:text-gray-400 mb-2">
                    {{ tier.priceUnit }}
                  </span>
                </div>
              </div>
            </template>

            <div class="space-y-4 py-6">
              <div
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-start gap-3"
              >
                <Icon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                />
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>

            <template #footer>
              <UButton
                :to="tier.ctaLink"
                :color="tier.highlighted ? 'primary' : 'gray'"
                :variant="tier.highlighted ? 'solid' : 'outline'"
                size="lg"
                block
              >
                {{ tier.cta }}
              </UButton>
            </template>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Fee Details -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              รายละเอียดค่าธรรมเนียม
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              เปรียบเทียบค่าธรรมเนียมและข้อดีของแต่ละแพ็คเกจ
            </p>
          </div>

          <UCard>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      รายการ
                    </th>
                    <th class="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      ฟรี
                    </th>
                    <th class="text-center py-4 px-4 font-semibold text-blue-600">
                      Pro
                    </th>
                    <th class="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(detail, index) in feeDetails"
                    :key="detail.title"
                    :class="index !== feeDetails.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''"
                  >
                    <td class="py-4 px-4 text-gray-900 dark:text-white">
                      {{ detail.title }}
                    </td>
                    <td class="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                      {{ detail.free }}
                    </td>
                    <td class="py-4 px-4 text-center text-blue-600 font-semibold">
                      {{ detail.pro }}
                    </td>
                    <td class="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                      {{ detail.enterprise }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              คำถามที่พบบ่อยเกี่ยวกับค่าบริการ
            </h2>
          </div>

          <div class="space-y-4">
            <UCard>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                เมื่อไหร่ที่ต้องจ่ายค่าธรรมเนียม?
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                ค่าธรรมเนียมจะถูกหักจากยอดเงินที่โอนให้ผู้ขายเมื่อธุรกรรมเสร็จสมบูรณ์
                ไม่มีค่าใช้จ่ายในการสร้างบัญชีหรือสร้างธุรกรรม
              </p>
            </UCard>

            <UCard>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                สามารถยกเลิกแพ็คเกจ Pro ได้ไหม?
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                ได้ คุณสามารถยกเลิกได้ทุกเมื่อ ค่าบริการจะคำนวณตามจำนวนวันที่ใช้งานจริง
                และไม่มีการคิดค่าธรรมเนียมการยกเลิก
              </p>
            </UCard>

            <UCard>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                มีส่วนลดสำหรับการชำระรายปีไหม?
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                มี! หากชำระแบบรายปีจะได้ส่วนลด 20% หรือคิดเป็น ฿4,790 ต่อปี (ประหยัด ฿1,198)
              </p>
            </UCard>

            <UCard>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                จะอัพเกรดหรือดาวน์เกรดแพ็คเกจได้อย่างไร?
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                คุณสามารถเปลี่ยนแพ็คเกจได้ทุกเมื่อในหน้าการตั้งค่าบัญชี
                การเปลี่ยนแปลงจะมีผลทันทีและค่าธรรมเนียมจะคำนวณตามระยะเวลาที่ใช้งานจริง
              </p>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl font-bold mb-4">
            ยังมีคำถามเพิ่มเติม?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            ติดต่อทีมงานของเราได้ตลอดเวลา
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/contact"
              size="xl"
              color="white"
              variant="solid"
            >
              ติดต่อเรา
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
