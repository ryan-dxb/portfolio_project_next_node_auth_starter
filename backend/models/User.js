const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    profilePhoto: {
      type: String,
      trim: true,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: { type: String, unique: true, trim: true, required: true },
    username: { type: String, unique: true, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isEmployee: { type: Boolean, required: true, default: false },
    isVistior: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
