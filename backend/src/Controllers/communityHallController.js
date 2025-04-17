const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {

    const query = `
      SELECT 
        chb.bookingId,
        chb.memberId,
        chb.hall,
        chb.date,
        chb.timeSlot,
        chb.purpose,
        chb.status,
        m.name
      FROM 
        CommunityHallBooking chb
      JOIN 
        Members m ON chb.memberId = m.memberId
    `;

    const result = await c1.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get bookings by authenticated member
const getMyBookings = async (req, res) => {
  try {
    const query = `
      SELECT 
        chb.bookingId,
        chb.memberid,
        chb.hall,
        chb.date,
        chb.timeSlot,
        chb.purpose,
        chb.status,
        m.name
      FROM 
        CommunityHallBooking chb
      JOIN 
        Members m ON chb.memberid = m.memberid
      WHERE 
        chb.memberid = $1
      ORDER BY
        chb.date DESC, chb.timeSlot ASC
    `;
    const values = [req.member.memberid];

    const result = await c1.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get booking by ID (admin or owner)
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT 
        chb.bookingId,
        chb.memberId,
        chb.hall,
        chb.date,
        chb.timeSlot,
        chb.purpose,
        chb.status,
        m.name
      FROM 
        CommunityHallBooking chb
      JOIN 
        Members m ON chb.memberId = m.memberId
      WHERE 
        chb.bookingId = $1
    `;

    const result = await c1.query(query, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if requester is admin or booking owner
    if (
      req.user.role !== "admin" &&
      req.user.memberid !== result.rows[0].memberid
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { hall, date, timeSlot, purpose } = req.body;

    // Validate required fields
    if (!hall || !date || !timeSlot || !purpose) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for existing bookings for the same hall, date and time slot
    const existingBooking = await c1.query(
      `SELECT bookingId FROM CommunityHallBooking 
       WHERE hall = $1 AND date = $2 AND timeSlot = $3 AND status = 'Approved'`,
      [hall, date, timeSlot]
    );

    if (existingBooking.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Time slot already booked for this hall" });
    }

    // Get the last bookingId
    const lastIdResult = await c1.query(
      "SELECT bookingId FROM CommunityHallBooking ORDER BY bookingId DESC LIMIT 1"
    );

    let newId;
    if (lastIdResult.rows.length === 0) {
      newId = "B1";
    } else {
      const lastBookingId = lastIdResult.rows[0].bookingid;
      const lastNumber = parseInt(lastBookingId.substring(1));
      newId = `B${lastNumber + 1}`;
    }

    const query = `
      INSERT INTO CommunityHallBooking 
        (bookingId, memberid, hall, date, timeSlot, purpose, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
      RETURNING *
    `;
    const values = [
      newId,
      req.member.memberid, // From authenticated user
      hall,
      date,
      timeSlot,
      purpose,
    ];

    const result = await c1.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {

    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await c1.query(
      `UPDATE CommunityHallBooking 
       SET status = $1 
       WHERE bookingId = $2 
       RETURNING *`,
      [status, bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete booking (Admin or owner)
const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // First get the booking to check ownership
    const bookingResult = await c1.query(
      "SELECT memberid, status FROM CommunityHallBooking WHERE bookingId = $1",
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingResult.rows[0];

    // Check if requester is admin or booking owner
    if (
      req.member.role !== "admin" &&
      req.member.memberid !== booking.memberid
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // If booking is already approved, only admin can delete it
    if (booking.status === "Approved" && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Cannot delete approved booking. Please contact admin.",
      });
    }

    const deleteResult = await c1.query(
      "DELETE FROM CommunityHallBooking WHERE bookingId = $1 RETURNING *",
      [bookingId]
    );

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};