#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────
# deploy.sh — VPS-side deploy script
# Can be run manually: bash deploy/deploy.sh
# ──────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"
HEALTH_URL="http://127.0.0.1:5000/api/health"
MAX_RETRIES=5
RETRY_DELAY=3

cd "$SERVER_DIR"

echo "╔═══════════════════════════════════════════╗"
echo "║   CIS Backend — Manual Deploy Script      ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ── 1. Install production dependencies ──
echo "→ Installing production dependencies..."
npm ci --omit=dev
echo "  ✓ Dependencies installed"
echo ""

# ── 2. Reload PM2 (zero-downtime) ──
echo "→ Reloading PM2 process..."
if pm2 describe cis-backend > /dev/null 2>&1; then
  pm2 reload ecosystem.config.js
  echo "  ✓ PM2 reloaded (zero-downtime)"
else
  pm2 start ecosystem.config.js
  echo "  ✓ PM2 started (first run)"
fi
pm2 save
echo ""

# ── 3. Health check with retries ──
echo "→ Running health check (max ${MAX_RETRIES} attempts)..."
sleep 2

for i in $(seq 1 "$MAX_RETRIES"); do
  STATUS=$(curl -sf "$HEALTH_URL" 2>/dev/null | grep -o '"status":"ok"' || true)
  if [ -n "$STATUS" ]; then
    echo "  ✅ Health check passed on attempt $i!"
    echo ""
    echo "Deploy complete. Server is healthy."
    pm2 list
    exit 0
  fi
  echo "  Attempt $i/$MAX_RETRIES failed, retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
done

echo ""
echo "  ❌ Health check FAILED after $MAX_RETRIES attempts."
echo ""
echo "  Troubleshooting:"
echo "    pm2 logs cis-backend --lines 50"
echo "    pm2 describe cis-backend"
echo "    curl -v $HEALTH_URL"
exit 1
