# 🛠️ Developer Setup Manual — CIS Backend

> **Audience**: Fellow developers joining the Coastal Innovation Summit project.
> **Stack**: Node.js · Express · MongoDB Atlas · Razorpay · Google Sheets API · Brevo SMTP

---

## 📁 Project Structure

```
server/
├── server.js                 # Entry point — starts Express, connects DB
├── config/
│   ├── env.js                # Zod env validation (fails on startup if missing)
│   └── db.js                 # Mongoose connection to MongoDB Atlas
├── middleware/
│   ├── helmet.js             # Security HTTP headers (CSP, HSTS)
│   ├── cors.js               # Strict origin allowlist (no wildcards)
│   ├── rateLimiter.js        # 4 tiers: global / auth / payment / webhook
│   ├── auth.js               # JWT Bearer token verification
│   ├── validate.js           # Zod schema validation middleware factory
│   └── errorHandler.js       # Global catch-all error handler
├── models/                   # Mongoose schemas (strict mode)
│   ├── Registration.js       # Core — has unique index on razorpay_payment_id
│   ├── Speaker.js
│   ├── Stall.js
│   ├── Competition.js
│   ├── Contact.js
│   └── User.js               # Admin auth — bcrypt password hashing
├── services/                 # ALL external API logic lives here
│   ├── razorpayService.js    # Create orders + HMAC signature verification
│   ├── sheetService.js       # Google Sheets row append
│   ├── emailService.js       # Brevo transactional email
│   └── qrService.js          # QR code generation
├── controllers/              # Orchestration only — no direct API calls
│   ├── paymentController.js  # Order creation + idempotent webhook
│   ├── authController.js     # Login / refresh / logout
│   ├── registrationController.js  # Admin list/view registrations
│   └── contactController.js  # Contact form submissions
└── routes/                   # Route definitions with Zod schemas
    ├── paymentRoutes.js
    ├── authRoutes.js
    ├── registrationRoutes.js # Protected (JWT required)
    └── contactRoutes.js
```

### Architecture Rules

| Rule | Detail |
|------|--------|
| **Controllers** | Orchestration only. Call services, return responses. Zero API logic. |
| **Services** | ALL external integrations (Razorpay, Google, Brevo). Singleton clients. |
| **Middleware** | Security + validation only. No business logic. |
| **Models** | Strict Mongoose schemas with indexes and validation. |

---

## 🚀 Quick Start

```bash
cd server
cp .env.example .env         # Then fill in real values (see below)
npm install
npm start                    # Production
npm run dev                  # Development (auto-restart on changes)
```

✅ If it works, you'll see:
```
✅ MongoDB connected
🚀 Server running on port 5000
   Health: http://localhost:5000/api/health
```

❌ If `.env` is missing/incomplete, the server crashes immediately with:
```
❌ Environment validation failed:
   → MONGO_URI: MONGO_URI is required
   → JWT_SECRET: JWT_SECRET must be at least 16 characters
   ...
```
**This is intentional** — the app fails fast so you never run with missing secrets.

---

## 🔑 Environment Variables — Setup Guide

### 1. MongoDB Atlas (MONGO_URI)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free M0 cluster
2. Create a database user: **Database Access → Add New Database User**
3. Whitelist your IP: **Network Access → Add IP Address** (use `0.0.0.0/0` for dev)
4. Get connection string: **Connect → Drivers → Copy URI**
5. Replace `<password>` with your DB user password

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/cis?retryWrites=true&w=majority
```

---

### 2. JWT Secrets (JWT_SECRET, JWT_REFRESH_SECRET)

Generate two strong random strings (minimum 16 chars). Use this command:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it **twice** — one for each secret.

```env
JWT_SECRET=<first-random-string>
JWT_REFRESH_SECRET=<second-random-string>
```

> ⚠️ These MUST be different from each other.

---

### 3. Razorpay (RAZORPAY_KEY_ID, RAZORPAY_SECRET, RAZORPAY_WEBHOOK_SECRET)

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys → Generate Key**
3. Copy the **Key ID** (`rzp_test_...`) and **Key Secret**
4. For webhooks: **Settings → Webhooks → Add New Webhook**
   - URL: `https://your-backend-url.com/api/payment/webhook`
   - Events: check **`payment.captured`**
   - Copy the **Webhook Secret**

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

> 🧪 Always use **test mode** keys during development. Switch to live only before launch.

---

### 4. Google Sheets API (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID)

**Step A: Create Service Account**

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project (or select existing)
3. Enable **Google Sheets API**: APIs & Services → Library → search "Google Sheets API" → Enable
4. Create service account: APIs & Services → Credentials → Create Credentials → Service Account
5. Give it a name (e.g. `cis-sheets-writer`)
6. Click the service account → Keys tab → Add Key → JSON
7. Download the JSON file — open it and extract:
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`

**Step B: Create & Share the Sheet**

1. Create a new Google Sheet
2. Name the first tab `Registrations`
3. Add headers in Row 1: `Timestamp | Name | Email | Phone | Ticket Type | Payment ID | Order ID | Amount | Status`
4. **Share the sheet** with the service account email (from `client_email`) — give **Editor** access
5. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{THIS_IS_THE_ID}/edit`

```env
GOOGLE_CLIENT_EMAIL=cis-sheets-writer@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

> ⚠️ The `GOOGLE_PRIVATE_KEY` must be in **one line** with literal `\n` escape characters (as it appears in the JSON file). Wrap the entire value in double quotes.

---

### 5. Brevo SMTP (BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME)

1. Sign up at [app.brevo.com](https://app.brevo.com) (free: 300 emails/day)
2. Go to **SMTP & API → API Keys → Generate a new API key**
3. Set up a verified sender: **Senders & IP → Add a Sender** → verify the email

```env
BREVO_API_KEY=
BREVO_SENDER_EMAIL=noreply@coastalinnovationsummit.com
BREVO_SENDER_NAME=Coastal Innovation Summit
```

---

### 6. Frontend URL (FRONTEND_URL)

The URL of the React frontend. Used for CORS allowlisting.

```env
# Development
FRONTEND_URL=http://localhost:5173

