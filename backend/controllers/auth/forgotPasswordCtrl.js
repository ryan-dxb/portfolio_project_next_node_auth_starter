const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { sendError } = require("../../utils/sendError");
const generateToken = require("../../utils/generateToken");
const PasswordResetToken = require("../../models/passwordResetToken");
const { generateMailTransporter } = require("../../utils/email");

const forgotPasswordCtrl = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "Email is required!");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Your email is not registered with us", 404);

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(
      res,
      "You can request for a new password reset link after one hour",
      400
    );

  const token = await generateToken();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
          <p>Click here to reset password</p>
          <a href='${resetPasswordUrl}'>Change Password</a>

        `,
  });

  res.json({ success: true, message: "Link sent to your email!" });
});

module.exports = forgotPasswordCtrl;
