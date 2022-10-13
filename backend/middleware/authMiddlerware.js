const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/sendError");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) return sendError(res, "Unauthorized", 401);

  if (token.startsWith("Bearer")) token = token.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_JWT_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      return decoded;
    }
  );

  console.log(decoded);

  if (!decoded) return sendError(res, "Forbidden", 403);

  const user = await User.findById(decoded.user.id);

  const { password, ...authUser } = user._doc;
  req.user = authUser;
  next();
});

module.exports = authMiddleware;
