# 🌱 Database Seeding Guide

คู่มือการสร้าง seed data สำหรับโปรเจกต์ Daisure Backend

## 📋 Prerequisites

ก่อนรัน seed script ต้องแน่ใจว่า:

1. **MongoDB กำลังรันอยู่**
   ```bash
   # ตรวจสอบว่า MongoDB กำลังรันอยู่หรือไม่
   mongosh --eval "db.version()"

   # หรือถ้าใช้ docker
   docker ps | grep mongo
   ```

2. **Dependencies ถูกติดตั้งแล้ว**
   ```bash
   pnpm install
   ```

3. **Environment Variables ถูกตั้งค่าแล้ว**
   - ตรวจสอบไฟล์ `.env` มี `MONGODB_URI` ตั้งค่าถูกต้อง
   - Default: `mongodb://localhost:27017/escrow-service`

## 🚀 คำสั่ง Seed ที่ใช้ได้

### รัน Seed ทั้งหมด (แนะนำ)

```bash
cd backend
pnpm run seed
```

คำสั่งนี้จะรัน seeders ทั้งหมดตามลำดับ

### รัน Seed เฉพาะส่วน

```bash
# Seed เฉพาะ superadmin
pnpm run seed superadmin

# หรือใช้คำสั่งย่อ
pnpm run seed:superadmin
```

### ดู Seeders ที่ใช้ได้

```bash
pnpm run seed unknown-seeder
# จะแสดงรายการ seeders ที่มี
```

## 📁 โครงสร้างไฟล์ Seed

```
backend/src/scripts/
├── seed.ts                         # Main seed file (entry point)
└── seeders/
    ├── index.ts                    # Export all seeders
    └── superadmin.seeder.ts        # Superadmin seeder
```

### การเพิ่ม Seeder ใหม่

1. **สร้างไฟล์ seeder ใหม่** ใน `src/scripts/seeders/`
   ```typescript
   // src/scripts/seeders/users.seeder.ts
   import { UsersService } from '../../modules/users/users.service';

   export async function seedUsers(usersService: UsersService) {
     console.log('\n🔹 Seeding Demo Users...');

     // Your seeding logic here

     console.log('✅ Demo users created!');
   }
   ```

2. **Export ใน index.ts**
   ```typescript
   // src/scripts/seeders/index.ts
   export * from './superadmin.seeder';
   export * from './users.seeder';
   ```

3. **เพิ่มใน seed.ts**
   ```typescript
   // src/scripts/seed.ts
   import { seedSuperAdmin, seedUsers } from './seeders';

   const SEEDERS = {
     superadmin: {
       name: 'Superadmin',
       fn: seedSuperAdmin,
     },
     users: {
       name: 'Demo Users',
       fn: seedUsers,
     },
   };
   ```

4. **เพิ่มคำสั่งใน package.json** (ถ้าต้องการ)
   ```json
   {
     "scripts": {
       "seed:users": "ts-node -r tsconfig-paths/register src/scripts/seed.ts users"
     }
   }
   ```

## 📊 Seeders ที่มีอยู่

### 1. Superadmin Seeder

สร้างบัญชี superadmin สำหรับระบบ

**ข้อมูลที่จะถูกสร้าง:**

| Field | Value |
|-------|-------|
| **Email** | superadmin@daisure.com |
| **Password** | SuperAdmin123! |
| **Display Name** | Super Administrator |
| **Role** | super_admin |
| **Phone** | 0800000000 |

**Features:**
- ✅ ตรวจสอบซ้ำ - ไม่สร้างถ้ามี email นี้อยู่แล้ว
- ✅ Password hashing - เข้ารหัสด้วย bcrypt
- ✅ Default permissions - สิทธิ์เต็มทุกอย่าง

**การใช้งาน:**
```bash
# รันเฉพาะ superadmin seeder
pnpm run seed:superadmin

# หรือ
pnpm run seed superadmin
```

## 📝 ตัวอย่างการใช้งาน

### กรณีที่ MongoDB รันอยู่แล้ว

```bash
$ pnpm run seed

🌱 Starting database seeding process...

📋 Running all seeders...

🔹 Seeding Superadmin...
✅ Superadmin created successfully!
   📧 Email:    superadmin@daisure.com
   🔑 Password: SuperAdmin123!
   👤 Name:     Super Administrator
   🎭 Role:     super_admin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Seeding completed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Remember to change default passwords after first login!
```

### กรณีที่มีข้อมูลอยู่แล้ว

```bash
$ pnpm run seed

🌱 Starting database seeding process...

📋 Running all seeders...

🔹 Seeding Superadmin...
⚠️  Superadmin already exists - skipping
   Email: superadmin@daisure.com
   Role: super_admin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Seeding completed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### รัน Seeder เฉพาะส่วน

```bash
$ pnpm run seed superadmin

🌱 Starting database seeding process...

📋 Running seeder: Superadmin

🔹 Seeding Superadmin...
✅ Superadmin created successfully!
   📧 Email:    superadmin@daisure.com
   🔑 Password: SuperAdmin123!
   👤 Name:     Super Administrator
   🎭 Role:     super_admin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Seeding completed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔧 การแก้ไขปัญหาที่พบบ่อย

