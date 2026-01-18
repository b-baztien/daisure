import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { seedSuperAdmin } from './seeders';

// ประเภทของ seeders ที่มี
type SeederName = 'superadmin' | 'all';

// Configuration สำหรับแต่ละ seeder
const SEEDERS = {
  superadmin: {
    name: 'Superadmin',
    fn: seedSuperAdmin,
  },
  // เพิ่ม seeders อื่นๆ ในอนาคตที่นี่
  // users: {
  //   name: 'Demo Users',
  //   fn: seedUsers,
  // },
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('🌱 Starting database seeding process...\n');

    // อ่าน arguments จาก command line
    // ใช้งาน: pnpm run seed [seeder-name]
    // ตัวอย่าง: pnpm run seed superadmin
    const args = process.argv.slice(2);
    const seederArg = args[0] as SeederName;

    // ถ้าไม่ระบุ seeder หรือระบุเป็น 'all' จะรันทั้งหมด
    const shouldRunAll = !seederArg || seederArg === 'all';

    if (shouldRunAll) {
      console.log('📋 Running all seeders...\n');

      // รัน seeders ทั้งหมดตามลำดับ
      await seedSuperAdmin(usersService);
      // เพิ่ม seeders อื่นๆ ตามลำดับที่ต้องการ
      // await seedUsers(usersService);
      // await seedTransactions(transactionsService);
    } else {
      // รัน seeder เฉพาะที่ระบุ
      const seeder = SEEDERS[seederArg];

      if (!seeder) {
        console.error(`❌ Unknown seeder: ${seederArg}`);
        console.log('\nAvailable seeders:');
        Object.keys(SEEDERS).forEach((key) => {
          console.log(`  - ${key}`);
        });
        process.exit(1);
      }

      console.log(`📋 Running seeder: ${seeder.name}\n`);
      await seeder.fn(usersService);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  Remember to change default passwords after first login!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    console.error(error.stack);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
