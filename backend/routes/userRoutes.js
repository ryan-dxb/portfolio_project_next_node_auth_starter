const express = require("express");
const userControllers = require("../controllers/user/userControllers");
const resetPasswordCtrl = require("../controllers/auth/resetPasswordCtrl");
const authMiddleware = require("../middleware/authMiddlerware");
const {
  userValidtor,
  validate,
  loginValidator,
  validatePassword,
} = require("../middleware/validators");
const validPasswordResetToken = require("../middleware/validPasswordResetToken");
const {
  profilePhotoResize,
  photoUpload,
} = require("../middleware/photoUpload");

const router = express.Router();

// Profile Picture
router.post(
  "/profile-picture",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  userControllers.controller.profilePhotoUploadCtrl
);

module.exports = router;
