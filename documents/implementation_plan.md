# Coastal Innovation Summit — Production Backend System

Build a complete production-grade Node.js + Express backend for the Coastal Innovation Summit, handling registrations, payments (Razorpay), Google Sheets sync, QR code generation, Brevo SMTP email, and JWT-based admin auth. The backend will live in a new `server/` directory alongside the existing Vite + React frontend.

## User Review Required

> [!IMPORTANT]
> The backend is created as a **separate Node.js project** inside `server/` with its own [package.json](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/package.json). This keeps the frontend (Vite/React) and backend (Express) cleanly separated, matching the tech report's recommendation for Vercel (frontend) + Render (backend) deployment.

> [!WARNING]
> All environment variables (Razorpay keys, MongoDB URI, Google credentials, etc.) must be configured in a `.env` file before the server can start. The app **fails fast** on missing env vars. A `.env.example` will be provided as reference.

---

## Proposed Changes

### Config Layer

#### [NEW] [env.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/config/env.js)
- Zod schema validating all required env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `FRONTEND_URL`, `PORT`
- App crashes on startup if any are missing or malformed

#### [NEW] [db.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/config/db.js)
- Mongoose connection to MongoDB Atlas with retry logic and event logging

---

### Middleware Layer

#### [NEW] [helmet.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/middleware/helmet.js)
- Helmet with CSP + HSTS enabled

#### [NEW] [cors.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/middleware/cors.js)
- Strict CORS allowlist (only `FRONTEND_URL`), no wildcards

#### [NEW] [rateLimiter.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/middleware/rateLimiter.js)
- Global rate limiter + per-route configs (auth stricter, webhooks lenient)

#### [NEW] [auth.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/middleware/auth.js)
- JWT access token verification middleware for protected routes

#### [NEW] [validate.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/middleware/validate.js)
- Generic Zod validation middleware factory for any route

#### [NEW] [errorHandler.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/middleware/errorHandler.js)
- Global error handler: logs error, returns sanitized JSON response, handles Zod/Mongoose/JWT errors

---

### Database Models

#### [NEW] [Registration.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/models/Registration.js)
- Fields: `name`, `email`, `phone`, `ticketType`, `razorpay_order_id`, `razorpay_payment_id` (unique index), `amount`, `status` (enum: pending/paid/failed), `syncStatus` (enum: pending/synced/failed), `qrCode`, timestamps
- Indexes on `email`, `razorpay_order_id`, `razorpay_payment_id` (unique)

#### [NEW] [Speaker.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/models/Speaker.js)
- Speaker application schema with name, email, bio, topic, organization

#### [NEW] [Stall.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/models/Stall.js)
- Stall booking schema with company info, stall type, payment references

#### [NEW] [Competition.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/models/Competition.js)
- Competition entry schema with team info, competition category

#### [NEW] [Contact.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/models/Contact.js)
- Contact form submissions: name, email, subject, message

#### [NEW] [User.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/models/User.js)
- Admin users: email, passwordHash (bcrypt), role, refreshToken

---

### Services Layer (ALL external integrations)

#### [NEW] [razorpayService.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/services/razorpayService.js)
- `createOrder(amount, currency, receipt)` — creates Razorpay order via SDK
- `verifyWebhookSignature(body, signature, secret)` — HMAC SHA256 with `crypto.timingSafeEqual`

#### [NEW] [sheetService.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/services/sheetService.js)
- Google Sheets API v4 via `googleapis` package
- `appendRegistration(data)` — appends a row with columns: Timestamp, Name, Email, Phone, Ticket Type, Payment ID, Order ID, Amount, Status
- Error-tolerant: catches failures and returns status

#### [NEW] [emailService.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/services/emailService.js)
- Brevo (Sendinblue) SMTP transactional API
- `sendConfirmationEmail(to, name, ticketType, qrCodeDataUrl)` — sends HTML confirmation with QR attachment

#### [NEW] [qrService.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/services/qrService.js)
- `generateQR(registrationId)` — generates unique QR code as data URL using `qrcode` package

---

### Controllers (Orchestration Only)

#### [NEW] [paymentController.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/controllers/paymentController.js)
- `createOrder` — validates input, calls razorpayService, saves pending registration, returns orderId
- `handleWebhook` — **IDEMPOTENT**: verifies HMAC → checks if payment already processed → saves to DB → async fires (Sheets sync, QR gen, email send) → returns 200 FAST

#### [NEW] [authController.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/controllers/authController.js)
- `login` — validates credentials, issues access + refresh JWT
- `refreshToken` — validates refresh token, issues new access token
- `logout` — clears refresh token

#### [NEW] [registrationController.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/controllers/registrationController.js)
- `getAll` (admin, protected) — list all registrations with filtering
- `getById` (admin, protected) — single registration details

#### [NEW] [contactController.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/controllers/contactController.js)
- `submit` — saves contact form to DB

---

### Routes

#### [NEW] [paymentRoutes.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/routes/paymentRoutes.js)
- `POST /api/payment/create-order` — rate-limited, Zod-validated
- `POST /api/payment/webhook` — Razorpay webhook endpoint (raw body)

#### [NEW] [authRoutes.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/routes/authRoutes.js)
- `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`

#### [NEW] [registrationRoutes.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/routes/registrationRoutes.js)
- `GET /api/registrations` (protected), `GET /api/registrations/:id` (protected)

#### [NEW] [contactRoutes.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/routes/contactRoutes.js)
- `POST /api/contact`

---

### App Entry Point

#### [NEW] [server.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/server.js)
Middleware in **strict order**:
1. Helmet → 2. CORS → 3. `express.json({ limit: "10kb" })` → 4. Rate limiter → 5. Routes (JWT on protected only) → 6. Global error handler
- `GET /api/health` health check endpoint
- Env validation runs before anything else (fail-fast)
- MongoDB connection before server.listen()

---

### Project Config

#### [NEW] [package.json](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/package.json)
Dependencies: `express`, `mongoose`, `razorpay`, `googleapis`, `sib-api-v3-sdk`, `qrcode`, `jsonwebtoken`, `bcrypt`, `helmet`, `cors`, `express-rate-limit`, `zod`, `dotenv`, `crypto`

#### [NEW] [.env.example](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/.env.example)
Template of all required environment variables

#### [NEW] [.gitignore](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/.gitignore)
Ignores `node_modules/`, `.env`, logs

---

## Verification Plan

### Automated Tests

1. **Startup validation test** — Run the server without `.env` and confirm it crashes with clear error messages:
   ```bash
   cd server && node server.js
   ```
   Expected: Process exits with Zod validation errors listing missing env vars.

2. **Syntax/import check** — Run Node.js to parse each file:
   ```bash
   cd server && node -e "require('./config/env')" 
   ```
   Expected: Each file parses without syntax errors (env will fail-fast because no .env, which is correct).

### Manual Verification
1. **User to create `.env`** with real MongoDB Atlas URI, Razorpay test keys, Google service account credentials, and Brevo API key, then run `npm start` and confirm the server starts on the configured port.
2. **User to test Razorpay sandbox flow**: call `POST /api/payment/create-order`, use the returned orderId in the Razorpay test checkout modal, and verify the webhook processes the payment, saves to MongoDB, syncs to Google Sheets, generates QR, and sends email.
3. **User to test idempotency**: send the same webhook payload twice and confirm the second is returned as 200 OK without duplicate processing.
