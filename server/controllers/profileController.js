const pool = require("../db");

const getProfile = async (req, res) => {
  const userId = req.params.id;
  console.log("🔁 Incoming GET /profile/:id request");
  console.log("📥 Params userId:", userId);

  try {
    
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found", flag: false });
    }

    const user = userResult.rows[0];

    const profileData = {
      username: user.username,
      email: user.email,
      join_date: user.join_date,
      role: user.role,
    };

    
    if (user.role === "user") {
      const borrowedBooks = await pool.query(
        `SELECT br.id, br.book_id, br.user_id, br.borrow_date, br.due_date, br.return_date, br.status,
                b.title, b.author
         FROM borrow_records br
         JOIN books b ON br.book_id = b.id
         WHERE br.user_id = $1 AND br.status = 'borrowed'`,
        [userId]
      );

      profileData.borrowedBooks = borrowedBooks.rows;
    }

    return res.status(200).json({ profile: profileData, flag: true });
  } catch (err) {
    console.error(" Profile fetch error:", err);
    return res.status(500).json({ message: "Server error", flag: false });
  }
};

module.exports = {
  getProfile,
};
