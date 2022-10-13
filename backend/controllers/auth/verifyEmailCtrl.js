const EmailVerificationToken = require("../../models/emailVerificationToken");
const User = require("../../models/User");
const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { sendError } = require("../../utils/sendError");
const { generateMailTransporter } = require("../../utils/email");

const verifyEmailCtrl = asyncHandler(async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return res.json({ error: "Invalid user!" });

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found!", 404);

  if (user.isVerified) return sendError(res, "User is already verified!");

  const token = await EmailVerificationToken.findOne({ owner: userId });

  if (!token)
    return sendError(res, "Token Invalid, please request for a new token");

  console.log(token);

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please submit a valid OTP!");

  user.isVerified = true;
  await user.save();

  console.log(token);

  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Welcome to our app and thanks for choosing us.</h1>",
  });
  res.json({ user: user, message: "Your email is verified." });
});

module.exports = verifyEmailCtrl;
