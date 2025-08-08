
const pool = require("../db");

const getOverdueBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, u.username, b.title, b.author 
       FROM borrow_records br
       JOIN users u ON br.user_id = u.id
       JOIN books b ON br.book_id = b.id
       WHERE br.status = 'borrowed' AND br.due_date < CURRENT_DATE
       ORDER BY br.due_date ASC`
    );

    res.status(200).json({ overdue: result.rows });
  } catch (err) {
    console.error(" Error fetching overdue books:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOverdueBooks,
};
