const User = require("../../models/User");
const EmailVerificationToken = require("../../models/emailVerificationToken");
const asyncHandler = require("express-async-handler");
const { sendError } = require("../../utils/sendError");
const generateOTP = require("../../utils/generateOTP");
const { generateMailTransporter } = require("../../utils/email");

const resendVerifyEmailCtrl = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found!");

  if (user.isVerified)
    return sendError(res, "This email id is already verified!");

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken)
    return sendError(res, "You can request for a new token after one hour");

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside our db
  await EmailVerificationToken.create({
    owner: user._id,
    token: OTP,
  });

  // send that otp to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>
  
      `,
  });

  res.json({
    message: "New OTP has been sent to your registered email accout.",
  });
});

module.exports = resendVerifyEmailCtrl;
