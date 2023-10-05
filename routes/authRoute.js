const express = require("express");
const router = express.Router();

const {register,login,verifyToken} = require("../controllers/authController.js")
router.post("/register",register);
router.post("/login",login);
router.get("/:id/verify/:token",verifyToken)
// router.post("/reset-password",resetpassword);
module.exports = router;