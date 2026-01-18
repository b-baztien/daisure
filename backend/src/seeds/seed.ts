import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  console.log('🌱 Starting seed process...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Superadmin data
    const superadminEmail = 'superadmin@daisure.com';
    const superadminPassword = 'Superadmin123!';

    // Check if superadmin already exists
    const existingUser = await usersService.findByEmail(superadminEmail);

    if (existingUser) {
      console.log('⚠️  Superadmin already exists!');
      console.log(`   Email: ${superadminEmail}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log('\n✅ No changes made.');
    } else {
      // Create superadmin
      console.log('➕ Creating superadmin user...');

      const superadmin = await usersService.create({
        email: superadminEmail,
        password: superadminPassword,
        displayName: 'Super Administrator',
        role: UserRole.SUPER_ADMIN,
      });

      console.log('\n✅ Superadmin created successfully!');
      console.log('━'.repeat(50));
      console.log('📧 Email:    ', superadminEmail);
      console.log('🔑 Password: ', superadminPassword);
      console.log('👤 Role:     ', superadmin.role);
      console.log('🆔 ID:       ', superadmin._id);
      console.log('━'.repeat(50));
      console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    }
  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }

  console.log('\n🎉 Seed process completed!\n');
  process.exit(0);
}

bootstrap();
