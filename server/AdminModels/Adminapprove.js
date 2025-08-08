const express = require("express");
const router = express.Router();
const pool = require("../db");


router.put("/approve/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {

    await pool.query("BEGIN");


    const requestResult = await pool.query(
      "SELECT * FROM borrow_requests WHERE id = $1 AND status = 'pending'",
      [requestId]
    );

    if (requestResult.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Request not found or already handled" });
    }

    const { user_id, book_id } = requestResult.rows[0];

   
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); 

    await pool.query(
      `INSERT INTO borrow_records (user_id, book_id, borrow_date, due_date, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, book_id, borrowDate, dueDate, 'borrowed']
    );

 
    const updateResult = await pool.query(
      "UPDATE books SET available_copies = available_copies - 1 WHERE id = $1 AND available_copies > 0",
      [book_id]
    );

    if (updateResult.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: "No available copies for this book" });
    }


    await pool.query(
      "UPDATE borrow_requests SET status = 'approved' WHERE id = $1",
      [requestId]
    );

    
    await pool.query("COMMIT");

    res.status(200).json({ message: "Request approved and book borrowed successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Approve request error:", err.message);
    res.status(500).json({ error: "Internal server error during approval" });
  }
});

router.put("/cancel/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    const result = await pool.query(
      "UPDATE borrow_requests SET status = 'cancelled' WHERE id = $1 AND status = 'pending'",
      [requestId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Request not found or already processed" });
    }

    res.status(200).json({ message: "Request cancelled successfully" });
  } catch (err) {
    console.error("Cancel request error:", err.message);
    res.status(500).json({ error: "Internal server error during cancellation" });
  }
});


module.exports = router;
