const express = require("express");
const pool = require("../db");
const router = express.Router();


router.get("/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE available = true");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching books:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/request/all', async (req, res) => {
  try {
    const requests = await pool.query(`
      SELECT br.id, br.user_id, br.book_id, br.status, br.request_date,
             u.username as user_name, b.title as book_title, b.author as book_author
      FROM borrow_requests br
      JOIN users u ON br.user_id = u.id
      JOIN books b ON br.book_id = b.id
      WHERE br.status = 'pending'
    `);
    res.json(requests.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get("/request/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM borrow_requests WHERE user_id = $1 AND status = 'pending'",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user borrow requests", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.post("/request", async (req, res) => {
  const { user_id, book_id } = req.body;

  if (!user_id || !book_id) {
    return res.status(400).json({ error: "user_id and book_id are required" });
  }

  try {
    // 1. Check if user has any overdue books
    const overdueCheck = await pool.query(
      `SELECT * FROM borrow_records 
       WHERE user_id = $1 AND status = 'borrowed' AND due_date < CURRENT_DATE`,
      [user_id]
    );
    if (overdueCheck.rowCount > 0) {
      return res.status(403).json({
        error: "You have overdue books. Please return them before making a new request.",
      });
    }

    // 2. Check if the user has already borrowed the book
    const activeBorrow = await pool.query(
      "SELECT * FROM borrow_records WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'",
      [user_id, book_id]
    );
    if (activeBorrow.rowCount > 0) {
      return res.status(400).json({
        error: "You have already borrowed this book. Please return it before requesting again.",
      });
    }

    // 3. Check if there is already a pending request for the same book
    const existingRequest = await pool.query(
      "SELECT * FROM borrow_requests WHERE user_id = $1 AND book_id = $2 AND status = 'pending'",
      [user_id, book_id]
    );
    if (existingRequest.rowCount > 0) {
      return res.status(400).json({
        error: "You already have a pending request for this book.",
      });
    }

    // 4. Create a new borrow request
    const insertQuery = `
      INSERT INTO borrow_requests (user_id, book_id, status, request_date)
      VALUES ($1, $2, 'pending', CURRENT_DATE)
      RETURNING *`;
    const result = await pool.query(insertQuery, [user_id, book_id]);

    res.status(201).json({ message: "Request sent to admin", request: result.rows[0] });
  } catch (err) {
    console.error("Error creating request:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/request/cancel/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    
    const result = await pool.query(
      `DELETE FROM borrow_requests 
       WHERE id = $1 AND status = 'pending' 
       RETURNING *`,
      [requestId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Request not found or already processed.",
      });
    }

    res.json({ message: "Borrow request cancelled successfully." });
  } catch (err) {
    console.error("Error cancelling request:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