# Production
FRONTEND_URL=https://coastalinnovationsummit.com
```

---

## 📡 API Endpoints Reference

### Public Routes (no auth)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/payment/create-order` | `{ name, email, phone, ticketType }` | Creates Razorpay order, returns `orderId` |
| `POST` | `/api/payment/webhook` | Razorpay payload | Webhook (called by Razorpay, not frontend) |
| `POST` | `/api/auth/login` | `{ email, password }` | Returns access + refresh tokens |
| `POST` | `/api/auth/refresh` | `{ refreshToken }` | Returns new access token |
| `POST` | `/api/auth/logout` | `{ refreshToken }` | Revokes refresh token |
| `POST` | `/api/contact` | `{ name, email, subject, message }` | Submit contact form |

### Protected Routes (JWT required)

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| `GET` | `/api/registrations` | `Authorization: Bearer <token>` | List all registrations (paginated) |
| `GET` | `/api/registrations/:id` | `Authorization: Bearer <token>` | Get single registration |

> Query params for `/api/registrations`: `?status=paid&page=1&limit=50`

### Ticket Types & Prices (server-enforced)

| `ticketType` value | Price | Description |
|----|----|----|
| `gold` | ₹499 | Standard individual pass |
| `diamond` | ₹1,499 | VIP premium pass |
| `bulk` | ₹3,999 | 10x Gold passes for institutions |
| `stall` | ₹4,999 | Exhibition booth booking |

> ⚠️ Prices are set **server-side** in `paymentController.js`. The frontend does NOT control the amount charged.

---

## 💳 Payment Flow (How It Works)

```
Frontend                        Backend                         Razorpay
   │                               │                               │
   │  POST /api/payment/create-order                                │
   │  { name, email, phone,        │                               │
   │    ticketType: "gold" }        │                               │
   │ ─────────────────────────────► │                               │
   │                                │  razorpay.orders.create()     │
   │                                │ ─────────────────────────────►│
   │                                │◄────── order { id, amount }   │
   │                                │                               │
   │                                │  Save pending Registration    │
   │◄─── { orderId, amount } ──────│                               │
   │                                │                               │
   │  Open Razorpay Checkout Modal  │                               │
   │  (user pays via UPI/card)      │                               │
   │ ─────────────────────────────────────────────────────────────►│
   │                                │                               │
   │                                │  POST /api/payment/webhook    │
   │                                │◄──────────────────────────────│
   │                                │                               │
   │                                │  1. Verify HMAC signature     │
   │                                │  2. Check duplicate (idempotent)
   │                                │  3. Update status → "paid"    │
   │                                │  4. Return 200 FAST           │
   │                                │                               │
   │                                │  ── async (non-blocking) ──   │
   │                                │  5. Append to Google Sheets   │
   │                                │  6. Generate QR code          │
   │                                │  7. Send confirmation email   │
```

### Idempotency Guarantee

If Razorpay sends the **same webhook twice** (which it does on retries):
1. Second call hits the duplicate check (`razorpay_payment_id` already exists)
2. Returns `200 { status: "already_processed" }` immediately
3. **Zero side effects** — no double Sheets rows, no double emails

---

## 🔒 Middleware Execution Order

Every request passes through this chain **in exact order**:

```
Request
  │
  ▼
1. Helmet         → Attaches security headers (CSP, HSTS, X-Frame-Options)
  │
  ▼
2. CORS           → Checks Origin against allowlist, blocks unknown origins
  │
  ▼
3. express.json   → Parses body (10KB limit), captures raw body for webhooks
  │
  ▼
4. Rate Limiter   → Per-IP throttle (100/15min global, 10/15min for auth)
  │
  ▼
5. Route Handler  → Zod validation → Controller → Service calls
  │
  ▼
6. Error Handler  → Catches unhandled errors, returns safe JSON
```

---

## 🧑‍💻 Creating an Admin User

There is no registration endpoint for admins (by design — security). Create one manually:

```bash
cd server
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.create({
    email: 'admin@coastalinnovationsummit.com',
    passwordHash: 'YourStrongPassword123!',
    name: 'Admin',
    role: 'admin'
  });
  console.log('Admin created');
  process.exit();
})();
"
```

> The `passwordHash` field is auto-hashed by the pre-save hook — you pass the **plain text** password and bcrypt handles it.

Then login via API:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@coastalinnovationsummit.com","password":"YourStrongPassword123!"}'
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Server crashes on startup | Check `.env` — Zod errors tell you exactly which var is missing |
| `CORS policy violation` | Make sure `FRONTEND_URL` in `.env` matches your frontend's exact origin |
| Google Sheets not appending | Verify you shared the sheet with the service account email |
| `GOOGLE_PRIVATE_KEY` errors | Make sure `\n` in the key are literal escape chars, wrapped in quotes |
| Webhook returns 400 | Check `RAZORPAY_WEBHOOK_SECRET` matches what's in Razorpay dashboard |
| Duplicate `razorpay_payment_id` error | This is **intentional** — idempotency working correctly |
| `TokenExpiredError` on API calls | Access token expired (15min). Call `/api/auth/refresh` to get a new one |

---

## 📦 Deployment to Render

1. Push `server/` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add ALL env vars from `.env` in Render's Environment tab
7. Set up Razorpay webhook URL to: `https://your-render-app.onrender.com/api/payment/webhook`
