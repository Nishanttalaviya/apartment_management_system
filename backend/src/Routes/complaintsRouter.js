const express = require("express");
const router = express.Router();
const complaintController = require("../Controllers/complaintsController");
const { authenticateMember } = require("../Middleware/authMiddleware");
const { complaintUpload } = require("../Config/multerConfig");

// Admin routes
router.get("/all", complaintController.getAllComplaints);

// Member routes
router.get("/", authenticateMember, complaintController.getMyComplaints);
router.get(
  "/:complaintid",
  authenticateMember,
  complaintController.getComplaintById
);
router.post(
  "/",
  authenticateMember,
  complaintUpload.single("image"), // Use the configured upload middleware
  complaintController.createComplaint
);
router.patch(
  "/:complaintid/status",
  complaintController.updateComplaintStatus
);
router.delete(
  "/:complaintid",
  authenticateMember,
  complaintController.deleteComplaint
);

module.exports = router;
