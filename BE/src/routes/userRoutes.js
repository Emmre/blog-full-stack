const express = require("express");
const router = express.Router();
const {
  getUserById,
  updateUserById,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { cache } = require("../middleware/cacheMiddleware");
const { upload } = require("../middleware/multerMiddleware");

// router.get("/", getAllUsers);
// router.post("/", addUser);
router.post("/update/:id", upload.single("image"), updateUserById);
router.get("/:id", getUserById);

module.exports = router;
