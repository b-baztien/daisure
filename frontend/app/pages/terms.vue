<script setup lang="ts">
useHead({
  title: 'ข้อกำหนดการใช้งาน - DaiSure',
  meta: [
    { name: 'description', content: 'ข้อกำหนดและเงื่อนไขการใช้บริการ DaiSure' }
  ]
})

const sections = [
  {
    title: '1. การยอมรับข้อกำหนด',
    content: `การใช้บริการ DaiSure หมายความว่าคุณยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขการใช้บริการทั้งหมด หากคุณไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาหยุดการใช้บริการของเราทันที

เราขอสงวนสิทธิ์ในการเปลี่ยนแปลง แก้ไข หรือปรับปรุงข้อกำหนดเหล่านี้ได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า การใช้บริการต่อไปหลังจากมีการเปลี่ยนแปลงข้อกำหนดถือว่าคุณยอมรับการเปลี่ยนแปลงนั้นๆ`
  },
  {
    title: '2. คำนิยาม',
    content: `"บริการ" หมายถึง แพลตฟอร์ม DaiSure และบริการรับฝากเงินค้ำประกันการซื้อขายออนไลน์ทั้งหมด

"ผู้ใช้" หมายถึง บุคคลที่สมัครสมาชิกและใช้บริการของ DaiSure

"ธุรกรรม" หมายถึง การซื้อขายที่เกิดขึ้นผ่านระบบ DaiSure

"ผู้ซื้อ" หมายถึง ผู้ใช้ที่ต้องการซื้อสินค้าหรือบริการ

"ผู้ขาย" หมายถึง ผู้ใช้ที่ต้องการขายสินค้าหรือบริการ`
  },
  {
    title: '3. การสมัครสมาชิกและบัญชีผู้ใช้',
    content: `3.1 คุณต้องมีอายุอย่างน้อย 18 ปีบริบูรณ์และมีความสามารถทางกฎหมายในการทำสัญญา

3.2 คุณต้องให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบันในการสมัครสมาชิก

3.3 คุณมีหน้าที่รักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณ และรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ

3.4 ห้ามโอนบัญชีหรือให้บุคคลอื่นใช้บัญชีของคุณโดยเด็ดขาด

3.5 คุณต้องแจ้งให้เราทราบทันทีหากมีการใช้บัญชีโดยไม่ได้รับอนุญาตหรือการละเมิดความปลอดภัยอื่นๆ`
  },
  {
    title: '4. การใช้บริการ',
    content: `4.1 บริการของเราทำหน้าที่เป็นตัวกลางในการรับฝากเงินค้ำประกันระหว่างผู้ซื้อและผู้ขาย

4.2 ผู้ใช้ต้องใช้บริการอย่างถูกต้องตามกฎหมายและจริยธรรม

4.3 ห้ามใช้บริการในการทำธุรกรรมที่ผิดกฎหมาย หลอกลวง หรือละเมิดสิทธิของผู้อื่น

4.4 ผู้ใช้ต้องให้ข้อมูลที่ถูกต้องเกี่ยวกับสินค้าหรือบริการที่ซื้อขาย

4.5 ผู้ใช้ต้องปฏิบัติตามขั้นตอนและกระบวนการที่กำหนดไว้ในแต่ละธุรกรรม`
  },
  {
    title: '5. การชำระเงินและค่าธรรมเนียม',
    content: `5.1 ผู้ซื้อต้องโอนเงินเต็มจำนวนเข้าบัญชี DaiSure ตามที่ระบุในธุรกรรม

5.2 DaiSure จะคิดค่าธรรมเนียมการให้บริการตามอัตราที่กำหนด ซึ่งจะหักจากจำนวนเงินที่โอนให้ผู้ขาย

5.3 อัตราค่าธรรมเนียมอาจมีการเปลี่ยนแปลงได้โดยมีการแจ้งให้ทราบล่วงหน้าอย่างน้อย 30 วัน

5.4 เงินจะถูกโอนให้ผู้ขายหลังจากผู้ซื้อยืนยันการรับสินค้า หรือครบกำหนดตามที่ระบุในธุรกรรม

5.5 ผู้ใช้สามารถถอนเงินจากบัญชี DaiSure ได้ตามเงื่อนไขที่กำหนด`
  },
  {
    title: '6. การยกเลิกและคืนเงิน',
    content: `6.1 ธุรกรรมสามารถยกเลิกได้เมื่อทั้งสองฝ่ายตกลงยินยอม

6.2 หากยกเลิกก่อนการชำระเงิน จะไม่มีค่าธรรมเนียม

6.3 หากยกเลิกหลังการชำระเงินแล้ว อาจมีค่าธรรมเนียมการยกเลิกตามที่กำหนด

6.4 การคืนเงินจะดำเนินการภายใน 7-14 วันทำการนับจากวันที่ยกเลิกธุรกรรม`
  },
  {
    title: '7. ข้อพิพาทและการไกล่เกลี่ย',
    content: `7.1 ในกรณีที่เกิดข้อพิพาท ผู้ใช้ควรพยายามแก้ไขปัญหาระหว่างกันเองก่อน

7.2 หากไม่สามารถแก้ไขได้ ผู้ใช้สามารถเปิดข้อพิพาทผ่านระบบของเรา

7.3 ทีมงาน DaiSure จะทำหน้าที่เป็นคนกลางในการไกล่เกลี่ยและตัดสินตามหลักฐานที่ได้รับ

7.4 การตัดสินของ DaiSure ถือเป็นที่สิ้นสุดและผูกพันทั้งสองฝ่าย

7.5 DaiSure มีสิทธิ์พิจารณาข้อพิพาทภายใน 14 วันทำการ`
  },
  {
    title: '8. ความรับผิดชอบและข้อจำกัด',
    content: `8.1 DaiSure ทำหน้าที่เป็นเพียงตัวกลางในการรับฝากเงิน ไม่ใช่คู่สัญญาในการซื้อขาย

8.2 DaiSure ไม่รับประกันคุณภาพ ความถูกต้อง หรือความสมบูรณ์ของสินค้าหรือบริการที่ซื้อขาย

8.3 DaiSure ไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการ เว้นแต่เกิดจากความประมาทเลินเล่ออย่างร้ายแรงหรือเจตนาของเรา

8.4 ความรับผิดสูงสุดของ DaiSure จะไม่เกินค่าธรรมเนียมที่คุณจ่ายให้เราสำหรับธุรกรรมนั้นๆ

8.5 DaiSure ไม่รับผิดชอบต่อความล่าช้าหรือความล้มเหลวในการให้บริการที่เกิดจากเหตุสุดวิสัย`
  },
  {
    title: '9. ทรัพย์สินทางปัญญา',
    content: `9.1 เนื้อหา โลโก้ เครื่องหมายการค้า และทรัพย์สินทางปัญญาอื่นๆ บนแพลตฟอร์มเป็นของ DaiSure

9.2 ห้ามคัดลอก ดัดแปลง แจกจ่าย หรือใช้งานทรัพย์สินทางปัญญาของเราโดยไม่ได้รับอนุญาต

9.3 ผู้ใช้ให้สิทธิ์แก่ DaiSure ในการใช้เนื้อหาที่ผู้ใช้โพสต์บนแพลตฟอร์มเพื่อวัตถุประสงค์ในการให้บริการ`
  },
  {
    title: '10. การระงับและยกเลิกบัญชี',
    content: `10.1 DaiSure มีสิทธิ์ระงับหรือยกเลิกบัญชีของคุณได้ หากคุณละเมิดข้อกำหนดนี้

10.2 คุณสามารถยกเลิกบัญชีได้ตลอดเวลา โดยต้องแน่ใจว่าไม่มีธุรกรรมค้างอยู่

10.3 เมื่อบัญชีถูกยกเลิก ข้อมูลบางส่วนอาจยังคงอยู่ตามที่กฎหมายกำหนด`
  },
  {
    title: '11. กฎหมายที่ใช้บังคับ',
    content: `ข้อกำหนดนี้อยู่ภายใต้และตีความตามกฎหมายไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจากหรือเกี่ยวข้องกับข้อกำหนดนี้จะอยู่ในเขตอำนาจของศาลไทยเท่านั้น`
  },
  {
    title: '12. การติดต่อ',
    content: `หากคุณมีคำถามเกี่ยวกับข้อกำหนดนี้ กรุณาติดต่อเราได้ที่:

อีเมล: legal@daisure.com
โทรศัพท์: 02-XXX-XXXX
ที่อยู่: 123 ถนนสุขุมวิท กรุงเทพฯ 10110`
  }
]

