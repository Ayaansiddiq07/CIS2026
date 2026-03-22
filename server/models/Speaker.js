/**
 * Speaker model — speaker application submissions.
 */

const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: 1000,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

speakerSchema.index({ email: 1 });
speakerSchema.index({ status: 1 });

module.exports = mongoose.model("Speaker", speakerSchema);
