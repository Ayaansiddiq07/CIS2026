/**
 * Sponsor model — sponsors/partners for the summit.
 */

const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sponsor name is required"],
      trim: true,
      maxlength: 150,
    },
    logoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    tier: {
      type: String,
      enum: ["title", "gold", "silver", "community"],
      default: "community",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

sponsorSchema.index({ tier: 1, order: 1 });
sponsorSchema.index({ isActive: 1 });

module.exports = mongoose.model("Sponsor", sponsorSchema);
