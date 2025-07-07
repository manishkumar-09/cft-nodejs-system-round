const express = require("express");
const router = express.Router();
const {
  userSignUp,
  userLogin,
  userDetails,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");
const authenticate = require("../middlewares/auth");

router.post("/user/signup", userSignUp);
router.post("/user/login", userLogin);
router.get("/user/details", authenticate, userDetails);
router.post("/user/forget-password", forgetPassword);
router.post("/user/reset-password/:id/:token", resetPassword);

module.exports = router;
