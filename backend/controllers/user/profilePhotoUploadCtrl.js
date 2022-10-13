const asyncHandler = require("express-async-handler");
const { sendError } = require("../../utils/sendError");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const User = require("../../models/User");
const fs = require("fs");

const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!req.file) return sendError(res, "Kindly upload profile picture", 400);

  //1. Get the path to img
  const localPath = `public/images/profile/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded?.url,
    },
    { new: true }
  );
  //remove the saved img
  fs.unlinkSync(localPath);
  return res.json({ success: true, image: imgUploaded });
});

module.exports = profilePhotoUploadCtrl;
