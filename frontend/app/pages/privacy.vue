<script setup lang="ts">
definePageMeta({
  layout: "blank"
})

useHead({
  title: 'นโยบายความเป็นส่วนตัว - DaiSure',
  meta: [
    { name: 'description', content: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของ DaiSure' }
  ]
})

const sections = [
  {
    title: '1. ข้อมูลที่เราเก็บรวบรวม',
    content: `เราเก็บรวบรวมข้อมูลส่วนบุคคลของคุณเมื่อคุณ:

• สมัครสมาชิกและสร้างบัญชี
• ใช้บริการของเรา
• ติดต่อเรา
• เข้าร่วมกิจกรรมหรือโปรโมชัน

ข้อมูลที่เราเก็บรวบรวมรวมถึง:

**ข้อมูลส่วนบุคคล:**
- ชื่อ-นามสกุล
- อีเมล์
- หมายเลขโทรศัพท์
- วันเกิด
- หมายเลขบัตรประชาชน (สำหรับการยืนยันตัวตน)

**ข้อมูลทางการเงิน:**
- ข้อมูลบัญชีธนาคาร
- ประวัติการทำธุรกรรม
- ข้อมูลการชำระเงิน

**ข้อมูลการใช้งาน:**
- ข้อมูลอุปกรณ์ (IP address, browser type)
- ข้อมูล cookies
- บันทึกการใช้งานบนแพลตฟอร์ม`,
    icon: 'i-heroicons-document-text'
  },
  {
    title: '2. วัตถุประสงค์ในการใช้ข้อมูล',
    content: `เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อ:

• **ให้บริการ:** ดำเนินการและจัดการธุรกรรมของคุณ ตรวจสอบความถูกต้องของข้อมูล และประมวลผลการชำระเงิน

• **ยืนยันตัวตน:** ตรวจสอบและยืนยันตัวตนของคุณเพื่อป้องกันการทุจริตและรักษาความปลอดภัย

• **ปรับปรุงบริการ:** วิเคราะห์การใช้งานเพื่อพัฒนาและปรับปรุงบริการของเรา

• **การสื่อสาร:** ส่งการแจ้งเตือนเกี่ยวกับธุรกรรม ข่าวสาร และข้อมูลโปรโมชัน

• **ความปลอดภัย:** ตรวจสอบและป้องกันการฉ้อโกง กิจกรรมที่ผิดกฎหมาย หรือการละเมิดข้อกำหนดการใช้งาน

• **ปฏิบัติตามกฎหมาย:** ดำเนินการตามข้อกำหนดทางกฎหมายและระเบียบข้อบังคับ`,
    icon: 'i-heroicons-light-bulb'
  },
  {
    title: '3. การแบ่งปันข้อมูล',
    content: `เราจะไม่เปิดเผยหรือแบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สาม ยกเว้น:

• **คู่ค้าในธุรกรรม:** เราอาจแบ่งปันข้อมูลที่จำเป็นกับคู่ค้าของคุณในธุรกรรมเพื่อให้การทำธุรกรรมสำเร็จ

• **ผู้ให้บริการ:** เราอาจใช้บริษัทบุคคลที่สามเพื่อช่วยในการดำเนินงาน เช่น ระบบชำระเงิน การเก็บข้อมูล หรือการวิเคราะห์

• **ตามกฎหมาย:** เมื่อมีความจำเป็นตามกฎหมาย คำสั่งศาล หรือกระบวนการทางกฎหมาย

• **ปกป้องสิทธิ์:** เพื่อปกป้องสิทธิ์ ทรัพย์สิน หรือความปลอดภัยของ DaiSure ผู้ใช้ของเรา หรือสาธารณะ

• **การควบรวมกิจการ:** ในกรณีที่มีการควบรวมกิจการ ขายกิจการ หรือการโอนสินทรัพย์`,
    icon: 'i-heroicons-share'
  },
  {
    title: '4. การรักษาความปลอดภัยของข้อมูล',
    content: `เราให้ความสำคัญกับการรักษาความปลอดภัยของข้อมูลส่วนบุคคลของคุณ เราใช้มาตรการดังนี้:

• **การเข้ารหัส:** ใช้ SSL/TLS encryption สำหรับการส่งข้อมูลทั้งหมด

• **การควบคุมการเข้าถึง:** จำกัดการเข้าถึงข้อมูลเฉพาะบุคลากรที่มีความจำเป็นเท่านั้น

• **การตรวจสอบ:** มีระบบตรวจสอบและบันทึกการเข้าถึงข้อมูลอย่างสม่ำเสมอ

• **ไฟร์วอลล์:** ใช้ไฟร์วอลล์และระบบป้องกันการบุกรุก

• **การสำรองข้อมูล:** มีระบบสำรองข้อมูลเพื่อป้องกันการสูญหาย

• **การฝึกอบรม:** ฝึกอบรมพนักงานเกี่ยวกับการรักษาความปลอดภัยและความเป็นส่วนตัว

แม้ว่าเราจะใช้มาตรการรักษาความปลอดภัยที่เหมาะสม แต่ไม่มีระบบใดที่ปลอดภัย 100% เราขอแนะนำให้คุณใช้รหัสผ่านที่รัดกุมและไม่แบ่งปันกับผู้อื่น`,
    icon: 'i-heroicons-shield-check'
  },
  {
    title: '5. การใช้ Cookies',
    content: `เราใช้ cookies และเทคโนโลยีที่คล้ายกันเพื่อ:

• จดจำการตั้งค่าและความชอบของคุณ
• ตรวจสอบและวิเคราะห์การใช้งาน
• ปรับปรุงประสบการณ์การใช้งาน
• รักษาความปลอดภัยของบัญชี

**ประเภทของ Cookies:**

• **Cookies ที่จำเป็น:** จำเป็นสำหรับการทำงานของเว็บไซต์
• **Cookies สำหรับประสิทธิภาพ:** ช่วยปรับปรุงการทำงานของเว็บไซต์
• **Cookies สำหรับการตลาด:** ใช้สำหรับการโฆษณาที่ตรงกับความสนใจ

คุณสามารถตั้งค่าเบราว์เซอร์เพื่อปฏิเสธ cookies ได้ แต่อาจส่งผลต่อการใช้งานบางฟีเจอร์`,
    icon: 'i-heroicons-cookie'
  },
  {
    title: '6. สิทธิ์ของคุณ',
    content: `ตามพระราคบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) คุณมีสิทธิ์:

• **เข้าถึงข้อมูล:** ขอเข้าถึงและรับสำเนาข้อมูลส่วนบุคคลของคุณ

• **แก้ไขข้อมูล:** ขอให้แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์

• **ลบข้อมูล:** ขอให้ลบข้อมูลส่วนบุคคลของคุณในบางกรณี

• **จำกัดการประมวลผล:** ขอให้จำกัดการใช้ข้อมูลของคุณ

• **โอนย้ายข้อมูล:** ขอรับข้อมูลในรูปแบบที่สามารถอ่านได้ด้วยเครื่องจักร

• **คัดค้าน:** คัดค้านการประมวลผลข้อมูลในบางกรณี

• **ถอนความยินยอม:** ถอนความยินยอมที่เคยให้ไว้ได้ตลอดเวลา

หากต้องการใช้สิทธิ์ใดๆ กรุณาติดต่อเราที่ privacy@daisure.com`,
    icon: 'i-heroicons-hand-raised'
  },
  {
    title: '7. การเก็บรักษาข้อมูล',
    content: `เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณตามระยะเวลาที่จำเป็นเพื่อ:

• ให้บริการตามที่คุณร้องขอ
• ปฏิบัติตามข้อผูกพันทางกฎหมายและระเบียบข้อบังคับ
• แก้ไขข้อพิพาทและบังคับใช้ข้อตกลง

โดยทั่วไป:
• ข้อมูลบัญชีจะเก็บไว้ตลอดที่คุณใช้บริการ
• ข้อมูลธุรกรรมจะเก็บไว้อย่างน้อย 5 ปีตามกฎหมาย
• บันทึกการสื่อสารจะเก็บไว้ 2 ปี

หลังจากพ้นระยะเวลาเก็บรักษา เราจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้`,
    icon: 'i-heroicons-clock'
  },
  {
    title: '8. การโอนข้อมูลไปต่างประเทศ',
    content: `ข้อมูลส่วนบุคคลของคุณจะถูกเก็บและประมวลผลในประเทศไทย

ในบางกรณี เราอาจจำเป็นต้องโอนข้อมูลไปยังประเทศอื่นเพื่อ:
• ใช้บริการของผู้ให้บริการที่ตั้งอยู่ต่างประเทศ
• ปฏิบัติตามข้อผูกพันตามสัญญา

เมื่อมีการโอนข้อมูล เราจะมั่นใจว่ามีมาตรการคุ้มครองที่เหมาะสมตามที่กฎหมายกำหนด`,
    icon: 'i-heroicons-globe-alt'
  },
  {
    title: '9. นโยบายสำหรับเด็ก',
    content: `บริการของเราไม่ได้มีวัตถุประสงค์สำหรับผู้ที่มีอายุต่ำกว่า 18 ปี

เราไม่เจตนาเก็บรวบรวมข้อมูลส่วนบุคคลจากเด็กอายุต่ำกว่า 18 ปี หากเราทราบว่าได้รับข้อมูลจากเด็กโดยไม่ได้ตั้งใจ เราจะดำเนินการลบข้อมูลนั้นทันที

หากคุณเป็นผู้ปกครองและทราบว่าบุตรหลานของคุณได้ให้ข้อมูลแก่เรา กรุณาติดต่อเราทันที`,
    icon: 'i-heroicons-user-group'
  },
  {
    title: '10. การเปลี่ยนแปลงนโยบาย',
    content: `เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราวเพื่อสะท้อนการเปลี่ยนแปลงในแนวปฏิบัติของเรา เทคโนโลยี หรือข้อกำหนดทางกฎหมาย

เมื่อมีการเปลี่ยนแปลงที่สำคัญ เราจะ:
• อัพเดทวันที่ "แก้ไขล่าสุด" ที่ด้านบนของนโยบาย
• แจ้งให้คุณทราบผ่านทางอีเมล์หรือการแจ้งเตือนบนแพลตฟอร์ม
• ขอความยินยอมใหม่หากจำเป็น

เราขอแนะนำให้คุณตรวจสอบนโยบายนี้เป็นระยะๆ เพื่อรับทราบข้อมูลล่าสุด`,
    icon: 'i-heroicons-arrow-path'
  },
  {
    title: '11. การติดต่อเรา',
    content: `หากคุณมีคำถามหรือข้อกังวลเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิ์ของคุณ กรุณาติดต่อเราได้ที่:

**เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)**

อีเมล: privacy@daisure.com
โทรศัพท์: 02-XXX-XXXX
ที่อยู่: 123 ถนนสุขุมวิท กรุงเทพฯ 10110

เวลาทำการ: จันทร์-ศุกร์ 9:00-18:00 น.

เราจะพยายามตอบกลับคำขอของคุณภายใน 30 วัน`,
    icon: 'i-heroicons-envelope'
  }
]

const lastUpdated = '1 มกราคม 2567'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p class="text-xl text-purple-100">
            เราให้ความสำคัญกับความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของคุณ
          </p>
          <p class="text-sm text-purple-200 mt-4">
            แก้ไขล่าสุด: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <UCard class="mb-8">
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-lg text-gray-700 dark:text-gray-300">
                นโยบายความเป็นส่วนตัวฉบับนี้อธิบายวิธีที่ DaiSure ("เรา" "ของเรา") เก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของคุณ
                เมื่อคุณใช้บริการของเรา คุณยอมรับแนวทางปฏิบัติที่อธิบายไว้ในนโยบายนี้
              </p>
              <p class="text-lg text-gray-700 dark:text-gray-300">
                เราปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และกฎหมายที่เกี่ยวข้องทั้งหมด
              </p>
            </div>
          </UCard>

          <!-- Privacy Sections -->
          <div class="space-y-6">
            <UCard v-for="section in sections" :key="section.title">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon :name="section.icon" class="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ section.title }}
                  </h2>
                </div>
              </template>

              <div class="prose dark:prose-invert max-w-none">
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {{ section.content }}
                </p>
              </div>
            </UCard>
          </div>

          <!-- PDPA Notice -->
          <UCard class="mt-8">
            <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-shield-check" class="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    การปฏิบัติตาม PDPA
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300">
                    DaiSure ปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act - PDPA) อย่างเคร่งครัด
                    เรามีมาตรการและกระบวนการที่เหมาะสมเพื่อคุ้มครองข้อมูลส่วนบุคคลของคุณและให้คุณสามารถใช้สิทธิ์ของคุณตามกฎหมายได้อย่างเต็มที่
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Your Rights Summary -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              สรุปสิทธิ์ของคุณ
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              คุณมีสิทธิ์ในการควบคุมข้อมูลส่วนบุคคลของคุณ
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <UCard>
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="i-heroicons-eye" class="w-6 h-6 text-blue-600" />
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                  เข้าถึงข้อมูล
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ขอดูและรับสำเนาข้อมูลของคุณ
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="i-heroicons-pencil-square" class="w-6 h-6 text-green-600" />
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                  แก้ไขข้อมูล
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ขอแก้ไขข้อมูลที่ไม่ถูกต้อง
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="text-center">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="i-heroicons-trash" class="w-6 h-6 text-red-600" />
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                  ลบข้อมูล
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ขอให้ลบข้อมูลของคุณ
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="i-heroicons-arrow-down-tray" class="w-6 h-6 text-purple-600" />
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                  โอนย้ายข้อมูล
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ขอรับข้อมูลในรูปแบบที่ใช้งานได้
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="text-center">
                <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="i-heroicons-hand-raised" class="w-6 h-6 text-orange-600" />
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                  คัดค้าน
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  คัดค้านการใช้ข้อมูลของคุณ
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="text-center">
                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="i-heroicons-x-circle" class="w-6 h-6 text-indigo-600" />
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">
                  ถอนความยินยอม
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ถอนความยินยอมได้ตลอดเวลา
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Links -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              เอกสารที่เกี่ยวข้อง
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UCard>
              <NuxtLink to="/terms" class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Icon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      ข้อกำหนดการใช้งาน
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      อ่านข้อกำหนดและเงื่อนไข
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </UCard>

            <UCard>
              <NuxtLink to="/faq" class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Icon name="i-heroicons-question-mark-circle" class="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      คำถามที่พบบ่อย
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      หาคำตอบสำหรับคำถามทั่วไป
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 bg-gradient-to-r from-purple-600 to-purple-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl font-bold mb-4">
            มีคำถามเกี่ยวกับความเป็นส่วนตัว?
          </h2>
          <p class="text-xl text-purple-100 mb-8">
            เจ้าหน้าที่คุ้มครองข้อมูลของเรายินดีตอบคำถามของคุณ
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
              href="mailto:privacy@daisure.com"
              size="xl"
              color="white"
              variant="outline"
            >
              ส่งอีเมล์ถึง DPO
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
