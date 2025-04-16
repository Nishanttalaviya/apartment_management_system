const express = require("express");
const router = express.Router();
const authController = require("./authController");
const { authenticateMember } = require("../Middleware/authMiddleware");

// Public routes
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authenticateMember, authController.getProfile);

module.exports = router;
