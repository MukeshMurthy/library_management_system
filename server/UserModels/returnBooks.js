const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.id, b.title, b.author
       FROM books b
       JOIN borrow_records br ON b.id = br.book_id
       WHERE br.user_id = $1 AND br.status = 'borrowed'`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching borrowed books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/", async (req, res) => {
  const { userId, bookId } = req.body || {};

  if (!userId || !bookId) {
    return res.status(400).json({ error: "Missing userId or bookId in request body." });
  }

  try {
    
    const updateBorrow = await pool.query(
      `UPDATE borrow_records
       SET return_date = CURRENT_DATE, status = 'returned'
       WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'`,
      [userId, bookId]
    );

    if (updateBorrow.rowCount === 0) {
      return res.status(404).json({ message: "No active borrowed record found for this book." });
    }

   
    await pool.query(
      `UPDATE books SET available_copies = available_copies + 1 WHERE id = $1`,
      [bookId]
    );

    res.status(200).json({ message: "Book returned successfully." });
  } catch (err) {
    console.error("Return book error:", err);
    res.status(500).json({ error: "Internal server error during return" });
  }
});

module.exports = router;
