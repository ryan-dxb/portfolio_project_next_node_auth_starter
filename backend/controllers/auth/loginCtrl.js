const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { sendError } = require("../../utils/sendError");

const loginCtrl = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const loggedInUser = await User.findOne({ username });

  if (!loggedInUser) return sendError(res, "Invalid Credentials", 400);

  if (!loggedInUser.isActive)
    return sendError(
      res,
      "Account has been suspended. Kindly contact administrator for assistance",
      401
    );

  if (!loggedInUser.isVerified)
    return sendError(
      res,
      "Email is not verified. Please verify your email to login",
      401
    );

  if (loggedInUser && (await loggedInUser.isPasswordMatched(password))) {
    // sign the token

    const accessToken = jwt.sign(
      {
        user: {
          id: loggedInUser._id,
          username: loggedInUser.username,
          email: loggedInUser.email,
        },
      },
      process.env.ACCESS_JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    const refreshToken = jwt.sign(
      {
        user: loggedInUser._id,
      },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // send the token in a HTTP-only cookie

    const { password, ...user } = loggedInUser._doc;

    return res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, user: user, token: accessToken });
  }

  return sendError(res, "Invalid Credentials.", 400);
});

module.exports = loginCtrl;
