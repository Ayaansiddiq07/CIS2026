/**
 * Public content routes — unauthenticated endpoints for frontend.
 * Cache-Control: 60s for public content (reduces DB hits on page loads).
 */

const express = require("express");
const SiteContent = require("../models/SiteContent");
const Speaker = require("../models/Speaker");
const Sponsor = require("../models/Sponsor");

const router = express.Router();

// ── Cache middleware for public content (60s) ──
function cachePublic(seconds = 60) {
  return (_req, res, next) => {
    res.set("Cache-Control", `public, max-age=${seconds}`);
    next();
  };
}

/**
 * GET /api/content — public site content (pricing, event info).
 */
router.get("/", cachePublic(60), async (req, res, next) => {
  try {
    const content = await SiteContent.getSingleton();
    res.json({
      pricing: content.pricing,
      eventInfo: content.eventInfo,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/content/speakers — approved speakers only.
 */
router.get("/speakers", cachePublic(60), async (req, res, next) => {
  try {
    const speakers = await Speaker.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.json(speakers);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/content/sponsors — active sponsors only.
 */
router.get("/sponsors", cachePublic(60), async (req, res, next) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort({
      tier: 1,
      order: 1,
    });
    res.json(sponsors);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
