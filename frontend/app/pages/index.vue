<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative bg-linear-to-r from-blue-600 to-blue-800 text-white"
    >
      <div class="container mx-auto px-4 py-20 md:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            ซื้อขายออนไลน์อย่างปลอดภัย
            <span class="block text-blue-200">ด้วย DaiSure</span>
          </h1>

          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            บริการรับฝากเงินค้ำประกันการซื้อขาย<br />
            ปลอดภัย มั่นใจ ไร้กังวล
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/auth/register"
              size="xl"
              color="secondary"
              variant="solid"
            >
              เริ่มต้นใช้งาน
            </UButton>

            <UButton
              to="/auth/login"
              size="xl"
              color="secondary"
              variant="outline"
            >
              เข้าสู่ระบบ
            </UButton>
          </div>

          <div
            class="mt-8 flex items-center justify-center gap-4 text-sm text-blue-100"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
              <span>ปลอดภัย 100%</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
              <span>รับประกันเงิน</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="w-5 h-5" />
              <span>ผู้ใช้ 10,000+ คน</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave Shape -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="rgb(249, 250, 251)"
          />
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            ทำไมต้องใช้ DaiSure?
          </h2>
          <p class="text-xl text-gray-600">
            ความปลอดภัยและความมั่นใจในทุกการซื้อขาย
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Feature 1 -->
          <UCard>
            <template #header>
              <div class="flex justify-center">
                <div
                  class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-shield-check"
                    class="w-8 h-8 text-blue-600"
                  />
                </div>
              </div>
            </template>

            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">ปลอดภัย 100%</h3>
              <p class="text-gray-600">
                เงินของคุณถูกเก็บไว้ที่ระบบอย่างปลอดภัย
                จนกว่าจะได้รับสินค้าครบถ้วน
              </p>
            </div>
          </UCard>

          <!-- Feature 2 -->
          <UCard>
            <template #header>
              <div class="flex justify-center">
                <div
                  class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-user-group"
                    class="w-8 h-8 text-green-600"
                  />
                </div>
              </div>
            </template>

            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">มีคนกลาง</h3>
              <p class="text-gray-600">
                Admin ตรวจสอบทุกขั้นตอน พร้อมช่วยแก้ไขปัญหาหากเกิดข้อพิพาท
              </p>
            </div>
          </UCard>

          <!-- Feature 3 -->
          <UCard>
            <template #header>
              <div class="flex justify-center">
                <div
                  class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-8 h-8 text-purple-600"
                  />
                </div>
              </div>
            </template>

            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">รวดเร็ว</h3>
              <p class="text-gray-600">
                ระบบอัตโนมัติ ประมวลผลเร็ว รับเงินภายใน 24 ชั่วโมง
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">วิธีการใช้งาน</h2>
          <p class="text-xl text-gray-600">เพียง 6 ขั้นตอนง่ายๆ</p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="space-y-8">
            <!-- Step 1 -->
            <div class="flex gap-6 items-start">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl"
                >
                  1
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">สร้างรายการซื้อขาย</h3>
                <p class="text-gray-600">
                  Buyer สร้างรายการสินค้าที่ต้องการซื้อ
                  พร้อมข้อมูลผู้ขายและรายละเอียดการจัดส่ง
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-6 items-start">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl"
                >
                  2
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">โอนเงินมาที่ระบบ</h3>
                <p class="text-gray-600">
                  Buyer โอนเงินมายังบัญชี Escrow พร้อมอัพโหลดหลักฐานการโอน
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex gap-6 items-start">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl"
                >
                  3
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">Admin ตรวจสอบ</h3>
                <p class="text-gray-600">
                  Admin ตรวจสอบการโอนเงินและอนุมัติภายใน 24 ชั่วโมง
                </p>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex gap-6 items-start">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl"
                >
                  4
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">Seller จัดส่งสินค้า</h3>
                <p class="text-gray-600">
                  หลังได้รับยอด Seller จัดส่งสินค้าพร้อม tracking number
                </p>
              </div>
            </div>

            <!-- Step 5 -->
            <div class="flex gap-6 items-start">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl"
                >
                  5
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">Buyer ยืนยันได้รับ</h3>
                <p class="text-gray-600">
                  Buyer ตรวจสอบสินค้าและยืนยันว่าได้รับสินค้าครบถ้วนสมบูรณ์
                </p>
              </div>
            </div>

            <!-- Step 6 -->
            <div class="flex gap-6 items-start">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl"
                >
                  6
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2">โอนเงินให้ Seller</h3>
                <p class="text-gray-600">
                  ระบบโอนเงินให้ Seller ทันที พร้อมปิดการทำรายการ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-blue-600 text-white">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
            <div class="text-blue-100">ผู้ใช้งาน</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
            <div class="text-blue-100">รายการสำเร็จ</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold mb-2">100M+</div>
            <div class="text-blue-100">มูลค่าการทำรายการ</div>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-bold mb-2">4.9/5</div>
            <div class="text-blue-100">คะแนนความพึงพอใจ</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            ความคิดเห็นจากผู้ใช้งาน
          </h2>
          <p class="text-xl text-gray-600">คนที่ไว้วางใจเรามากกว่า 10,000 คน</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <UCard>
            <div class="space-y-4">
              <div class="flex gap-1">
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
              </div>
              <p class="text-gray-600">
                "ปลอดภัยมาก ซื้อของราคาแพงก็ไม่กังวล มีแอดมินคอยดูแล
                ประทับใจมากครับ"
              </p>
              <div class="flex items-center gap-3">
                <UAvatar src="/images/user1.jpg" alt="สมชาย" />
                <div>
                  <div class="font-semibold">สมชาย ใจดี</div>
                  <div class="text-sm text-gray-500">Buyer</div>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-4">
              <div class="flex gap-1">
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
              </div>
              <p class="text-gray-600">
                "ขายของง่ายขึ้นเยอะ ลูกค้าไว้วางใจมากขึ้น ได้เงินเร็ว
                ระบบดีมากค่ะ"
              </p>
              <div class="flex items-center gap-3">
                <UAvatar src="/images/user2.jpg" alt="สมหญิง" />
                <div>
                  <div class="font-semibold">สมหญิง รักการขาย</div>
                  <div class="text-sm text-gray-500">Seller</div>
                </div>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-4">
              <div class="flex gap-1">
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
                <UIcon
                  name="i-heroicons-star-solid"
                  class="w-5 h-5 text-yellow-400"
                />
              </div>
              <p class="text-gray-600">
                "ใช้มา 2 ปีแล้ว ไม่เคยมีปัญหา บริการดีมาก ตอบไว แก้ปัญหาเป็น"
              </p>
              <div class="flex items-center gap-3">
                <UAvatar src="/images/user3.jpg" alt="สมศรี" />
                <div>
                  <div class="font-semibold">สมศรี มีสุข</div>
                  <div class="text-sm text-gray-500">Buyer & Seller</div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-linear-to-r from-blue-600 to-blue-800 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          พร้อมเริ่มซื้อขายอย่างปลอดภัยแล้วหรือยัง?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          สมัครวันนี้ รับส่วนลด 50% ค่าธรรมเนียมรายการแรก
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/auth/register"
            size="xl"
            color="secondary"
            variant="solid"
          >
            สมัครใช้งานฟรี
          </UButton>
          <UButton
            to="/auth/login"
            size="xl"
            color="secondary"
            variant="outline"
          >
            หรือเข้าสู่ระบบ
          </UButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold text-white mb-4">DaiSure</h3>
            <p class="text-sm">
              บริการรับฝากเงินค้ำประกันการซื้อขายออนไลน์ที่ปลอดภัยที่สุด
            </p>
          </div>

          <div>
            <h4 class="font-semibold text-white mb-4">บริการ</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/about" class="hover:text-white"
                  >เกี่ยวกับเรา</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/how-it-works" class="hover:text-white"
                  >วิธีการใช้งาน</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/pricing" class="hover:text-white"
                  >อัตราค่าบริการ</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/faq" class="hover:text-white"
                  >คำถามที่พบบ่อย</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-white mb-4">ช่วยเหลือ</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/contact" class="hover:text-white"
                  >ติดต่อเรา</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/support" class="hover:text-white"
                  >ศูนย์ช่วยเหลือ</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/terms" class="hover:text-white"
                  >ข้อกำหนดการใช้งาน</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/privacy" class="hover:text-white"
                  >นโยบายความเป็นส่วนตัว</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-white mb-4">ติดตามเรา</h4>
            <div class="flex gap-4">
              <a href="#" class="hover:text-white">
                <UIcon name="i-simple-icons-facebook" class="w-6 h-6" />
              </a>
              <a href="#" class="hover:text-white">
                <UIcon name="i-simple-icons-line" class="w-6 h-6" />
              </a>
              <a href="#" class="hover:text-white">
                <UIcon name="i-simple-icons-instagram" class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 DaiSure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "DaiSure - ซื้อขายออนไลน์อย่างปลอดภัย",
  meta: [
    {
      name: "description",
      content: "บริการรับฝากเงินค้ำประกันการซื้อขาย ปลอดภัย มั่นใจ ไร้กังวล",
    },
  ],
});
</script>
