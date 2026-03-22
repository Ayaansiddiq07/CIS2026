/**
 * Competition model — competition entry submissions.
 */

const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      maxlength: 100,
    },
    leaderName: {
      type: String,
      required: [true, "Leader name is required"],
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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 100,
    },
    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["registered", "shortlisted", "eliminated", "winner"],
      default: "registered",
    },
  },
  { timestamps: true }
);

competitionSchema.index({ email: 1 });
competitionSchema.index({ category: 1 });

module.exports = mongoose.model("Competition", competitionSchema);
