const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/authHelpers");
const transporter = require("../utils/emailService");
const {
  generateToken,
  generateResetToken,
  resetTokenVerification,
} = require("../utils/token");

userSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.json({
        success: false,
        message: "User alredy exist with this email",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "Signup successfull",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(existingUser._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);

    const user = await User.findById(id);
    res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (!isExist)
      return res.status(404).json({ message: "User does not exits" });

    const token = generateResetToken(isExist._id);
    const link = `http://localhost:8080/api/user/reset-password/${isExist._id}/${token}`;
    const info = await transporter.sendMail({
      from: "shoppingonline2109@gmail.com",
      to: email,
      subject: "Link for reset user password",
      html: `<a href=${link}>Click to reset password</a>`,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      userId: isExist._id,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  try {
    const isUser = await User.findById(id);
    if (isUser === null) {
      return res.status(401).json({ message: "User is not authorized" });
    }
    const tokenVerification = resetTokenVerification(token);

    if (newPassword === confirmPassword) {
      const hashedPassword = await hashPassword(confirmPassword);
      await User.findByIdAndUpdate(isUser._id, {
        $set: { password: hashedPassword },
      });
    }
    res.status(201).json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  userSignUp,
  userLogin,
  userDetails,
  forgetPassword,
  resetPassword,
};
