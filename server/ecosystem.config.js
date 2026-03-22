/**
 * PM2 Ecosystem Config — Coastal Innovation Summit Backend
 *
 * Fork mode (NOT cluster) — 1 vCPU means no clustering benefit.
 * Auto-restart, max memory 512MB, log rotation.
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 logs cis-backend
 *   pm2 monit
 */

module.exports = {
  apps: [
    {
      name: "cis-backend",
      script: "server.js",
      cwd: __dirname,

      // ── Mode ──
      exec_mode: "fork", // 1 vCPU = no cluster benefit
      instances: 1,

      // ── Restart policy ──
      autorestart: true,
      watch: false,
      max_restarts: 15,
      min_uptime: "10s",
      restart_delay: 3000, // 3s delay between restarts

      // ── Memory limit ──
      max_memory_restart: "512M", // restart if exceeds 512MB (safe for 1GB VPS)

      // ── Graceful shutdown ──
      kill_timeout: 15000, // 15s to drain queue before SIGKILL
      listen_timeout: 10000,
      shutdown_with_message: false,

      // ── Environment ──
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 5000,
      },

      // ── Logging ──
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // ── Node arguments ──
      node_args: "--max-old-space-size=384", // cap V8 heap at 384MB
    },
  ],
};
