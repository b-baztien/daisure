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

```bash
# Server Configuration
PORT=3005

# Database
MONGODB_URI=mongodb://localhost:27017/escrow-service

# JWT Configuration
JWT_SECRET=your-secret-key-here-please-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret-key-here-please-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# LINE Configuration
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_REDIRECT_URI=http://localhost:3000/auth/line-callback
LINE_LIFF_ID=your-line-liff-id
```

**Important for LINE Login:**
- `LINE_REDIRECT_URI` must match the Callback URL configured in LINE Developers Console
- Default is `http://localhost:3000/auth/line-callback` for local development
- For production, update to your production frontend URL

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

## Troubleshooting

### LINE Login Returns 400 Error

If you're getting a 400 error when calling `/api/v1/auth/line/login`, check:

1. **Missing .env file**: Copy `.env.example` to `.env` and configure all LINE variables
2. **LINE_REDIRECT_URI not set**: Make sure `LINE_REDIRECT_URI=http://localhost:3000/auth/line-callback` is in your `.env` file
3. **LINE_REDIRECT_URI mismatch**: The redirect URI must match exactly with:
   - The Callback URL in LINE Developers Console
   - The URL where LINE redirects after authentication
   - The frontend callback page (`/auth/line-callback`)
4. **Request body validation**: Ensure you're sending both `code` and `state` as strings in the request body

Example valid request:
```bash
curl "http://localhost:3005/api/v1/auth/line/login" \
  -H "Content-Type: application/json" \
  -d '{"code":"your-auth-code","state":"your-state"}'
```

### LINE API Exchange Token Fails (401 Error)

If the token exchange with LINE API fails:

1. Verify `LINE_CHANNEL_ID` and `LINE_CHANNEL_SECRET` are correct
2. Verify the authorization `code` is still valid (codes expire quickly)
3. Check that `LINE_REDIRECT_URI` matches the one in LINE Developers Console exactly
4. Ensure your LINE Login channel is properly configured

## License

MIT
