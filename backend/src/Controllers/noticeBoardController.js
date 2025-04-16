const p1 = require("../DbConnections/postgresdb");
const c1 = p1.connectionObj();

// Get all notices
const getAllNotices = async (req, res) => {
  try {
    const result = await c1.query(
      "SELECT * FROM NoticeBoard ORDER BY createdDate DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get notice by ID
const getNoticeById = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const result = await c1.query(
      "SELECT * FROM NoticeBoard WHERE noticeId = $1",
      [noticeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching notice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new notice with auto-incrementing ID
const createNotice = async (req, res) => {
   const { title, status, description, createdDate, expirationDate } = req.body;

   if (!title || !status || !description || !createdDate) {
     return res.status(400).json({ error: "Missing required fields" });
   }
  try {
    // Fetch the last inserted noticeId
    const lastIdResult = await c1.query(
      "SELECT noticeId FROM NoticeBoard ORDER BY noticeId DESC LIMIT 1"
    );

    let newId;
    if (lastIdResult.rows.length === 0) {
      newId = "N1"; // First entry
    } else {
      const lastNoticeId = lastIdResult.rows[0].noticeid; // Example: "N3"
      const lastNumber = parseInt(lastNoticeId.substring(1)); // Extract number part
      newId = `N${lastNumber + 1}`; // Increment and format new ID
    }

    const query = `
      INSERT INTO NoticeBoard (noticeId, title, status, description, createdDate, expirationDate)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [
      newId,
      title,
      status,
      description,
      createdDate,
      expirationDate,
    ];

    const result = await c1.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a notice
const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { title, status, description, expirationDate } = req.body;

    const result = await c1.query(
      "UPDATE NoticeBoard SET title = $1, status = $2, description = $3, expirationDate = $4 WHERE noticeId = $5 RETURNING *",
      [title, status, description, expirationDate, noticeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a notice
const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const result = await c1.query(
      "DELETE FROM NoticeBoard WHERE noticeId = $1 RETURNING *",
      [noticeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
