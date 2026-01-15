# Escrow Service API

บริการรับฝากเงินค้ำประกันการซื้อขาย รองรับทั้ง LINE OA และ Web Application

## Features

- 🔐 Authentication (Web + LINE Login)
- 💰 Escrow Service (ฝากเงินค้ำประกัน)
- 📦 Transaction Management
- ⭐ Review & Rating System
- 🔔 Notifications (LINE, Email, Web)
- 👨‍💼 Admin Dashboard
- ⚙️ Settings Management

## Tech Stack

- NestJS
- MongoDB (Mongoose)
- LINE Messaging API
- JWT Authentication
- Passport.js

## Installation

```bash
pnpm install
```

## Configuration

Copy `.env.example` to `.env` and update:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/escrow-service
JWT_SECRET=your-secret-key
LINE_CHANNEL_ACCESS_TOKEN=your-token
LINE_CHANNEL_SECRET=your-secret
```

## Running

```bash
# Development
pnpm run start:dev

# Production
pnpm run build
pnpm run start:prod
```

## API Endpoints

### Authentication

- POST `/api/v1/auth/register` - Register
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/line/login` - LINE Login

### Users

- GET `/api/v1/users/me` - Get profile
- PATCH `/api/v1/users/me` - Update profile
- POST `/api/v1/users/me/bank-accounts` - Add bank account

### Transactions

- POST `/api/v1/transactions` - Create transaction
- GET `/api/v1/transactions` - List transactions
- GET `/api/v1/transactions/:id` - Get transaction
- PATCH `/api/v1/transactions/:id/confirm-delivery` - Confirm delivery
- POST `/api/v1/transactions/:id/dispute` - Create dispute

### Admin

- GET `/api/v1/admin/dashboard` - Dashboard stats
- POST `/api/v1/admin/transactions/:id/verify-payment` - Verify payment
- POST `/api/v1/admin/transactions/:id/resolve-dispute` - Resolve dispute
- GET `/api/v1/admin/logs` - Admin logs

## LINE Bot Commands

- `เมนู` - Main menu
- `รายการซื้อ` - My purchases
- `รายการขาย` - My sales
- `track [number]` - Track transaction

## License

MIT
