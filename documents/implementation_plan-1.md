# Codebase Security Audit and Bug Fix Plan

This document outlines the findings from the codebase audit and the proposed fixes.

## Issues Identified

### Critical Security Issues
1.  **Exposed [.env](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/.env) file**: The [server/.env](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/.env) file is checked into the repository. It contains real production secrets (MongoDB URI, JWT secrets, Razorpay keys, Google Service Account private key).
    *   **Action**: This must be removed from `.git` tracking. The secrets should ideally be rotated immediately after this process.

### Backend Issues
1.  **Rate Limiter IP Tracking**: `express-rate-limit` relies on `req.ip`. If the backend is behind a reverse proxy (like Nginx, which is present in `deploy/nginx.conf`), `app.set('trust proxy', 1)` needs to be enabled in [server.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/server.js) so that rate limiting applies to actual client IPs, not the proxy IP.
2.  **Graceful Shutdown Flaw**: In [server.js](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/server.js), `mongoose.connection.close()` is called, but the server doesn't wait for Mongoose to fully disconnect before `process.exit(0)`.

### Frontend Issues
1.  **Missing 404 Route**: [App.tsx](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/src/App.tsx) lacks a catch-all `*` route for undefined URLs.
2.  **Error Boundary**: Missing a React Error Boundary to catch UI rendering errors gracefully.
3.  **Missing Helmet Info**: The HTML head metadata could be improved for SEO in [index.html](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/index.html).

## Proposed Changes

### Configuration
#### [MODIFY] server/.gitignore
Ensure [.env](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/.env) is correctly ignored (already is, but need to remove from git cache).
#### [NEW] server/.env.example
Create a template environment file without real secrets.

### Backend Components
#### [MODIFY] server/server.js
- Add `app.set('trust proxy', 1 /* number of proxies between user and server */);` to correctly identify client IPs for rate limiting.
- Fix graceful shutdown to `await mongoose.connection.close()`.

### Frontend Components
#### [MODIFY] src/App.tsx
- Add a catch-all route `<Route path="*" element={<Home />} />` (or a dedicated 404 page if one exists, currently there is none, so redirecting to [Home](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/src/pages/Home.tsx#10-302) or showing a simple message is better).

#### [NEW] src/components/ErrorBoundary.tsx
- Add a simple React Error Boundary component to wrap the application logic.

#### [MODIFY] src/main.tsx
- Wrap `<App />` in `<ErrorBoundary>`.

## Verification Plan

### Automated Verification
1.  Verify [.env](file:///c:/Users/AYAAN/OneDrive/Desktop/Coastal%20innovation%20summit/server/.env) is untracked: Run `git ls-files | grep .env` to ensure it's not tracked.
2.  Build frontend: Run `npm run build` in the root to ensure no TypeScript compilation errors.
3.  Start backend: Run `node server.js` from the `server` directory and verify it connects to MongoDB and starts listening on port 5000 without crashing.

### Manual Verification
1.  Verify rate limiting works correctly with proxies (simulation).
2.  Trigger a 404 route on the frontend and ensure it redirects or handles it gracefully.
