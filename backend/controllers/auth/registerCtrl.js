const asyncHandler = require("express-async-handler");
const User = require("../../models/User");
const EmailVerificationToken = require("../../models/emailVerificationToken");
const generateOTP = require("../../utils/generateOTP");
const { generateMailTransporter } = require("../../utils/email");

const registerCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User Already Exists" });
  }

  //Register user
  const savedUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    username,
  });

  console.log(savedUser.email);

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside our db

  await EmailVerificationToken.create({
    owner: savedUser._id,
    token: OTP,
  });
  // send that otp to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: savedUser.email,
    subject: "Email Verification",
    html: `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>
  
      `,
  });

  res.status(201).send({
    user: savedUser._id,
    message:
      "Please verify your email. OTP has been sent to your email accont!",
  });
});

module.exports = registerCtrl;
