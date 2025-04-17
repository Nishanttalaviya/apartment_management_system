const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();
const fs = require("fs");
const path = require("path");
const { complaintUpload } = require("../Config/multerConfig");

// Get all complaints (Admin only)
const getAllComplaints = async (req, res) => {
  try {
    const result = await c1.query(`SELECT 
        c.complaintid,
        c.memberid,
        c.description,
        c.status,
        c.imageUrl,
        c.createdDate,
        c.resolvedDate,
        m.name,
        m.apartmentNumber
      FROM 
        Complaints c
      JOIN 
        Members m ON c.memberid = m.memberid
      ORDER BY c.createdDate DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get complaints for logged-in member
const getMyComplaints = async (req, res) => {
  try {
    const result = await c1.query(
      `SELECT 
        c.complaintid,
        c.memberid,
        c.description,
        c.status,
        c.imageUrl,
        c.createdDate,
        c.resolvedDate,
        m.name,
        m.apartmentNumber
      FROM 
        Complaints c
      JOIN 
        Members m ON c.memberid = m.memberid
      WHERE 
        c.memberid = $1
      ORDER BY c.createdDate DESC`,
      [req.member.memberid]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching member complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get single complaint (admin or owner)
const getComplaintById = async (req, res) => {
  try {
    const { complaintid } = req.params;

    const query = `
      SELECT 
        c.complaintid,
        c.memberid,
        c.description,
        c.status,
        c.imageUrl,
        c.createdDate,
        c.resolvedDate,
        m.name,
        m.apartmentnumber
      FROM 
        Complaints c
      JOIN 
        Members m ON c.memberid = m.memberid
      WHERE 
        c.complaintid = $1;
    `;

    const result = await c1.query(query, [complaintid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Check if requester is admin or complaint owner
    if (
      req.member.role !== "admin" &&
      req.member.memberid !== result.rows[0].memberid
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createComplaint = async (req, res) => {
  try {
    const { description } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    // Validate required fields
    if (!description) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        try {
          fs.unlinkSync(
            path.join(__dirname, "../uploads/complaints/", req.file.filename)
          );
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
      return res.status(400).json({ error: "Description is required" });
    }

    // Generate new complaint ID
    const lastIdResult = await c1.query(
      "SELECT complaintid FROM complaints ORDER BY complaintid DESC LIMIT 1"
    );

    let newId = "C1"; // Default starting ID
    if (lastIdResult.rows.length > 0) {
      const lastComplaintId = lastIdResult.rows[0].complaintid;
      const lastNumber = parseInt(lastComplaintId.substring(1)) || 0;
      newId = `C${lastNumber + 1}`;
    }

    const query = `
      INSERT INTO complaints 
        (complaintid, memberid, description, createddate, imageurl, status)
      VALUES ($1, $2, $3, NOW(), $4, 'Pending') 
      RETURNING *`;

    const values = [newId, req.member.memberid, description, imageUrl];

    const result = await c1.query(query, values);

    // Convert to full URL when returning
    const createdComplaint = result.rows[0];
    if (createdComplaint.imageurl) {
      createdComplaint.imageurl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/complaints/${createdComplaint.imageurl}`;
    }

    res.status(201).json(createdComplaint);
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      try {
        fs.unlinkSync(
          path.join(__dirname, "../uploads/complaints/", req.file.filename)
        );
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
    console.error("Error creating complaint:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update complaint status (Admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintid } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updateQuery = `
      UPDATE Complaints 
      SET status = $1, 
          resolvedDate = ${status === "Resolved" ? "NOW()" : "NULL"}
      WHERE complaintid = $2 
      RETURNING *`;

    const result = await c1.query(updateQuery, [status, complaintid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete complaint (Admin or owner)
const deleteComplaint = async (req, res) => {
  try {
    const { complaintid } = req.params;

    // First get the complaint to check ownership
    const complaintResult = await c1.query(
      "SELECT memberid FROM Complaints WHERE complaintid = $1",
      [complaintid]
    );

    if (complaintResult.rows.length === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Check if requester is admin or complaint owner
    if (
      req.member.role !== "admin" &&
      req.member.memberid !== complaintResult.rows[0].memberid
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const deleteResult = await c1.query(
      "DELETE FROM Complaints WHERE complaintid = $1 RETURNING *",
      [complaintid]
    );

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
