const crypto = require("crypto");

const generateToken = async () => {
  const token = await crypto.randomBytes(30).toString("hex");
  console.log(token);
  return token;
};

module.exports = generateToken;
