# Admin Panel - Daisure

Admin panel for managing the Daisure insurance marketplace platform.

## Features

### 📊 Dashboard
- Real-time statistics and metrics
- Transaction overview
- Pending verifications counter
- Disputes counter
- Daily completion stats
- Total transaction volume

### 💳 Transaction Management
- View all transactions with filtering
- Verify payment submissions (Approve/Reject)
- View payment slips
- Transaction status tracking
- Search and filter by status

### ⚖️ Dispute Resolution
- View all active disputes
- Resolve disputes with three options:
  - Full refund to buyer
  - Release funds to seller
  - Partial refund (custom amount)
- Add detailed explanations for decisions

### 👥 User Management
- View all users
- Filter by role (Buyer, Seller, Admin, Super Admin)
- Filter by verification status
- Search by name or email
- View detailed user information

### ⭐ Review Management
- View all reviews
- Hide/unhide inappropriate reviews
- Filter by rating and visibility status
- Add reasons for hiding reviews

### ⚙️ Settings
- Configure escrow fee percentage
- Real-time fee calculation preview
- System information display

### 📝 Admin Logs (Audit Trail)
- Complete audit trail of all admin actions
- Filter by action type and target
- View detailed change history
- IP address tracking
- Timestamps for all actions

## Tech Stack

- **Framework**: Nuxt 4
- **UI Library**: Nuxt UI
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Date Formatting**: Day.js
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
```

3. Run development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
```

5. Preview production build:
```bash
pnpm preview
```

## Project Structure

```
frontend-admin/
├── app/
│   └── app.vue              # Root component
├── components/
│   └── ColorModeButton.vue  # Dark mode toggle
├── composables/
│   └── useApi.ts           # API client composable
├── layouts/
│   └── default.vue         # Main layout with sidebar
├── pages/
│   ├── index.vue           # Redirect to dashboard
│   ├── login.vue           # Login page
│   ├── dashboard.vue       # Dashboard with stats
│   ├── transactions.vue    # Transaction management
│   ├── disputes.vue        # Dispute resolution
│   ├── users.vue           # User management
│   ├── reviews.vue         # Review management
│   ├── settings.vue        # System settings
│   └── logs.vue            # Admin audit logs
├── stores/
│   └── auth.ts             # Authentication store
├── types/
│   └── api.ts              # TypeScript type definitions
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies
```

## API Endpoints

The admin panel connects to the following backend API endpoints:

### Authentication
- `POST /auth/login` - Admin login
- `GET /users/me` - Get current user

### Dashboard
- `GET /admin/dashboard` - Get dashboard statistics

### Transactions
- `GET /transactions` - List transactions
- `POST /admin/transactions/:id/verify-payment` - Verify payment
- `POST /admin/transactions/:id/resolve-dispute` - Resolve dispute

### Users
- `GET /users` - List all users (admin only)
- `GET /users/:id` - Get user details (admin only)

### Reviews
- `GET /reviews` - List reviews
- `PATCH /reviews/:id/hide` - Hide review (admin only)
- `PATCH /reviews/:id/unhide` - Unhide review (admin only)

### Settings
- `GET /settings` - Get system settings
- `PATCH /settings/escrow-fee` - Update escrow fee (admin only)

### Admin Logs
- `GET /admin/logs` - Get admin action logs

## Authentication

The admin panel uses JWT-based authentication:

1. Login with admin credentials
2. Receive access token and refresh token
3. Tokens are stored in localStorage
4. Access token is sent with every API request
5. Automatic redirect to login on 401 responses

### Required Roles
- Admin (`admin`)
- Super Admin (`super_admin`)

## Features Overview

### Transaction Verification
Admins can review payment submissions and approve or reject them with optional notes.

### Dispute Resolution
Three resolution options:
1. **Refund Buyer**: Full refund of transaction amount
2. **Release to Seller**: Release funds to seller
3. **Partial Refund**: Custom refund amount with remaining funds to seller

### Review Moderation
Hide inappropriate reviews with mandatory reason. Reviews can be unhidden later.

### Escrow Fee Management
Configure the platform's escrow fee as a percentage of transaction amount.

### Audit Trail
All admin actions are logged with:
- Action type
- Target resource
- Changes made
- Admin who performed action
- Timestamp
- IP address (if available)

## Development

### Code Style
- ESLint configured for Nuxt
- TypeScript strict mode
- Component composition API

### State Management
- Pinia stores for auth
- Composables for API calls
- Reactive state management

### UI Components
All components use Nuxt UI:
- UCard, UButton, UInput, USelect
- UTable for data display
- UModal for dialogs
- UAlert for notifications
- UBadge for status indicators

## Security

- JWT token authentication
- Role-based access control
- Automatic token refresh
- Secure API communication
- XSS protection
- CSRF protection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved
