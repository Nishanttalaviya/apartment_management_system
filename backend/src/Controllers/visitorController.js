const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();

// Get all visitors for a specific apartment (member) or all visitors (admin)
const getAllVisitors = async (req, res) => {
  try {
    const query = "SELECT * FROM VisitorInfo";
    const result = await c1.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get visitor by ID (member can only see their own visitors)
const getVisitorById = async (req, res) => {
  try {
    const { visitorId } = req.params;
    let query;
    let values = [visitorId];

    if (req.member.role === "admin") {
      query = "SELECT * FROM VisitorInfo WHERE visitorId = $1";
    } else {
      query =
        "SELECT * FROM VisitorInfo WHERE visitorId = $1 AND apartmentnumber = $2";
      values.push(req.member.apartment_no);
    }

    const result = await c1.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching visitor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new visitor (only for members)
const createVisitor = async (req, res) => {
  try {
    // console.log("Authenticated Member Data:", req.member); // Debug log

    // if (!req.member?.apartment_no) {
    //   return res.status(400).json({
    //     error: "Apartment number not found in member data",
    //     memberData: req.member, // Include member data in response for debugging
    //   });
    // }

    const { visitorname, purpose, contact, indatetime, status } = req.body;

    // Validate required fields
    if (!visitorname || !purpose) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["visitorname", "purpose"],
      });
    }

    // Generate visitor ID
    const lastIdResult = await c1.query(
      "SELECT visitorid FROM VisitorInfo ORDER BY visitorid DESC LIMIT 1"
    );

    let newId = "VI1";
    if (lastIdResult.rows.length > 0) {
      const lastId = lastIdResult.rows[0].visitorid;
      const lastNum = parseInt(lastId.substring(2)) || 0;
      newId = `VI${lastNum + 1}`;
    }

    const result = await c1.query(
      `INSERT INTO VisitorInfo 
       (visitorid, visitorname, apartmentnumber, purpose, contact, indatetime, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        newId,
        visitorname,
        req.member.apartment_no, // This should now work
        purpose,
        contact || null,
        indatetime || new Date().toISOString(),
        status || "Pending",
      ]
    );

    res.status(201).json({
      success: true,
      visitor: result.rows[0],
    });
  } catch (error) {
    console.error("Visitor creation error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      memberData: req.member, // Include member data for debugging
    });
  }
};

const createVisitorPublic = async (req, res) => {
  try {
    const { visitorName, purpose, contact, apartmentnumber, indatetime } =
      req.body;

    // Validate required fields
    if (
      !visitorName ||
      !purpose ||
      !contact ||
      !apartmentnumber ||
      !indatetime
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "visitorName",
          "purpose",
          "contact",
          "apartmentnumber",
          "indatetime",
        ],
      });
    }

    // Generate visitor ID
    const lastIdResult = await c1.query(
      "SELECT visitorid FROM VisitorInfo ORDER BY visitorid DESC LIMIT 1"
    );

    let newId = "VI1";
    if (lastIdResult.rows.length > 0) {
      const lastId = lastIdResult.rows[0].visitorid;
      const lastNum = parseInt(lastId.substring(2)) || 0;
      newId = `VI${lastNum + 1}`;
    }

    const result = await c1.query(
      `INSERT INTO VisitorInfo 
       (visitorid, visitorname, apartmentnumber, purpose, contact, indatetime, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        newId,
        visitorName,
        apartmentnumber,
        purpose,
        contact,
        indatetime,
        "Pending", // Default status
      ]
    );

    res.status(201).json({
      success: true,
      visitor: result.rows[0],
    });
  } catch (error) {
    console.error("Public visitor creation error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Update visitor (member can update their own visitors, admin can update any)
const updateVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const { visitorName, purpose, contact, indatetime, outdatetime, status } =
      req.body;

    // First get the visitor to verify exists (removed apartment_no check since admin can update any)
    const visitorResult = await c1.query(
      "SELECT * FROM VisitorInfo WHERE visitorid = $1",
      [visitorId]
    );

    if (visitorResult.rows.length === 0) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Use consistent column names (match your database)
    if (visitorName !== undefined) {
      updates.push(`visitorname = $${paramIndex}`);
      values.push(visitorName);
      paramIndex++;
    }
    if (purpose !== undefined) {
      updates.push(`purpose = $${paramIndex}`);
      values.push(purpose);
      paramIndex++;
    }
    if (contact !== undefined) {
      updates.push(`contact = $${paramIndex}`);
      values.push(contact);
      paramIndex++;
    }
    if (indatetime !== undefined) {
      updates.push(`indatetime = $${paramIndex}`);
      values.push(indatetime);
      paramIndex++;
    }
    if (outdatetime !== undefined) {
      updates.push(`outdatetime = $${paramIndex}`);
      values.push(outdatetime);
      paramIndex++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(visitorId);

    const query = `
      UPDATE VisitorInfo
      SET ${updates.join(", ")}
      WHERE visitorid = $${paramIndex}
      RETURNING *`;

    const result = await c1.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Visitor not found after update" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating visitor:", error);
    res.status(500).json({
      error: "Error updating visitor",
      details: error.message,
    });
  }
};

// Delete visitor (member can delete their own visitors, admin can delete any)
const deleteVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;

    // First get the visitor to check ownership
    const visitorResult = await c1.query(
      "SELECT apartmentnumber FROM VisitorInfo WHERE visitorid = $1",
      [visitorId]
    );

    if (visitorResult.rows.length === 0) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    const result = await c1.query(
      "DELETE FROM VisitorInfo WHERE visitorId = $1 RETURNING *",
      [visitorId]
    );

    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    console.error("Error deleting visitor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Make sure this export is at the bottom of the file
module.exports = {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  createVisitorPublic,
};
