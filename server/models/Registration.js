/**
 * Registration model — core schema for paid attendees.
 * razorpay_payment_id has a UNIQUE sparse index for idempotency.
 * qrCode is transparently compressed/decompressed via async Mongoose hooks.
 */

const mongoose = require("mongoose");
const { compress, decompress } = require("../services/compressionService");

const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
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
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },
    ticketType: {
      type: String,
      required: [true, "Ticket type is required"],
      enum: {
        values: ["gold", "diamond", "bulk", "stall"],
        message: "Ticket type must be gold, diamond, bulk, or stall",
      },
    },
    razorpay_order_id: {
      type: String,
      required: [true, "Razorpay order ID is required"],
      trim: true,
    },
    razorpay_payment_id: {
      type: String,
      trim: true,
      // NO default — field must be ABSENT (not null) for sparse unique index
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    syncStatus: {
      type: String,
      enum: ["pending", "synced", "failed"],
      default: "pending",
    },
    qrCode: {
      type: Buffer, // stored as compressed binary — ~50% smaller than raw base64
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
registrationSchema.index({ email: 1 });
registrationSchema.index({ razorpay_order_id: 1 });
registrationSchema.index(
  { razorpay_payment_id: 1 },
  { unique: true, sparse: true }
);
registrationSchema.index({ status: 1, createdAt: -1 });

// ── Async compression hooks ──

/**
 * Pre-save: compress qrCode string → Buffer (ASYNC, non-blocking).
 */
registrationSchema.pre("save", async function () {
  if (this.isModified("qrCode") && this.qrCode && typeof this.qrCode === "string") {
    this.qrCode = await compress(this.qrCode);
  }
});

/**
 * Post-find: decompress qrCode Buffer → string (ASYNC, non-blocking).
 */
async function decompressQR(doc) {
  if (doc && doc.qrCode) {
    doc.qrCode = await decompress(doc.qrCode);
  }
}

registrationSchema.post("findOne", async function (doc) {
  await decompressQR(doc);
});

registrationSchema.post("find", async function (docs) {
  if (Array.isArray(docs)) {
    await Promise.all(docs.map(decompressQR));
  }
});

registrationSchema.post("findById", async function (doc) {
  await decompressQR(doc);
});

module.exports = mongoose.model("Registration", registrationSchema);
