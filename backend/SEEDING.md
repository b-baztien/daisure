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

## 🚀 การสร้าง Superadmin

### คำสั่งรัน Seed

```bash
cd backend
pnpm run seed:superadmin
```

### ข้อมูล Superadmin ที่จะถูกสร้าง

| Field | Value |
|-------|-------|
| **Email** | superadmin@daisure.com |
| **Password** | SuperAdmin123! |
| **Display Name** | Super Administrator |
| **Role** | super_admin |
| **Phone** | 0800000000 |

### ⚠️ หมายเหตุสำคัญ

1. **Script จะไม่สร้าง superadmin ซ้ำ** - หากมี superadmin@daisure.com อยู่แล้ว script จะข้ามการสร้างทันที
2. **เปลี่ยนรหัสผ่านทันทีหลังใช้งาน** - รหัสผ่านเริ่มต้นเป็นรหัสผ่านชั่วคราว ควรเปลี่ยนหลังจาก login ครั้งแรก
3. **อย่า commit ไฟล์ .env** - เก็บข้อมูล credentials ไว้เป็นความลับ

## 📝 ตัวอย่างการใช้งาน

### กรณีที่ MongoDB รันอยู่แล้ว

```bash
$ pnpm run seed:superadmin

🌱 Starting superadmin seed process...

✅ Superadmin created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:     superadmin@daisure.com
🔑 Password:  SuperAdmin123!
👤 Name:      Super Administrator
🎭 Role:      super_admin
📱 Phone:     0800000000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Please change the default password after first login!
```

### กรณีที่มี superadmin อยู่แล้ว

```bash
$ pnpm run seed:superadmin

🌱 Starting superadmin seed process...
⚠️  Superadmin already exists!
Email: superadmin@daisure.com
Role: super_admin
Display Name: Super Administrator

✨ Skipping seed process...
```

### กรณีที่ MongoDB ไม่ได้รัน

```bash
$ pnpm run seed:superadmin

❌ Error seeding superadmin: connect ECONNREFUSED 127.0.0.1:27017

# แก้ไข: เปิด MongoDB ก่อน
$ mongod  # หรือ docker start mongodb
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

### 2. Email already exists

**ปัญหา:** `BadRequestException: Email already exists`

**วิธีแก้:** สิ่งนี้เป็นเรื่องปกติ - หมายความว่า superadmin ถูกสร้างไปแล้ว หากต้องการสร้างใหม่:
```bash
# เข้า MongoDB shell และลบ user เก่า
mongosh escrow-service
db.users.deleteOne({ "auth.email": "superadmin@daisure.com" })
exit

# รัน seed ใหม่
pnpm run seed:superadmin
```

### 3. Module not found errors

**ปัญหา:** `Cannot find module 'tsconfig-paths/register'`

**วิธีแก้:**
```bash
# ติดตั้ง dependencies ใหม่
pnpm install
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

## 📚 เพิ่มเติม

### การสร้าง seed scripts อื่น ๆ

สามารถสร้าง seed scripts เพิ่มเติมได้โดยใช้แบบเดียวกันกับ `seed-superadmin.ts`:

```typescript
// src/scripts/seed-example.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // Your seed logic here
  await app.close();
}

bootstrap();
```

เพิ่ม script ใน `package.json`:
```json
{
  "scripts": {
    "seed:example": "ts-node -r tsconfig-paths/register src/scripts/seed-example.ts"
  }
}
```

### User Roles ที่มี

- `buyer` - ผู้ซื้อ (default)
- `seller` - ผู้ขาย
- `admin` - ผู้ดูแลระบบ
- `super_admin` - ผู้ดูแลระบบระดับสูงสุด

---

📝 อัปเดตล่าสุด: 18 มกราคม 2026
