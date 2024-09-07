const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/refresh-token", authController.refreshToken);
router.post("/verify-token", authController.verifyToken);
router.post("/register", authController.register);

module.exports = router;
