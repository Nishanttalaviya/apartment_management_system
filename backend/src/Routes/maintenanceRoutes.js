const express = require("express");
const router = express.Router();
const maintenanceController = require("../Controllers/maintenanceController");
const { authenticateMember } = require("../Middleware/authMiddleware");

// Routes for maintenance
router.get("/", authenticateMember, maintenanceController.getAllMaintenance);
router.get(
  "/:maintenanceId",
  authenticateMember,
  maintenanceController.getMaintenanceById
);
router.post("/", authenticateMember, maintenanceController.createMaintenance);
router.put(
  "/:maintenanceId",
  authenticateMember,
  maintenanceController.updateMaintenance
);
router.delete(
  "/:maintenanceId",
  authenticateMember,
  maintenanceController.deleteMaintenance
);
router.get(
  "/member/me",
  authenticateMember,
  maintenanceController.getMaintenanceForCurrentMember
);

// In your maintenanceRoutes.js
router.post(
  "/create-order",
  authenticateMember,
  maintenanceController.createRazorpayOrder
);
router.post(
  "/verify-payment",
  authenticateMember,
  maintenanceController.verifyPayment
);

module.exports = router;
