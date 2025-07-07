const jwt = require("jsonwebtoken");
const secret_Key = process.env.JWT_SECRET;
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secret_Key, { expiresIn: "7d" });
};

const generateResetToken = (userId) => {
  return jwt.sign({ id: userId }, secret_Key, { expiresIn: "5m" });
};

const resetTokenVerification = (token) => {
  return jwt.verify(token, secret_Key);
};
module.exports = { generateToken, generateResetToken, resetTokenVerification };
