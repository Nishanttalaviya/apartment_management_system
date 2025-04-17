const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();
const Razorpay = require("razorpay"); // Add this import at the top
const crypto = require("crypto"); // Add this for signature verification

// Get all maintenance records (admin only)
const getAllMaintenance = async (req, res) => {
  try {
    // Only allow if user is admin
    if (req.member.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const result = await c1.query("SELECT * FROM Maintenance");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get maintenance records for the currently authenticated member
const getMaintenanceForCurrentMember = async (req, res) => {
  try {
    const memberId = req.member.memberid; // Get from authenticated user

    const result = await c1.query(
      "SELECT * FROM Maintenance WHERE memberid = $1",
      [memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No maintenance records found" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific maintenance record by ID (only if belongs to user or is admin)
const getMaintenanceById = async (req, res) => {
  try {
    const { maintenanceId } = req.params;

    // First get the maintenance record
    const result = await c1.query(
      "SELECT * FROM Maintenance WHERE maintenanceId = $1",
      [maintenanceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }

    // Check if user owns this record or is admin
    if (
      result.rows[0].memberid !== req.member.memberid &&
      req.member.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching maintenance record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new maintenance record (admin only)
const createMaintenance = async (req, res) => {
  // Only allow admin to create maintenance records
  if (req.member.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const { memberId, dueDate, amount, status } = req.body;

  try {
    // Generate new maintenance ID
    const lastIdResult = await c1.query(
      "SELECT maintenanceId FROM Maintenance ORDER BY maintenanceId DESC LIMIT 1"
    );

    let newId = "MT1";
    if (lastIdResult.rows.length > 0) {
      const lastMaintenanceId = lastIdResult.rows[0].maintenanceid;
      const lastNumber = parseInt(lastMaintenanceId.substring(2)) || 0;
      newId = `MT${lastNumber + 1}`;
    }

    const query = `
      INSERT INTO Maintenance (maintenanceId, memberId, dueDate, amount, status)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [newId, memberId, dueDate, amount, status];

    const result = await c1.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating maintenance record:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a maintenance record (admin only)
const updateMaintenance = async (req, res) => {
  // Only allow admin to update maintenance records
  if (req.member.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const { maintenanceId } = req.params;
    const { memberid, dueDate, amount, status } = req.body;

    const result = await c1.query(
      `UPDATE Maintenance 
       SET memberid = $1, dueDate = $2, amount = $3, status = $4 
       WHERE maintenanceId = $5 RETURNING *`,
      [memberid, dueDate, amount, status, maintenanceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a maintenance record (admin only)
const deleteMaintenance = async (req, res) => {
  // Only allow admin to delete maintenance records
  if (req.member.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const { maintenanceId } = req.params;

    const result = await c1.query(
      "DELETE FROM Maintenance WHERE maintenanceId = $1 RETURNING *",
      [maintenanceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    res.json({ message: "Maintenance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting maintenance record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: "rzp_test_jQOReseIWUxIfd",
    key_secret: "aEM8dA6xjVN2wE6mm16ut2Zm",
  });
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
  process.exit(1); // Exit if Razorpay can't be initialized
}

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, maintenanceId } = req.body;

    // Validate input parameters
    if (!amount || !currency || !maintenanceId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Validate the maintenance record
    const maintenanceResult = await c1.query(
      "SELECT * FROM Maintenance WHERE maintenanceid = $1 AND memberid = $2 AND status = 'Pending'",
      [maintenanceId, req.member.memberid]
    );

    if (maintenanceResult.rows.length === 0) {
      return res.status(404).json({
        error: "Maintenance record not found or already paid",
        details: {
          maintenanceId,
          memberId: req.member.memberid,
        },
      });
    }

    const maintenance = maintenanceResult.rows[0];

    // Verify amount matches the record
    if (amount != maintenance.amount * 100) {
      return res.status(400).json({
        error: "Amount mismatch",
        expected: maintenance.amount * 100,
        received: amount,
      });
    }

    const options = {
      amount: amount.toString(), // Razorpay expects string
      currency,
      receipt: `maint_${maintenanceId}_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      error: "Failed to create payment order",
      details: error.message || error.description,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      maintenanceId,
    } = req.body;

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid signature" });
    }

    // Update maintenance record
    const updateQuery = `
      UPDATE Maintenance 
      SET 
        status = 'Paid', 
        paymentdate = NOW(),
        paymentmethod = 'Razorpay',
        transactionid = $1
      WHERE maintenanceid = $2
      RETURNING *`;

    const updateValues = [razorpay_payment_id, maintenanceId];

    const updateResult = await c1.query(updateQuery, updateValues);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Maintenance record not found",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      error: "Payment verification failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
module.exports = {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceForCurrentMember,
  createRazorpayOrder,
  verifyPayment,
};
