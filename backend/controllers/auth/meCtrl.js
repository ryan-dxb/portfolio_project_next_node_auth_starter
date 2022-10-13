const asyncHandler = require("express-async-handler");

const meCtrl = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = meCtrl;
