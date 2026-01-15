<script setup lang="ts">
definePageMeta({
  layout: "blank"
})

useHead({
  title: 'เกี่ยวกับเรา - DaiSure',
  meta: [
    { name: 'description', content: 'เกี่ยวกับ DaiSure บริการรับฝากเงินค้ำประกันการซื้อขายออนไลน์อย่างปลอดภัย' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            เกี่ยวกับ DaiSure
          </h1>
          <p class="text-xl text-blue-100">
            แพลตฟอร์มรับฝากเงินค้ำประกันการซื้อขายออนไลน์ที่ปลอดภัยและน่าเชื่อถือ
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Mission -->
          <UCard class="mb-8">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Icon name="i-heroicons-light-bulb" class="w-6 h-6 text-blue-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  พันธกิจของเรา
                </h2>
              </div>
            </template>

            <div class="prose dark:prose-invert max-w-none">
              <p class="text-lg text-gray-700 dark:text-gray-300">
                DaiSure ก่อตั้งขึ้นด้วยเป้าหมายในการสร้างความปลอดภัยและความมั่นใจให้กับผู้ใช้งานในการซื้อขายออนไลน์
                เราเข้าใจดีว่าการซื้อขายออนไลน์มีความเสี่ยง ทั้งจากผู้ขายที่ไม่ซื่อสัตย์ หรือผู้ซื้อที่ไม่จ่ายเงิน
              </p>
              <p class="text-lg text-gray-700 dark:text-gray-300">
                ด้วยระบบรับฝากเงินค้ำประกันของเรา ทั้งผู้ซื้อและผู้ขายสามารถทำธุรกรรมได้อย่างปลอดภัย
                โดยเงินจะถูกเก็บไว้กับเราจนกว่าทั้งสองฝ่ายจะยืนยันการทำธุรกรรมเสร็จสมบูรณ์
              </p>
            </div>
          </UCard>

          <!-- Our Values -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              คุณค่าของเรา
            </h2>

            <div class="grid md:grid-cols-3 gap-6">
              <UCard>
                <div class="text-center">
                  <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="i-heroicons-shield-check" class="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    ความปลอดภัย
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    เราให้ความสำคัญกับความปลอดภัยของเงินและข้อมูลของคุณเป็นอันดับแรก
                  </p>
                </div>
              </UCard>

              <UCard>
                <div class="text-center">
                  <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="i-heroicons-check-badge" class="w-8 h-8 text-green-600" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    ความโปร่งใส
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    ทุกขั้นตอนของการทำธุรกรรมสามารถตรวจสอบได้อย่างชัดเจน
                  </p>
                </div>
              </UCard>

              <UCard>
                <div class="text-center">
                  <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="i-heroicons-heart" class="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    ความไว้วางใจ
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    เราสร้างความไว้วางใจระหว่างผู้ซื้อและผู้ขายในทุกธุรกรรม
                  </p>
                </div>
              </UCard>
            </div>
          </div>

          <!-- Statistics -->
          <UCard class="mb-8">
            <template #header>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                ความสำเร็จของเรา
              </h2>
            </template>

            <div class="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div class="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <div class="text-gray-600 dark:text-gray-400">ผู้ใช้งาน</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-green-600 mb-2">50,000+</div>
                <div class="text-gray-600 dark:text-gray-400">ธุรกรรม</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                <div class="text-gray-600 dark:text-gray-400">ความสำเร็จ</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-orange-600 mb-2">100%</div>
                <div class="text-gray-600 dark:text-gray-400">ความปลอดภัย</div>
              </div>
            </div>
          </UCard>

          <!-- Team -->
          <UCard>
            <template #header>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                ทีมงานของเรา
              </h2>
            </template>

            <div class="prose dark:prose-invert max-w-none">
              <p class="text-lg text-gray-700 dark:text-gray-300">
                DaiSure ดำเนินการโดยทีมงานมืออาชีพที่มีประสบการณ์ในด้านเทคโนโลยีการเงินและความปลอดภัยทางไซเบอร์
                เรามุ่งมั่นที่จะพัฒนาแพลตฟอร์มให้ดียิ่งขึ้นและให้บริการที่ดีที่สุดแก่ผู้ใช้งานทุกคน
              </p>
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
            พร้อมเริ่มใช้งานแล้วหรือยัง?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            สร้างบัญชีและเริ่มต้นการซื้อขายที่ปลอดภัยวันนี้
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
              to="/contact"
              size="xl"
              color="white"
              variant="outline"
            >
              ติดต่อเรา
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
