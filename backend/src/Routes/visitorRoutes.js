const express = require("express");
const router = express.Router();
const visitorController = require("../Controllers/visitorController");
const { authenticateMember } = require("../Middleware/authMiddleware");

// Debug logging to verify the controller import
console.log("Visitor Controller:", visitorController);

// Get all visitors (authenticateMemberd users only)
router.get("/", visitorController.getAllVisitors);

// Get specific visitor (authenticateMemberd users only)
router.get("/:visitorId", authenticateMember, visitorController.getVisitorById);

// Create new visitor (authenticateMemberd users only)
router.post("/", authenticateMember,visitorController.createVisitor);

router.post("/public", visitorController.createVisitorPublic);


// Update visitor (authenticateMemberd users only)
router.put("/:visitorId", visitorController.updateVisitor);

// Delete visitor (authenticateMemberd users only)
router.delete("/:visitorId",authenticateMember, visitorController.deleteVisitor);

module.exports = router;
