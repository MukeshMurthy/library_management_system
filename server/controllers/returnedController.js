const pool = require("../db");

const getReturnedBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, u.username, b.title, b.author 
       FROM borrow_records br
       JOIN users u ON br.user_id = u.id
       JOIN books b ON br.book_id = b.id
       WHERE br.status = 'returned'
       ORDER BY br.return_date DESC`
    );
    res.status(200).json({ returned: result.rows });
  } catch (err) {
    console.error(" Error fetching returned books:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getReturnedBooks,
};
