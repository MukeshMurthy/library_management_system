const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, join_date FROM users"
    );
    res.status(200).json({ users: result.rows, flag: true });
  } catch (err) {
    console.error(" Error fetching users:", err);
    res.status(500).json({ message: "Server error", flag: false });
  }
});


router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const check = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "User not found", flag: false });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.status(200).json({ message: "User deleted successfully", flag: true });
  } catch (err) {
    console.error(" Error deleting user:", err);
    res.status(500).json({ message: "Server error", flag: false });
  }
});


router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, join_date FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found", flag: false });
    }
    res.status(200).json({ user: result.rows[0], flag: true });
  } catch (err) {
    console.error(" Error fetching user:", err);
    res.status(500).json({ message: "Server error", flag: false });
  }
});

module.exports = router;
