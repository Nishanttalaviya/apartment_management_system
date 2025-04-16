const express = require("express");
const router = express.Router();
const memberController = require("../Controllers/membersController");
const { authenticateMember } = require("../Middleware/authMiddleware");

// Protected routes with JWT authentication
router.get("/", memberController.getAllMembers);
router.get("/:memberId", authenticateMember, memberController.getMemberById);
router.post("/", memberController.createMember);
router.put("/:memberId", memberController.updateMember);
router.delete("/:memberId", memberController.deleteMember);
router.patch(
  "/:memberId/status",
  memberController.toggleMemberStatus
);

module.exports = router;
