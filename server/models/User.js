/**
 * User model — admin users for JWT authentication.
 * Passwords hashed with bcrypt. Refresh token stored for rotation.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ["admin", "organizer"],
      default: "organizer",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Hash password before saving (only if modified).
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

/**
 * Compare candidate password against stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Never return passwordHash or refreshToken in JSON.
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
