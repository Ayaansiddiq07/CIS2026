/**
 * Auth controller — handles login, token refresh, and logout.
 * JWT access + refresh token pattern.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

/**
 * POST /api/auth/login
 * Validates credentials and issues access + refresh tokens.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Store refresh token in DB (for rotation/revocation)
    user.refreshToken = refreshToken;
    await user.save();

    logger.info({ email }, "Login successful");

    res.json({
      accessToken,
      refreshToken,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Validates refresh token and issues a new access token.
 */
async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: "Refresh token revoked" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Clears the stored refresh token (revokes it).
 */
async function logout(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null }
      );
    }

    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, refreshToken, logout };
