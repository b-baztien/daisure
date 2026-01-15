<script setup lang="ts">
definePageMeta({
  layout: "blank"
})

useHead({
  title: 'คำถามที่พบบ่อย - DaiSure',
  meta: [
    { name: 'description', content: 'คำถามที่พบบ่อยเกี่ยวกับ DaiSure บริการรับฝากเงินค้ำประกันการซื้อขายออนไลน์' }
  ]
})

const faqCategories = [
  {
    category: 'เกี่ยวกับบริการ',
    icon: 'i-heroicons-information-circle',
    questions: [
      {
        question: 'DaiSure คืออะไร?',
        answer: 'DaiSure คือแพลตฟอร์มรับฝากเงินค้ำประกันการซื้อขายออนไลน์ เราทำหน้าที่เป็นตัวกลางรับฝากเงินจากผู้ซื้อและโอนให้ผู้ขายเมื่อการทำธุรกรรมเสร็จสมบูรณ์ เพื่อสร้างความปลอดภัยและความไว้วางใจให้กับทั้งสองฝ่าย'
      },
      {
        question: 'DaiSure ปลอดภัยแค่ไหน?',
        answer: 'เรามีระบบรักษาความปลอดภัยระดับธนาคาร ใช้การเข้ารหัสข้อมูล SSL และมีทีมงานตรวจสอบธุรกรรมตลอด 24/7 เงินของคุณจะถูกเก็บไว้ในบัญชีแยกต่างหากและมีประกันจากสถาบันการเงินชั้นนำ'
      },
      {
        question: 'ใครสามารถใช้บริการ DaiSure ได้บ้าง?',
        answer: 'ทุกคนที่ต้องการซื้อขายออนไลน์อย่างปลอดภัยสามารถใช้บริการได้ ไม่ว่าจะเป็นผู้ซื้อหรือผู้ขาย เพียงแค่สมัครสมาชิกและยืนยันตัวตน'
      }
    ]
  },
  {
    category: 'การใช้งาน',
    icon: 'i-heroicons-cog-6-tooth',
    questions: [
      {
        question: 'ต้องสมัครสมาชิกก่อนใช้งานไหม?',
        answer: 'ใช่ คุณต้องสมัครสมาชิกและยืนยันตัวตนก่อนที่จะสามารถสร้างธุรกรรมได้ การสมัครสมาชิกฟรีและใช้เวลาเพียงไม่กี่นาที'
      },
      {
        question: 'วิธีสร้างธุรกรรมใหม่?',
        answer: 'หลังจากล็อกอินแล้ว ไปที่หน้า "สร้างธุรกรรมใหม่" กรอกรายละเอียดสินค้า ราคา และข้อตกลง จากนั้นแชร์ลิงก์ให้คู่ค้าของคุณเพื่อยืนยันและดำเนินการต่อ'
      },
      {
        question: 'ใช้เวลานานแค่ไหนในการทำธุรกรรม?',
        answer: 'โดยปกติใช้เวลา 3-7 วันทำการ ขึ้นอยู่กับความเร็วในการชำระเงิน การจัดส่งสินค้า และการยืนยันจากทั้งสองฝ่าย สมาชิก Pro สามารถรับเงินได้เร็วขึ้นภายใน 1 วันทำการ'
      },
      {
        question: 'สามารถยกเลิกธุรกรรมได้ไหม?',
        answer: 'ได้ แต่ต้องได้รับความยินยอมจากทั้งสองฝ่าย หากยกเลิกก่อนชำระเงิน จะไม่มีค่าธรรมเนียม แต่ถ้ายกเลิกหลังชำระเงินแล้ว อาจมีค่าธรรมเนียมการยกเลิก'
      }
    ]
  },
  {
    category: 'การชำระเงิน',
    icon: 'i-heroicons-credit-card',
    questions: [
      {
        question: 'รองรับการชำระเงินแบบไหนบ้าง?',
        answer: 'รองรับการโอนเงินผ่านธนาคารไทยทุกธนาคาร และกำลังพัฒนาระบบชำระเงินผ่าน QR Code และ Mobile Banking'
      },
      {
        question: 'ค่าธรรมเนียมเท่าไหร่?',
        answer: 'สมาชิกฟรีคิดค่าธรรมเนียม 3% ต่อธุรกรรม สมาชิก Pro คิด 2% และ Enterprise สามารถเจรจาได้ ค่าธรรมเนียมจะถูกหักจากยอดเงินที่โอนให้ผู้ขาย'
      },
      {
        question: 'เงินจะถูกโอนให้ผู้ขายเมื่อไหร่?',
        answer: 'เงินจะถูกโอนให้ผู้ขายหลังจากที่ผู้ซื้อยืนยันการรับสินค้าแล้ว หรือหลังจากครบกำหนด 7 วัน นับจากวันที่ผู้ขายยืนยันการจัดส่ง (หากผู้ซื้อไม่ได้ยืนยัน)'
      },
      {
        question: 'ถอนเงินได้อย่างไร?',
        answer: 'ไปที่หน้า "กระเป๋าเงิน" เลือก "ถอนเงิน" กรอกจำนวนเงินและบัญชีธนาคารที่ต้องการรับเงิน เงินจะเข้าบัญชีภายใน 1-3 วันทำการ'
      }
    ]
  },
  {
    category: 'ความปลอดภัย',
    icon: 'i-heroicons-shield-check',
    questions: [
      {
        question: 'ถ้าผู้ขายไม่ส่งสินค้าจะทำอย่างไร?',
        answer: 'คุณสามารถเปิดข้อพิพาทได้ภายใน 7 วันหลังจากวันที่ควรได้รับสินค้า ทีมงานจะตรวจสอบและดำเนินการคืนเงินให้หากพิสูจน์ได้ว่าผู้ขายไม่ได้ส่งสินค้า'
      },
      {
        question: 'ถ้าสินค้าไม่ตรงตามที่ตกลง?',
        answer: 'อย่ารีบยืนยันการรับสินค้า ให้เปิดข้อพิพาทและแจ้งปัญหาพร้อมหลักฐาน ทีมงานจะเข้ามาไกล่เกลี่ยและตัดสินตามหลักฐานที่ได้รับ'
      },
      {
        question: 'ข้อมูลส่วนตัวปลอดภัยไหม?',
        answer: 'ปลอดภัย เราไม่เปิดเผยข้อมูลส่วนตัวของคุณกับบุคคลที่สาม มีการเข้ารหัสข้อมูลทุกการสื่อสาร และปฏิบัติตามมาตรฐาน PDPA อย่างเคร่งครัด'
      },
      {
        question: 'มีการประกันเงินไหม?',
        answer: 'มี เงินของคุณจะถูกเก็บในบัญชีแยกต่างหากที่มีประกันจากสถาบันการเงินชั้นนำ และมีการตรวจสอบโดยผู้สอบบัญชีอิสระ'
      }
    ]
  },
  {
    category: 'บัญชีและสมาชิก',
    icon: 'i-heroicons-user-circle',
    questions: [
      {
        question: 'ลืมรหัสผ่านต้องทำอย่างไร?',
        answer: 'คลิก "ลืมรหัสผ่าน" ที่หน้าเข้าสู่ระบบ กรอกอีเมล์ที่ใช้สมัครสมาชิก เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้ทางอีเมล์'
      },
      {
        question: 'เปลี่ยนข้อมูลส่วนตัวได้ไหม?',
        answer: 'ได้ ไปที่หน้า "โปรไฟล์" คุณสามารถแก้ไขข้อมูลส่วนตัว รูปโปรไฟล์ และข้อมูลบัญชีธนาคารได้ แต่การเปลี่ยนชื่อ-นามสกุลต้องติดต่อทีมงาน'
      },
      {
        question: 'ลบบัญชีได้ไหม?',
        answer: 'ได้ แต่ต้องแน่ใจว่าไม่มีธุรกรรมที่ค้างอยู่ และถอนเงินทั้งหมดออกแล้ว ติดต่อทีมงานเพื่อขอลบบัญชี'
      },
      {
        question: 'คะแนนรีวิวคำนวณอย่างไร?',
        answer: 'คะแนนรีวิวเฉลี่ยจากการให้คะแนนของคู่ค้าหลังจากธุรกรรมเสร็จสิ้น แยกเป็นคะแนนในฐานะผู้ซื้อและผู้ขาย คะแนนจะช่วยสร้างความน่าเชื่อถือ'
      }
    ]
  }
]

