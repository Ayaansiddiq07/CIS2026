/**
 * Stall model — stall/booth booking submissions.
 */

const mongoose = require("mongoose");

const stallSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 150,
    },
    contactName: {
      type: String,
      required: [true, "Contact name is required"],
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
      required: [true, "Phone is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },
    stallType: {
      type: String,
      required: [true, "Stall type is required"],
      enum: ["standard", "premium"],
      default: "standard",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    razorpay_order_id: {
      type: String,
      trim: true,
      default: null,
    },
    razorpay_payment_id: {
      type: String,
      trim: true,
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

stallSchema.index({ email: 1 });
stallSchema.index({ status: 1 });

module.exports = mongoose.model("Stall", stallSchema);
