const express = require("express");
const authControllers = require("../controllers/auth/authControllers");
const resetPasswordCtrl = require("../controllers/auth/resetPasswordCtrl");
const authMiddleware = require("../middleware/authMiddlerware");
const {
  userValidtor,
  validate,
  loginValidator,
  validatePassword,
} = require("../middleware/validators");
const validPasswordResetToken = require("../middleware/validPasswordResetToken");

const router = express.Router();

// Authentication Routes
router.post(
  "/register",
  userValidtor,
  validate,
  authControllers.controller.registerCtrl
);
router.post(
  "/login",
  loginValidator,
  validate,
  authControllers.controller.loginCtrl
);
router.get("/me", authMiddleware, authControllers.controller.meCtrl);
router.post("/refresh", authControllers.controller.refreshTokenCtrl);

// Email Verification Routes
router.post("/verify", authControllers.controller.verifyEmailCtrl);
router.post("/resend-verify", authControllers.controller.resendVerifyEmailCtrl);

// Password Reset Routes
router.post("/forgot-password", authControllers.controller.forgotPasswordCtrl);
router.post("/verify-pass-reset-token", validPasswordResetToken, (req, res) => {
  res.json({ valid: true });
});
router.post(
  "/reset-password",
  validatePassword,
  validate,
  validPasswordResetToken,
  resetPasswordCtrl
);

module.exports = router;