const selectedCategory = ref(0)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p class="text-xl text-blue-100">
            หาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับ DaiSure
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Category Tabs -->
          <div class="flex flex-wrap gap-2 mb-8 justify-center">
            <UButton
              v-for="(cat, index) in faqCategories"
              :key="cat.category"
              :variant="selectedCategory === index ? 'solid' : 'outline'"
              :color="selectedCategory === index ? 'primary' : 'gray'"
              size="lg"
              @click="selectedCategory = index"
            >
              <Icon :name="cat.icon" class="w-5 h-5 mr-2" />
              {{ cat.category }}
            </UButton>
          </div>

          <!-- Questions -->
          <div class="space-y-4">
            <UCard
              v-for="(qa, index) in faqCategories[selectedCategory].questions"
              :key="index"
            >
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-bold">Q</span>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white pt-1">
                    {{ qa.question }}
                  </h3>
                </div>
                <div class="flex items-start gap-3 pl-11">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center -ml-11">
                    <span class="text-green-600 font-bold">A</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 pt-1">
                    {{ qa.answer }}
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Still Have Questions -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <UCard>
            <div class="text-center py-8">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="i-heroicons-question-mark-circle" class="w-8 h-8 text-blue-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ยังหาคำตอบไม่เจอ?
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
                ทีมงานของเรายินดีช่วยเหลือคุณ
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <UButton
                  to="/contact"
                  size="lg"
                  color="primary"
                  variant="solid"
                >
                  <Icon name="i-heroicons-envelope" class="w-5 h-5 mr-2" />
                  ติดต่อเรา
                </UButton>
                <UButton
                  to="/support"
                  size="lg"
                  color="gray"
                  variant="outline"
                >
                  <Icon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 mr-2" />
                  ศูนย์ช่วยเหลือ
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              หน้าที่เกี่ยวข้อง
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UCard>
              <NuxtLink to="/how-it-works" class="block text-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Icon name="i-heroicons-academic-cap" class="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                  วิธีการใช้งาน
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  เรียนรู้วิธีใช้งาน
                </p>
              </NuxtLink>
            </UCard>

            <UCard>
              <NuxtLink to="/pricing" class="block text-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Icon name="i-heroicons-currency-dollar" class="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                  ค่าบริการ
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ดูอัตราค่าบริการ
                </p>
              </NuxtLink>
            </UCard>

            <UCard>
              <NuxtLink to="/terms" class="block text-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Icon name="i-heroicons-document-text" class="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                  ข้อกำหนดการใช้งาน
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  อ่านข้อกำหนด
                </p>
              </NuxtLink>
            </UCard>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
