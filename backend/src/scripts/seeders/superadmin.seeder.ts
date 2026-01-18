import { UsersService } from '../../modules/users/users.service';
import { UserRole } from '../../common/enums/user-role.enum';

export async function seedSuperAdmin(usersService: UsersService) {
  console.log('\n🔹 Seeding Superadmin...');

  // ตรวจสอบว่ามี superadmin อยู่แล้วหรือไม่
  const existingSuperAdmin = await usersService.findByEmail(
    'superadmin@daisure.com',
  );

  if (existingSuperAdmin) {
    console.log('⚠️  Superadmin already exists - skipping');
    console.log('   Email:', existingSuperAdmin.auth.email);
    console.log('   Role:', existingSuperAdmin.role);
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

  console.log('✅ Superadmin created successfully!');
  console.log('   📧 Email:    superadmin@daisure.com');
  console.log('   🔑 Password: SuperAdmin123!');
  console.log('   👤 Name:     Super Administrator');
  console.log('   🎭 Role:     super_admin');
}