### 1. Cannot connect to MongoDB

**ปัญหา:** `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**วิธีแก้:**
```bash
# ตรวจสอบว่า MongoDB กำลังรันอยู่
sudo systemctl status mongod

# เริ่ม MongoDB service
sudo systemctl start mongod

# หรือใช้ docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Unknown seeder error

**ปัญหา:** `❌ Unknown seeder: xyz`

**วิธีแก้:** ตรวจสอบชื่อ seeder ที่ใช้ได้:
```bash
pnpm run seed xyz
# จะแสดงรายการ seeders ที่มี:
# Available seeders:
#   - superadmin
#   - all
```

### 3. Module not found errors

**ปัญหา:** `Cannot find module 'tsconfig-paths/register'`

**วิธีแก้:**
```bash
# ติดตั้ง dependencies ใหม่
pnpm install
```

### 4. TypeScript compilation errors

**ปัญหา:** `TSError: Unable to compile TypeScript`

**วิธีแก้:**
```bash
# ตรวจสอบ TypeScript syntax
pnpm run build

# ถ้า build ผ่าน แต่ seed ไม่ได้ ลองลบ ts-node cache
rm -rf node_modules/.cache
```

### 5. ต้องการลบข้อมูลเก่าและ seed ใหม่

```bash
# เข้า MongoDB shell
mongosh escrow-service

# ลบข้อมูลเฉพาะ
db.users.deleteMany({ role: "super_admin" })

# หรือลบทั้ง collection
db.users.drop()

# ออกจาก shell
exit

# รัน seed ใหม่
pnpm run seed
```

## 🔐 การเข้าสู่ระบบครั้งแรก

หลังจากสร้าง superadmin แล้ว สามารถ login ได้ที่:

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "superadmin@daisure.com",
  "password": "SuperAdmin123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "superadmin@daisure.com",
    "displayName": "Super Administrator",
    "role": "super_admin"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## ⚠️ หมายเหตุสำคัญ

1. **อย่า commit ข้อมูล sensitive** - ไฟล์ `.env` และ credentials ต่างๆ ไม่ควร commit ลง git
2. **เปลี่ยนรหัสผ่านทันที** - รหัสผ่าน default เป็นเพียงข้อมูลเริ่มต้น ควรเปลี่ยนหลัง login ครั้งแรก
3. **ระวัง production** - อย่ารัน seed บน production database โดยไม่ระวัง อาจเขียนทับข้อมูลที่มีอยู่
4. **Idempotent seeders** - Seeders ควรเขียนให้รันซ้ำได้โดยไม่เกิดข้อผิดพลาด (ตรวจสอบข้อมูลซ้ำก่อนสร้าง)

## 🎯 Best Practices

### 1. ตรวจสอบข้อมูลซ้ำก่อนสร้าง

```typescript
// ✅ Good
const existing = await service.findByEmail(email);
if (existing) {
  console.log('Already exists - skipping');
  return;
}
await service.create(data);

// ❌ Bad - สร้างซ้ำทุกครั้ง
await service.create(data);
```

### 2. ใช้ transaction สำหรับข้อมูลที่เกี่ยวข้องกัน

```typescript
const session = await connection.startSession();
session.startTransaction();
try {
  await service1.create(data1, { session });
  await service2.create(data2, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### 3. แสดงข้อความที่เข้าใจง่าย

```typescript
console.log('🔹 Seeding Users...');     // เริ่มต้น
console.log('✅ Created 10 users');      // สำเร็จ
console.log('⚠️  User exists - skip');  // ข้าม
console.log('❌ Error: ...');            // ผิดพลาด
```

### 4. แยก seeders ตาม domain

```
seeders/
├── auth/
│   ├── superadmin.seeder.ts
│   └── demo-users.seeder.ts
├── transactions/
│   └── demo-transactions.seeder.ts
└── settings/
    └── default-settings.seeder.ts
```

## 📚 User Roles ที่มี

- `buyer` - ผู้ซื้อ (default สำหรับ user ทั่วไป)
- `seller` - ผู้ขาย
- `admin` - ผู้ดูแลระบบ
- `super_admin` - ผู้ดูแลระบบระดับสูงสุด (มีสิทธิ์เต็มทุกอย่าง)

## 🔄 Workflow ทั่วไป

```bash
# 1. Setup environment
cp .env.example .env
# แก้ไข MONGODB_URI

# 2. เริ่ม MongoDB
docker-compose up -d mongodb
# หรือ
sudo systemctl start mongod

# 3. ติดตั้ง dependencies
pnpm install

# 4. รัน seeds
pnpm run seed

# 5. ทดสอบ login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@daisure.com","password":"SuperAdmin123!"}'

# 6. เริ่มพัฒนา
pnpm run start:dev
```

---

📝 อัพเดตล่าสุด: 18 มกราคม 2026
🏗️ โครงสร้างแบบ Modular - รองรับการเพิ่ม seeders ใหม่ได้ง่าย
