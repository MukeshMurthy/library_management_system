const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await pool.query(
      `SELECT b.title, b.author, br.borrow_date, br.due_date, br.return_date, br.status
       FROM books b
       JOIN borrow_records br ON b.id = br.book_id
       WHERE br.user_id = $1
       ORDER BY 
         CASE WHEN br.status = 'borrowed' THEN 0 ELSE 1 END,
         br.borrow_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching borrow history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
