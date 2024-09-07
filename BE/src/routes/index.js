const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");

// const rateLimit = require("express-rate-limit");
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 15,
//   message: "Too many requests from this IP, please try again later.",
// });

router.use("/auth", authRoutes);
// router.use("/api", apiLimiter);
router.use("/api/users", userRoutes);
router.use("/api", postRoutes);

module.exports = router;
