const pool = require("../db");

const getBorrowHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, u.username, b.title, b.author 
       FROM borrow_records br
       JOIN users u ON br.user_id = u.id
       JOIN books b ON br.book_id = b.id
       ORDER BY br.borrow_date DESC`
    );

    res.status(200).json({ history: result.rows });
  } catch (err) {
    console.error(" Error fetching borrow history:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBorrowHistory,
};
