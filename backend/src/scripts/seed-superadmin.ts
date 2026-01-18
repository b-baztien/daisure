import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../common/enums/user-role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('🌱 Starting superadmin seed process...');

    // ตรวจสอบว่ามี superadmin อยู่แล้วหรือไม่
    const existingSuperAdmin = await usersService.findByEmail(
      'superadmin@daisure.com',
    );

    if (existingSuperAdmin) {
      console.log('⚠️  Superadmin already exists!');
      console.log('Email:', existingSuperAdmin.auth.email);
      console.log('Role:', existingSuperAdmin.role);
      console.log('Display Name:', existingSuperAdmin.profile.displayName);
      console.log('\n✨ Skipping seed process...');
      await app.close();
      return;
    }

    // สร้าง superadmin ใหม่
    const superadmin = await usersService.create({
      email: 'superadmin@daisure.com',
      password: 'SuperAdmin123!',
      displayName: 'Super Administrator',
      role: UserRole.SUPER_ADMIN,
      phone: '0800000000',
    });

    console.log('\n✅ Superadmin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:     superadmin@daisure.com');
    console.log('🔑 Password:  SuperAdmin123!');
    console.log('👤 Name:      Super Administrator');
    console.log('🎭 Role:      super_admin');
    console.log('📱 Phone:     0800000000');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
