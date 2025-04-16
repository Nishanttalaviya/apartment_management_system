const { generateToken } = require("./jwtUtils");
const db = require("../DbConnections/postgresdb").connectionObj();

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find member by email
      const member = await db.query(
        `SELECT memberid, name, apartmentnumber as apartment_no, contact as phone, 
         email, wing as category, status, password 
         FROM Members WHERE email = $1`,
        [email]
      );

      if (member.rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Password comparison
      if (password !== member.rows[0].password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken(member.rows[0]);

      // Return member data without password
      const { password: _, ...memberData } = member.rows[0];

      res.json({
        message: "Login successful",
        token,
        expiresIn: 86400,
        member: memberData,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      // Get profile using memberid from token
      const member = await db.query(
        `SELECT memberid, name, apartmentnumber as apartment_no, contact as phone,
         email, wing as category, status
         FROM Members WHERE memberid = $1`,
        [req.member.memberid]
      );

      if (member.rows.length === 0) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.json(member.rows[0]);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
