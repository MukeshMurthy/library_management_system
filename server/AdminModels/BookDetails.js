const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);

    const borrowers = await pool.query(
      `SELECT br.*, u.username 
       FROM borrow_records br
       JOIN users u ON br.user_id = u.id
       WHERE br.book_id = $1 AND br.status = 'borrowed'`,
      [bookId]
    );

    res.status(200).json({
      book: book.rows[0],
      borrowers: borrowers.rows,
    });
  } catch (err) {
    console.error(" Error fetching book details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/book/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT br.*, u.username
       FROM borrow_records br
       JOIN users u ON br.user_id = u.id
       WHERE br.book_id = $1 AND br.status = 'borrowed'`,
      [bookId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching borrowers:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update-copies/:id", async (req, res) => {
  const bookId = req.params.id;
  const { total_copies, available_copies } = req.body;

  try {
    await pool.query(
      `UPDATE books SET total_copies = $1, available_copies = $2 WHERE id = $3`,
      [total_copies, available_copies, bookId]
    );

    res.status(200).json({ message: "Book copies updated successfully" });
  } catch (err) {
    console.error(" Error updating book copies:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
