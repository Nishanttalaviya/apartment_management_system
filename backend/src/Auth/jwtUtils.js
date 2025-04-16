const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (member) => {
  return jwt.sign(
    {
      memberid: member.memberid, // Changed from memberId to memberid
      email: member.email,
      category: member.category,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
