const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();
const mailerService = require("../services/mailer.service");

// Get all members (Admin only)
const getAllMembers = async (req, res) => {
  try {
    const result = await c1.query("SELECT * FROM Members");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific member by ID (Admin or owner)
const getMemberById = async (req, res) => {
  try {
    const { memberId } = req.params;

    const result = await c1.query("SELECT * FROM Members WHERE memberid = $1", [
      memberId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new member (Admin only)
const createMember = async (req, res) => {
  const {
    name,
    apartmentnumber,
    contact,
    email,
    wing,
    family_members,
    joiningdate,
    status = "Active",
  } = req.body;

  try {
    // Generate temporary password first
    const tempPassword = "12345678"; // Replace with a secure random password generation logic

    // 1. FIRST send the welcome email
    try {
      await mailerService.sendWelcomeEmail(email, name, tempPassword);
      console.log(`Welcome email successfully sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      return res.status(500).json({
        error: "Failed to send welcome email",
        details: "Could not deliver credentials to member",
      });
    }

    // 2. ONLY AFTER email is sent, proceed with member creation
    const maxIdResult = await c1.query(`
      SELECT MAX(CAST(SUBSTRING(memberid, 2) AS INTEGER)) as max_id 
      FROM Members
    `);

    const newNumber = maxIdResult.rows[0].max_id
      ? maxIdResult.rows[0].max_id + 1
      : 1;
    const newMemberId = `M${newNumber}`;
    const hashedPassword = tempPassword; // Use the temp password as the hashed password for now;

    const query = `
      INSERT INTO Members 
        (memberid, name, apartmentnumber, contact, email, wing, 
         family_members, joiningdate, status, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING memberid, name, email, status`;

    const values = [
      newMemberId,
      name,
      apartmentnumber,
      contact,
      email,
      wing,
      family_members || "0",
      joiningdate,
      status,
      hashedPassword,
    ];

    const insertResult = await c1.query(query, values);

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error("Error in member creation process:", error);

    // Specific error for duplicate members
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Member with these details already exists",
        details: error.detail,
      });
    }

    // For other database errors
    res.status(500).json({
      error: "Internal Server Error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update a member (Simplified version without auth checks)
const updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const {
      name,
      apartmentnumber,
      contact,
      email,
      wing,
      family_members,
      joiningdate,
      status,
    } = req.body;

    // Build the update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(name = $`${paramIndex}`);
      values.push(name);
      paramIndex++;
    }
    if (apartmentnumber !== undefined) {
      updates.push(apartmentnumber = $`${paramIndex}`);
      values.push(apartmentnumber);
      paramIndex++;
    }
    if (contact !== undefined) {
      updates.push(contact = $`${paramIndex}`);
      values.push(contact);
      paramIndex++;
    }
    if (email !== undefined) {
      updates.push(email = $`${paramIndex}`);
      values.push(email);
      paramIndex++;
    }
    if (wing !== undefined) {
      updates.push(wing = $`${paramIndex}`);
      values.push(wing);
      paramIndex++;
    }
    if (family_members !== undefined) {
      updates.push(family_members = $`${paramIndex}`);
      values.push(family_members);
      paramIndex++;
    }
    if (joiningdate !== undefined) {
      updates.push(joiningdate = $`${paramIndex}`);
      values.push(new Date(joiningdate).toISOString());
      paramIndex++;
    }
    if (status !== undefined) {
      updates.push(status = $`${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    values.push(memberId);

    const query = `
      UPDATE Members 
      SET ${updates.join(", ")}
      WHERE memberid = $${paramIndex}
      RETURNING *`;

    const result = await c1.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Delete a member (Admin only)
const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await c1.query(
      "DELETE FROM Members WHERE memberid = $1 RETURNING *",
      [memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Toggle member status (Admin only)
const toggleMemberStatus = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status } = req.body;

    // First get current status
    const currentResult = await c1.query(
      "SELECT status FROM Members WHERE memberid = $1",
      [memberId]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const newStatus =
      currentResult.rows[0].status === "Active" ? "Inactive" : "Active";

    const result = await c1.query(
      "UPDATE Members SET status = $1 WHERE memberid = $2 RETURNING memberid, status",
      [newStatus, memberId]
    );

    res.json({
      message: "Status updated successfully",
      memberId: result.rows[0].memberid,
      newStatus: result.rows[0].status,
    });
  } catch (error) {
    console.error("Error toggling member status:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  toggleMemberStatus,
};