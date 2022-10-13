const { check, validationResult } = require("express-validator");

exports.userValidtor = [
  check("firstName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("First Name is missing!"),

  check("lastName").trim().not().isEmpty().withMessage("Last Name is missing!"),
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is missing!")
    .isAlphanumeric()
    .withMessage(
      "Username should only be alphanumeric. No special characters allowed"
    ),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6 to 20 characters long!"),
];

exports.loginValidator = [
  check("username").trim().not().isEmpty().withMessage("Username is missing!"),
  check("password").trim().not().isEmpty().withMessage("Password is missing!"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6 to 20 characters long!"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    console.log(error);
    return res.json({ error: error[0].msg });
  }

  next();
};
