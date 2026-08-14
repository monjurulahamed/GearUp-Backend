
# GearUp 🏋️ — Backend API

**"Rent Sports & Outdoor Gear Instantly"**

GearUp is a RESTful backend API for a sports and outdoor equipment rental platform. Customers can browse gear, place rental orders, pay online, and leave reviews. Providers manage their own gear inventory and fulfill rental orders. Admins oversee the platform, manage users, and moderate listings.

---

## 🔗 Project Links

| Item | Link |
|---|---|
| **Backend Repo** |[REPOSITORIES](https://github.com/monjurulahamed/GearUp-Backend)|
| **Live API** |[Deployed Vercel URL](https://gear-up-backend-coral.vercel.app/)|
| **API Documentation (Postman)** |[GearUp-Backend.postman_collection.json](https://documenter.getpostman.com/view/54918163/2sBYApxsnM) |
| **Demo Video (3–5 min)** |[Demo Video](https://drive.google.com/file/d/1y_DRTl6gXmoYovSJgiMWxjBzIm2gW-eK/view?usp=sharing) |
| **Admin Email** |admin@gearup.com |
| **Admin Password** |Admin@12345 |

---

## 🧩 Roles & Permissions

| Role | Description | Key Permissions |
|---|---|---|
| **Customer** | Users who rent sports gear | Browse gear, place rental orders, pay online, track order status, leave reviews |
| **Provider** | Gear vendors / rental shops | Manage gear inventory, view incoming orders, update order status |
| **Admin** | Platform moderators | Manage all users, oversee all rentals, manage gear categories |

> 💡 Users select their role during registration.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma (`@prisma/client`, `@prisma/adapter-pg`) |
| Authentication | JWT (`jsonwebtoken`) + `bcryptjs` for password hashing |
| Validation | Zod |
| Payment | Stripe |
| Other | `cors`, `cookie-parser`, `dotenv`, `http-status-codes` |
| Build tool | `tsup` / `tsc` |
| Deployment | Vercel |

---

## ✨ Features

### Public
- Browse all available sports & outdoor gear
- Search and filter gear by category, price, brand, and availability
- View detailed gear specifications

### Customer
- Register and log in
- Place rental orders (select gear, rental dates)
- Pay securely via **Stripe** when placing/confirming an order
- View payment history and payment status
- Track rental order status (placed → confirmed → paid → picked up → returned)
- Leave a review after returning gear
- Manage profile

### Provider
- Register and log in
- Add, edit, and remove gear from inventory
- Manage stock and availability
- View incoming rental orders
- Update order status (confirm / mark picked up / mark returned)

### Admin
- View and manage all users (customers & providers)
- Suspend / activate user accounts
- View all gear listings and rental orders
- Manage gear categories

---

## 🗂️ Project Structure

```
GearUp-Backend/
├── prisma/                          # Prisma schema, migrations & seed script
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   └── app/
│       ├── server.ts                # Application entry point
│       ├── app.ts                   # Express app configuration (middleware, routes)
│       ├── config/                  # Environment & app configuration
│       ├── middlewares/             # Auth guard, error handler, validators
│       ├── errors/                  # Custom / structured error classes
│       ├── modules/                 # Feature modules (route + controller + service)
│       │   ├── auth/
│       │   ├── user/
│       │   ├── gear/
│       │   ├── category/
│       │   ├── rental/
│       │   ├── payment/
│       │   ├── review/
│       │   └── admin/
│       └── utils/                   # Shared helpers (JWT, response formatter, etc.)
├── dist/                            # Compiled JavaScript output (build)
├── GearUp-Backend.postman_collection.json
├── prisma.config.ts
├── tsup.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

> ℹ️ Update this tree if your actual module names/folders differ.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database
- A Stripe account (test mode keys are fine for development)

### 1. Clone the repository
```bash
git clone https://github.com/monjurulahamed/GearUp-Backend.git
cd GearUp-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"

# JWT
JWT_ACCESS_SECRET=<your_access_token_secret>
JWT_REFRESH_SECRET=<your_refresh_token_secret>
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Stripe
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>

# CORS
CLIENT_URL=http://localhost:3000
```

### 4. Set up the database
```bash
npm run prisma:generate     # generate Prisma client
npm run prisma:migrate      # run migrations
npm run prisma:seed         # seed initial data (e.g. admin user, categories)
```

### 5. Run the app

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:5000` (or your configured `PORT`).

### Other useful scripts
```bash
npm run lint             # lint the src folder
npm run prisma:studio    # open Prisma Studio to inspect data
```

---

## 📡 API Endpoints

> ⚠️ These reflect the assignment spec — adjust to match your actual implemented routes.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user (customer/provider) |
| POST | `/api/auth/login` | Login user, return JWT |
| GET | `/api/auth/me` | Get current authenticated user |

### Gear (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/gear` | Get all gear with filters (category, price, brand) |
| GET | `/api/gear/:id` | Get gear details |
| GET | `/api/categories` | Get all gear categories |

### Rental Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rentals` | Create new rental order |
| GET | `/api/rentals` | Get logged-in user's rental orders |
| GET | `/api/rentals/:id` | Get rental order details |

### Payments (Stripe)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create` | Create a payment intent/session for a rental order |
| POST | `/api/payments/confirm` | Confirm/verify payment (webhook or callback) |
| GET | `/api/payments` | Get user's payment history |
| GET | `/api/payments/:id` | Get payment details |

### Provider Management
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/provider/gear` | Add gear to inventory |
| PUT | `/api/provider/gear/:id` | Update gear listing |
| DELETE | `/api/provider/gear/:id` | Remove gear from inventory |
| GET | `/api/provider/orders` | Get provider's incoming orders |
| PATCH | `/api/provider/orders/:id` | Update rental order status |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Create review (after rental return) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status (suspend/activate) |
| GET | `/api/admin/gear` | Get all gear listings |
| GET | `/api/admin/rentals` | Get all rental orders |

---

## 🗄️ Database Models

| Model | Description |
|---|---|
| **User** | Stores user info, credentials (hashed password), and role (`CUSTOMER`, `PROVIDER`, `ADMIN`) |
| **GearItem** | Sports/outdoor gear listings, linked to a provider |
| **Category** | Gear categories (cycling, camping, fitness, water sports, etc.) |
| **RentalOrder** | Rental orders with items, dates, and status |
| **Payment** | Payment transactions — `transactionId`, `rentalOrderId`, `amount`, `method`, `provider` (Stripe), `status` (`PENDING`/`COMPLETED`/`FAILED`), `paidAt` |
| **Review** | Customer reviews for gear items after return |

---

## 📮 API Documentation & Testing

A Postman collection is included in the repo:
[`GearUp-Backend.postman_collection.json`](./GearUp-Backend.postman_collection.json)

To use it:
1. Open Postman → **Import** → select the JSON file.
2. Set a collection variable `baseUrl` to your local (`http://localhost:5000`) or deployed API URL.
3. Run **Register/Login** first to obtain a JWT, then use it for protected routes.

---

## ✅ Assignment Mandatory Requirements Checklist

- [ ] API Documentation (Postman collection included / Swagger)
- [ ] Consistent structured error responses: `{ success, message, errorDetails }`
- [ ] 20+ meaningful backend commits with descriptive messages
- [ ] Server-side input validation (Zod) on all endpoints
- [ ] Working admin credentials provided
- [ ] Payment integration via Stripe (no fake/COD payments)

---

## ☁️ Deployment

This project is configured for deployment on **Vercel** (see `vercel.json`).

```bash
npm run build
```

Set the same environment variables listed above in your hosting provider's dashboard before deploying.

---

---

## 👤 Author

**Monjurul Ahamed**
GitHub: [@monjurulahamed](https://github.com/monjurulahamed)

---
