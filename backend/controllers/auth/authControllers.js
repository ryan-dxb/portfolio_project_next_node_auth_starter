const registerCtrl = require("./registerCtrl");
const verifyEmailCtrl = require("./verifyEmailCtrl");
const loginCtrl = require("./loginCtrl");
const meCtrl = require("./meCtrl");
const refreshTokenCtrl = require("./refreshTokenCtrl");
const resendVerifyEmailCtrl = require("./resendVerifyEmailCtrl");
const forgotPasswordCtrl = require("./forgotPasswordCtrl");
const resetPasswordCtrl = require("./resetPasswordCtrl");

exports.controller = {
  registerCtrl,
  verifyEmailCtrl,
  loginCtrl,
  meCtrl,
  refreshTokenCtrl,
  resendVerifyEmailCtrl,
  forgotPasswordCtrl,
  resetPasswordCtrl,
};
