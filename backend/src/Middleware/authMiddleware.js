const { verifyToken } = require("../Auth/jwtUtils");
const db = require("../DbConnections/postgresdb").connectionObj();

const authenticateMember = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = verifyToken(token);

    // Fetch COMPLETE member data including apartment number
    const member = await db.query(
      `SELECT memberid, name, apartmentnumber as apartment_no, contact as phone,
       email, wing as category, status
       FROM Members WHERE memberid = $1`,
      [decoded.memberid]
    );

    if (member.rows.length === 0) {
      return res.status(401).json({ message: "Member not found" });
    }

    // Attach complete member data to request
    req.member = member.rows[0];
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = { authenticateMember };
