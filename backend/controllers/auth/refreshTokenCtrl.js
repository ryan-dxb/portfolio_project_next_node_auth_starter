const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { sendError } = require("../../utils/sendError");

const refreshTokenCtrl = asyncHandler(async (req, res) => {
  // Destructuring refreshToken from cookie
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return sendError(res, "Unauthorized", 401);

  await jwt.verify(
    refreshToken,
    process.env.REFRESH_JWT_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        id: decoded._id,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      // Correct token we send a new access token and refresh token
      const accessToken = jwt.sign(
        {
          user: {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
          },
        },
        process.env.ACCESS_JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );

      res.json({ success: true, accessToken: accessToken });
    }
  );
});

module.exports = refreshTokenCtrl;
