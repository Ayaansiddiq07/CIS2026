/**
 * SiteContent model — singleton storing editable website content.
 * pricing, event info, hero section etc.
 */

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceDisplay: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    features: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "singleton",
      unique: true,
      immutable: true,
    },
    pricing: {
      gold: { type: ticketSchema, default: () => ({}) },
      diamond: { type: ticketSchema, default: () => ({}) },
      bulk: { type: ticketSchema, default: () => ({}) },
      stall: { type: ticketSchema, default: () => ({}) },
    },
    eventInfo: {
      date: { type: String, default: "2026 MAY 10" },
      venue: { type: String, default: "GOVINDA PAI SMARAKAM, MANJESHWAR" },
      tagline: {
        type: String,
        default: "FIRST OF ITS KIND IN THE REGION",
      },
      description: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

/**
 * Get or create the singleton document.
 */
siteContentSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ type: "singleton" });
  if (!doc) {
    doc = await this.create({
      type: "singleton",
      pricing: {
        gold: {
          label: "Gold Delegate",
          price: 499,
          priceDisplay: "₹499",
          unit: "/Person",
          description:
            "Standard individual access pass for lean founders and students.",
          features: [
            "Full Access to Main Stage",
            "Access to Activity Zones",
            "Standard Networking",
          ],
          featured: false,
        },
        diamond: {
          label: "Diamond VIP",
          price: 1499,
          priceDisplay: "₹1,499",
          unit: "/Person",
          description:
            "Premium experience for investors and established pros.",
          features: [
            "Priority Seating on Main Stage",
            "VIP Networking Lounge Access",
            "Private Speaker Q&A",
            "Exclusive Merchandise",
          ],
          featured: true,
        },
        bulk: {
          label: "Bulk Pass",
          price: 3999,
          priceDisplay: "₹3,999",
          unit: "/10 Passes",
          description:
            "Designed for institutions, colleges, and corporate teams.",
          features: [
            "10x Gold Delegate Passes",
            "Fast-track Group Registration",
            "Dedicated POC Assistance",
          ],
          featured: false,
        },
        stall: {
          label: "Stall Space",
          price: 4999,
          priceDisplay: "₹4,999",
          unit: "/Booth",
          description:
            "Showcase your startup, rural enterprise, or tech project.",
          features: [
            "3x3 Meter Premium Stall Space",
            "2x Exhibitor Passes",
            "Logo in Partner Directory",
            "Pitch Opportunity",
          ],
          featured: false,
        },
      },
    });
  }
  return doc;
};

module.exports = mongoose.model("SiteContent", siteContentSchema);
