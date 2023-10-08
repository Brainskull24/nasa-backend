const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetpassword,
  checkSpam,
} = require("../controllers/authController.js");
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetpassword);

module.exports = router;
