const express = require("express");
const router = express.Router();
const communityHallController = require("../Controllers/communityHallController");
const { authenticateMember } = require("../Middleware/authMiddleware");

// Admin-only routes
router.get(
  "/",communityHallController.getAllBookings
);

router.patch(
  "/:bookingId/status",communityHallController.updateBookingStatus
);

// Member routes (accessible to both members and admins)
router.get(
  "/my-bookings",
  authenticateMember,
  communityHallController.getMyBookings
);

router.get(
  "/:bookingId",
  authenticateMember,
  communityHallController.getBookingById
);

router.post("/", authenticateMember, communityHallController.createBooking);

router.delete(
  "/:bookingId",
  authenticateMember,
  communityHallController.deleteBooking
);

module.exports = router;
