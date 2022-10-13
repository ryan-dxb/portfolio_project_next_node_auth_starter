const asyncHandler = require("express-async-handler");
const User = require("../../models/User");
const PasswordResetToken = require("../../models/passwordResetToken");
const { generateMailTransporter } = require("../../utils/email");
const { sendError } = require("../../utils/sendError");

const resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.isPasswordMatched(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one!"
    );

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
        <h1>Password Reset Successfully</h1>
        <p>Now you can use new password.</p>
  
      `,
  });

  res.json({
    message: "Password reset successfully, now you can use new password.",
  });
});

module.exports = resetPasswordCtrl;