const lastUpdated = '1 มกราคม 2567'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            ข้อกำหนดการใช้งาน
          </h1>
          <p class="text-xl text-blue-100">
            กรุณาอ่านข้อกำหนดและเงื่อนไขการใช้บริการอย่างละเอียด
          </p>
          <p class="text-sm text-blue-200 mt-4">
            อัพเดทล่าสุด: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Terms Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Introduction -->
          <UCard class="mb-8">
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-lg text-gray-700 dark:text-gray-300">
                ยินดีต้อนรับสู่ DaiSure ก่อนที่คุณจะใช้บริการของเรา กรุณาอ่านข้อกำหนดและเงื่อนไขการใช้บริการ ("ข้อกำหนด") ฉบับนี้อย่างละเอียด
                ข้อกำหนดนี้เป็นสัญญาที่มีผลผูกพันทางกฎหมายระหว่างคุณและ DaiSure
              </p>
            </div>
          </UCard>

          <!-- Terms Sections -->
          <div class="space-y-6">
            <UCard v-for="section in sections" :key="section.title">
              <template #header>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ section.title }}
                </h2>
              </template>

              <div class="prose dark:prose-invert max-w-none">
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {{ section.content }}
                </p>
              </div>
            </UCard>
          </div>

          <!-- Acceptance -->
          <UCard class="mt-8">
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-information-circle" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    การยอมรับข้อกำหนด
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300">
                    การใช้บริการของ DaiSure แสดงว่าคุณได้อ่าน เข้าใจ และยอมรับที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้ข้างต้น
                    หากคุณไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาอย่าใช้บริการของเรา
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Related Links -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              เอกสารที่เกี่ยวข้อง
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UCard>
              <NuxtLink to="/privacy" class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Icon name="i-heroicons-shield-check" class="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      นโยบายความเป็นส่วนตัว
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      อ่านเกี่ยวกับการจัดการข้อมูลส่วนตัว
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </UCard>

            <UCard>
              <NuxtLink to="/faq" class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Icon name="i-heroicons-question-mark-circle" class="w-6 h-6 text-blue-600" />
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
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <UCard>
            <div class="text-center py-8">
              <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                มีคำถามเกี่ยวกับข้อกำหนด?
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
                ทีมกฎหมายของเรายินดีตอบคำถามของคุณ
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <UButton
                  to="/contact"
                  size="lg"
                  color="primary"
                  variant="solid"
                >
                  ติดต่อเรา
                </UButton>
                <UButton
                  to="/support"
                  size="lg"
                  color="gray"
                  variant="outline"
                >
                  ศูนย์ช่วยเหลือ
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>
